let migrate = async function(){
    var db = require('../db').init();
    var validator = require('validator');
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 2){   
        logger.info("Running Migration 2");
        await db.Icon.sync({alter: true});
        await db.DBState.update({state: 2}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 2, database is already newer");
    }
        

}

let rollback = async function(){
    var db = require('../db').init();
    
    if (currState.state >= 2){
        
        await db.DBState.update({state: 1}, {where: {}, returning: true});
        logger.info("Rollback 2 complete");
    }else{
        logger.info("Skipping Rollback 2, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}