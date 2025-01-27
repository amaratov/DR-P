let migrate = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 17){   
        logger.info("Running Migration 17");
        await db.Connection.sync({alter: true, force: true});
        await db.ProjectDetail.sync({alter: true});
        await db.DBState.update({state: 17}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 17, database is already newer");
    }
}

let rollback = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state >= 16){

        await db.DBState.update({state: 16}, {where: {}, returning: true});
        logger.info("Rollback 17 complete");
    }else{
        logger.info("Skipping Rollback 17, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}