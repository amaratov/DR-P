let migrate = async function(){
    var db = require('../db').init();
    var validator = require('validator');
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 14){   
        logger.info("Running Migration 14");
        await db.Connection.sync({alter: true});
        await db.Tag.sync({alter: true});
        await db.DBState.update({state: 14}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 14, database is already newer");
    }
}

let rollback = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state >= 14){

        await db.DBState.update({state: 13}, {where: {}, returning: true});
        logger.info("Rollback 14 complete");
    }else{
        logger.info("Skipping Rollback 14, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}