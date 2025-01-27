const LIST_MY_COMPANY_ROLES = ['sales', 'solutions architect', 'customer', 'solutions engineer'];
const LIST_COMPANY_ROLES = ['sales', 'solutions architect', 'solutions engineer', "marketing"];
const GET_COMPANY_ROLES = ['sales', 'solutions architect', 'customer', 'solutions engineer'];
const EDIT_COMPANY_ROLES = ['sales', 'solutions architect'];
const CREATE_COMPANY_ROLES = ['sales', 'solutions architect'];
const DELETE_COMPANY_ROLES = ['sales', 'solutions architect'];

var buildStatic = function(db, router){
    return router;
}


var buildDynamic = function(db, router, auth){
    const defaults = require('./defaults');
    const sequelize = require('sequelize');
    const OP = sequelize.Op;

    async function findCompanies(req, my = false){
        let limit = defaults.LIMIT;
        let offset = defaults.OFFSET;
        let q = {
            // limit: defaults.LIMIT,
            // offset: defaults.OFFSET,
            distinct: true,
            order: [['name', 'desc']],
            include: [
                {
                    model: db.User, 
                    as: "fullCreatedBy",
                    attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
                },
                {
                    model: db.Project,
                    required: false,
                    include: [{
                        model: db.User,
                        as: "fullCreatedBy",
                        attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
                    }]
                },
            ],
            where: {},
            subQuery: false,
        };

        //pg-mem doesn't like many-many
        if (process.env.NODE_ENV !== 'test'){
            if (my){
                q.include.push({
                    model: db.User,
                    where: {
                        id: req.user.id
                    },
                    as: "users",
                    required: true,
                    attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
                    through: {
                      attributes: [],
                    }
                });
                q.include[1].include.push({
                    model: db.User,
                    where: {
                        id: req.user.id
                    },
                    as: "users",
                    required: false,
                    attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
                    through: {
                      attributes: [],
                    }
                });
            }

            q.include.push({
                model: db.User,
                as: "associatedUsers",
                attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
                through: { attributes: [] }
            });
            q.include[1].include.push({
                model: db.User,
                as: "associatedUsers",
                attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
                through: { attributes: [] }
            });
        }

        let page = 0;

        if (typeof(req.query.limit) !== 'undefined'){
            if (req.query.limit > defaults.LIMIT_LIMIT){
                throw new Error(`Limit must be less than ${defaults.LIMIT_LIMIT}`);
            }else if (req.query.limit < 0){
                throw new Error(`Limit must be 0 or more`);
            }else{
                // q.limit = req.query.limit
                limit = req.query.limit;
            }
        }

        if (typeof(req.query.page) !== 'undefined'){
            if (req.query.page < 0){
                throw new Error(`Page must be 0 or more`);
            }else{
                offset = req.query.page * limit
                page = req.query.page;
            }
        }

        // If project count sort is in effect, do it at the end of the row gather for projects
        const projectCountSortCheck = req.query.order?.[0]?.[0] == "name" && req.query.order?.[1]?.[0] == "id" && req.query.order?.[2]?.[0] == "industryVertical";

        if (req.query.order && !projectCountSortCheck) {
            try {
                let order = req.query.order;
                order = JSON.parse(order);
                q.order = order;
            } catch (e) {
                q.order = req.query.order;
            }
        }

        let searchProject = (req.query && req.query.includeProject) ? true : false;

        if (req.query.name){
            if (searchProject){
                q.where[OP.or] = []
                q.where[OP.or].push(
                    { name: {[OP.iLike]: req.query.name } },
                );
                q.where[OP.or].push(
                    {'$projects.title$': { [OP.iLike]: req.query.name }}
                );
            }else{
                q.where.name = { [OP.iLike]: req.query.name };
            }
        }

        if (typeof(req.query.archived) !== 'undefined'){
            let archivedVal = req.query.archived.toLowerCase() === 'true'
            q.where.archived = archivedVal
            if (searchProject){
                // console.log("searching archive project");
                q.include[1].where = {archived: archivedVal}
                
            }
        }

        if (req.query.industryVertical){
            let vertArr = JSON.parse(req.query.industryVertical);
            q.where.industryVertical = { [OP.contains]: vertArr };
        }

        let comps = await db.Company.findAndCountAll(q);
        let rv = JSON.parse(JSON.stringify(comps.rows));

        //remove projects that aren't visible for my
        if (my){
            for (let i=0; i<rv.length; i++){
                rv[i].projects = rv[i].projects.filter( comp => {
                    return comp.users.length > 0;
                })
                rv[i].projectCount = rv[i].projects.length || 0;
            }
        } else {
            for (let i=0; i<rv.length; i++){
                rv[i].projectCount = rv[i].projects.length || 0;
            }
        }
        // If project count sort is in effect, do it here
        if (projectCountSortCheck) {
            rv.sort(function (a, b) {
                const aProjectCount = a?.projectCount || 0;
                const bProjectCount = b?.projectCount || 0;
                if (req.query.order?.[0]?.[1] === 'asc') {
                    return aProjectCount - bProjectCount;
                }
                return bProjectCount - aProjectCount;
            });
        }
        comps.rows = JSON.parse(JSON.stringify(rv));

        comps.rows = comps.rows.slice(offset, offset+limit);
        comps.numPages = Math.ceil(comps.count / limit);
        comps.page = page;
        return comps;
    }

    router.get('/', auth.requireLoggedIn, auth.requireRoleIn(LIST_COMPANY_ROLES), async function(req, res, next){
        try{
            let resp = {};

            const companys = await findCompanies(req)
            let numRecords = companys.count;
            resp.total = numRecords;
            resp.numPages = companys.numPages;
            resp.page = companys.page;

            delete companys.count;
            delete companys.numPages;
            delete companys.page;
            
            resp.companies = companys.rows;
            
            
            res.status(200).json(resp);
        }catch(e){
           res.status(500).json({error: e.message});
        }
    });

    router.get('/my', auth.requireLoggedIn, auth.requireRoleIn(LIST_MY_COMPANY_ROLES), async function(req, res, next){
        try{
            let resp = {};
            
            const companys = await findCompanies(req, true)
            let numRecords = companys.count;
            resp.total = numRecords;
            resp.numPages = companys.numPages;
            resp.page = companys.page;

            delete companys.count;
            delete companys.numPages;
            delete companys.page;
            
            resp.companies = companys.rows;
            
            res.status(200).json(resp);
        }catch(e){
            res.status(500).json({error: e.message});
        }
    });

    router.get('/:id', auth.requireLoggedIn, auth.requireRoleIn(GET_COMPANY_ROLES), async function(req, res, next){
        try{
            let q = {
                include: [
                    {
                        model: db.User, 
                        as: "fullCreatedBy",
                        attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
                    },
                ]
            };
            if (process.env.NODE_ENV !== 'test'){
                q.include.push({
                    model: db.User,
                    as: "associatedUsers",
                    attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
                    through: { attributes: [] }
                });
            }
            const company = await db.Company.findByPk(req.params.id, q);

            if (company === null){
                return res.status(404).json({error: "Not Found"});
            }

            let canUserGet = auth.hasRoleIn(LIST_COMPANY_ROLES, req.user)

            if (!canUserGet && process.env.NODE_ENV !== "test"){
                for (let i=0; i<company.associatedUsers.length; i++){
                    if (company.associatedUsers[i].id === req.user.id){
                        canUserGet = true;
                        break;
                    }
                }
            }

            if (!canUserGet){
                return res.status(404).json({error: "Not Found"});
            }
            
            res.json({company: company});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    });

    router.post('/', auth.requireLoggedIn, auth.requireRoleIn(CREATE_COMPANY_ROLES), async function(req, res, next){
        try{
            if (!req.body || !req.body.name){
                return res.status(400).json({error: "name is required"});
            }

            let data = {
                name: req.body.name,
                createdBy: req.user.id
            }

            if (req.body.industryVertical){
                data.industryVertical = req.body.industryVertical;
            }

            if (req.body.salesforceId){
                data.salesforceId = req.body.salesforceId;
            }

            // if (req.body.associatedUsers){
            //     data.associatedUsers = req.body.associatedUsers;
            // }
                
            const company = await db.Company.create(data);

            //pg-mem doens't work with many-many
            if (process.env.NODE_ENV !== 'test'){
                if ( (req.body.associatedUsers) && (Array.isArray(req.body.associatedUsers)) ){
                    for (let i=0; i<req.body.associatedUsers.length; i++){
                        let associatedData = {
                            userId: req.body.associatedUsers[i],
                            companyId: company.id
                        }
                        let userExists = await db.User.findByPk(associatedData.userId)
                        if (userExists !== null){
                            await db.UserCompany.create(associatedData)
                        }
                    }
                }
            }
            
            res.status(201).json({company: company});
        }catch(e){
            res.status(500).json({error: e});
        }
    });

    router.put('/:id/activate', auth.requireLoggedIn, auth.requireRoleIn(EDIT_COMPANY_ROLES), async function(req, res, next){
        let data = {archived: false};
            
        const company = await db.Company.update(data, {where: {id: req.params.id}, returning: true});
        
        res.status(200).json({company: company[1][0]});
    });

    router.put('/:id', auth.requireLoggedIn, auth.requireRoleIn(EDIT_COMPANY_ROLES), async function(req, res, next){
        try{
            let data = {}

            if (typeof(req.body.name) !== 'undefined'){
                data.name = req.body.name;
            }

            if (typeof(req.body.industryVertical) !== 'undefined'){
                data.industryVertical = req.body.industryVertical;
            }

            if (typeof(req.body.salesforceId) !== 'undefined'){
                data.salesforceId = req.body.salesforceId;
            }

            //pg-mem doens't work with many-many
            if (process.env.NODE_ENV !== 'test'){
                if ( (req.body.associatedUsers) && (Array.isArray(req.body.associatedUsers)) ){
                    await db.UserCompany.destroy({where: {companyId: req.params.id}});
                    for (let i=0; i<req.body.associatedUsers.length; i++){
                        let associatedData = {
                            userId: req.body.associatedUsers[i],
                            companyId: req.params.id
                        }
                        let userExists = await db.User.findByPk(associatedData.userId)
                        if (userExists !== null){
                            await db.UserCompany.create(associatedData)
                        }
                    }
                }
            }
            
            const company = await db.Company.update(data, {where: {id: req.params.id}, returning: true});
            
            if (typeof(company[1]) === 'undefined'){
                const origCompany = await db.Company.findOne({where: {id: req.params.id}});
                if (origCompany === null){
                    res.status(404).json({error: "Not Found"})
                }
                return res.status(200).json({company: origCompany});
            }

            res.status(200).json({company: company[1][0]});
        }catch(e){
            res.status(500).json({error: e.message});
        }
    });

    router.delete('/:id', auth.requireLoggedIn, auth.requireRoleIn(DELETE_COMPANY_ROLES), async function(req, res, next){
        try{
            let data = {archived: true};
            
            const company = await db.Company.update(data, {where: {id: req.params.id}, returning: true});
            
            res.status(200).json({company: company[1][0]});
        }catch(e){
            res.status(500).json({error: e});
        }
    });

    return router;
}

module.exports = {
    buildStatic: buildStatic,
    buildDynamic: buildDynamic
};