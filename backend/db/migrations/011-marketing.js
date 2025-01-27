let migrate = async function(){
    var db = require('../db').init();
    var validator = require('validator');
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 11){   
        logger.info("Running Migration 11");
        await db.Document.sync({alter: true});
        await db.DBState.update({state: 11}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 11, database is already newer");
    }
}

let rollback = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state >= 11){

        await db.DBState.update({state: 10}, {where: {}, returning: true});
        logger.info("Rollback 11 complete");
    }else{
        logger.info("Skipping Rollback 11, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}