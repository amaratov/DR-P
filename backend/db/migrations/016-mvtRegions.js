let migrate = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 16){   
        logger.info("Running Migration 16");
        await db.Connection.sync({alter: true, force: true});
        await db.ProjectDetail.sync({alter: true});
        await db.DBState.update({state: 16}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 16, database is already newer");
    }
}

let rollback = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state >= 15){

        await db.DBState.update({state: 15}, {where: {}, returning: true});
        logger.info("Rollback 16 complete");
    }else{
        logger.info("Skipping Rollback 16, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}