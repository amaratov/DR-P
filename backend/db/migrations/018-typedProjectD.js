let migrate = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 18){   
        logger.info("Running Migration 18");
        await db.ProjectDetail.sync({alter: true});
        await db.DBState.update({state: 18}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 18, database is already newer");
    }
}

let rollback = async function(){
    var db = require('../db').init();
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state >= 17){
        await db.ProjectDetail.sync({alter: true});
        await db.DBState.update({state: 17}, {where: {}, returning: true});
        logger.info("Rollback 18 complete");
    }else{
        logger.info("Skipping Rollback 18, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}