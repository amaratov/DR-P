let migrate = async function(){
    var db = require('../db').init();
    var validator = require('validator');
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 13){   
        logger.info("Running Migration 13");
        await db.Document.sync({alter: true});
        await db.DBState.update({state: 13}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 13, database is already newer");
    }
}

let rollback = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state >= 13){

        await db.DBState.update({state: 12}, {where: {}, returning: true});
        logger.info("Rollback 13 complete");
    }else{
        logger.info("Skipping Rollback 13, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
    
}