const sequelize = require('sequelize');
module.exports.findProjects = function(db, defaults) {
    return async function(req, my = false){
        const OP = sequelize.Op;
        let q = {
        limit: defaults.LIMIT,
        offset: defaults.OFFSET,
        where: {},
        distinct: true,
        order: [["title", "desc"]],
        include: [
            {
            model: db.User,
            as: "fullCreatedBy",
            attributes: {
                exclude: ["password", "salt", "resetCode", "resetExpiry"],
            },
            },
            {
            model: db.Company,
            as: "company",
            },
        ],
        };

        //pg-mem doesn't like many-many
        if (process.env.NODE_ENV !== "test") {
        let assoc = {};

        if (my) {
            assoc = {
            model: db.User,
            as: "users",
            attributes: [],
            through: {
                attributes: [],
            },
            };
            assoc.where = {
            id: req.user.id,
            };

            q.include.push(assoc);
        }

        assoc = {
            model: db.User,
            as: "associatedUsers",
            attributes: {
            exclude: ["password", "salt", "resetCode", "resetExpiry"],
            },
            through: {
            attributes: [],
            },
        };

        q.include.push(assoc);
        }

        let page = 0;

        if (typeof req.query.limit !== "undefined") {
        if (req.query.limit > defaults.LIMIT_LIMIT) {
            throw new Error(`Limit must be less than ${defaults.LIMIT_LIMIT}`);
        } else if (req.query.limit < 0) {
            throw new Error(`Limit must be 0 or more`);
        } else {
            q.limit = req.query.limit;
        }
        }

        if (typeof req.query.page !== "undefined") {
        if (req.query.page < 0) {
            throw new Error(`Page must be 0 or more`);
        } else {
            let offset = req.query.page * q.limit;
            q.offset = offset;
            page = req.query.page;
        }
        }

        if (req.query.order) {
        let order = req.query.order;
        order = JSON.parse(order);
        q.order = order;
        }

        if (req.query.title) {
        q.where.title = { [OP.iLike]: req.query.title };
        }

        if (req.query.archived) {
        q.where.archived = req.query.archived;
        }

        if (req.query.useCase) {
        let useArr = JSON.parse(req.query.useCase);
        q.where.useCase = { [OP.contains]: useArr };
        }

        if (req.params.id) {
        q.where.id = req.params.id;
        }

        let comps = await db.Project.findAndCountAll(q);
        comps.numPages = Math.ceil(comps.count / q.limit);
        comps.page = page;
        return comps;
    }
}