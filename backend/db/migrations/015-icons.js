let migrate = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 15){   
        logger.info("Running Migration 15");
        await db.Icon.sync({alter: true});
        await db.DBState.update({state: 15}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 15, database is already newer");
    }
}

let rollback = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state >= 15){

        await db.DBState.update({state: 14}, {where: {}, returning: true});
        logger.info("Rollback 15 complete");
    }else{
        logger.info("Skipping Rollback 15, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}