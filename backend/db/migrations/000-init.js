let migrate = async function(){
    var db = require('../db').init();
    var config = require('config');
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 0){
        await db.Role.sync({alter: true});
        await db.User.sync({alter: true});
        await db.UseCase.sync({alter: true});
        await db.IndustryVertical.sync({alter: true});
        await db.Company.sync();
        await db.Project.sync();
        await db.UserCompany.sync({alter: true});
        await db.UserProject.sync({alter: true});

        let roles = await db.Role.findAll();
        if (roles.length <= 6){
            let data = {
                name: 'admin',
                archived: false
            }
            let role = await db.Role.findOrCreate({where: data});
            logger.info("Role created", role);

            data.name = 'customer';
            role = await db.Role.findOrCreate({where: data});
            logger.info("Role created", role);

            data.name = 'sales';
            role = await db.Role.findOrCreate({where: data});
            logger.info("Role created", role);

            data.name = 'solutions architect';
            role = await db.Role.findOrCreate({where: data});
            logger.info("Role created", role);

            data.name = 'solutions engineer';
            role = await db.Role.findOrCreate({where: data});
            logger.info("Role created", role);

            data.name = 'marketing';
            role = await db.Role.findOrCreate({where: data});
            logger.info("Role created", role);

            roles = await db.Role.findAll();
        }

        let initAdmin = config.has('initialAdmin') ? JSON.parse(JSON.stringify(config.get('initialAdmin'))) : false;

        if (initAdmin){
            let initAdminRole = initAdmin.role;
            delete initAdmin.role;
            logger.info("Initializing admin");
            let adminRole = null;

            for (let i=0; i<roles.length; i++){
                if (roles[i].name.toLowerCase() === initAdminRole.toLowerCase()){
                    adminRole = roles[i].id;
                    break;
                }
            }
            if (adminRole === null){
                console.error("Could not find admin role not bootstrapping admin user");
            }else{
                initAdmin.role = adminRole;
                // try{
                    let password = initAdmin.password;
                    initAdmin.salt = '';
                    delete initAdmin.password
                    initAdmin.salt = '';
                    let u = await db.User.findOrCreate({where: initAdmin, defaults: { password: password }});
                    logger.info("Admin created or exists:", u[0].dataValues);
                // }catch(e){
                //     console.error(e);
                // }
            }
        }


        let industryVerticals = await db.IndustryVertical.findAll();
        if (industryVerticals.length <= 0){
            let data = {
                name: 'Aritificial Intelligence',
                archived: false
            }
            
            let iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            data.name = 'Cloud';
            iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            data.name = 'Digital Media';
            iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            data.name = 'Financial Services';
            iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            data.name = 'Gaming';
            iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            data.name = 'Health Care';
            iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            data.name = 'Mobile';
            iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            data.name = 'Networks';
            iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            data.name = 'Other';
            iv = await db.IndustryVertical.findOrCreate({where: data});
            logger.info("Industry Vertical created", iv);

            industryVerticals = await db.IndustryVertical.findAll();
        }

        let useCases = await db.UseCase.findAll();
        if (useCases.length <= 0){
            let data = {
                name: 'Accomodation',
                archived: false
            }
            let uc = await db.UseCase.findOrCreate({where: data});
            logger.info("Use Case created", uc);

            data.name = 'Accomodation and Food services';
            uc = await db.UseCase.findOrCreate({where: data});
            logger.info("Use Case created", uc);

            data.name = 'Consumer Technology';
            uc = await db.UseCase.findOrCreate({where: data});
            logger.info("Use Case created", uc);

            data.name = 'Administrative and Support and Waste Management and Remediation';
            uc = await db.UseCase.findOrCreate({where: data});
            logger.info("Use Case created", uc);

            data.name = 'Building Material and Garden Equipment and ...';
            uc = await db.UseCase.findOrCreate({where: data});
            logger.info("Use Case created", uc);

            data.name = 'Other';
            uc = await db.UseCase.findOrCreate({where: data});
            logger.info("Use Case created", uc);

            
            useCases = await db.UseCase.findAll();
        }

        await db.DBState.update({state: 0}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 0, database is already newer");
    }

}

let rollback = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');
    let currState = (await db.DBState.findAll())[0];
    if (currState.state >= 0){
        await db.sequelize.sync({force: true});
        await db.DBState.update({state: -1}, {where: {}, returning: true});
        logger.info("Rollback 0 complete");
    }else{
        logger.info("Skipping rollback 0 database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}
