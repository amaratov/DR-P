let migrate = async function(){
    var db = require('../db').init();
    var validator = require('validator');
    const logger = require('npmlog');

    let currState = (await db.DBState.findAll())[0]
    if (currState.state < 3){   
        logger.info("Running Migration 3");
        await db.Icon.sync({alter: true});
        await db.Document.sync({alter: true});
        await db.DBState.update({state: 3}, {where: {}, returning: true});
    }else{
        logger.info("Skipping Migration 3, database is already newer");
    }
        

}

let rollback = async function(){
    var db = require('../db').init();
    
    if (currState.state >= 3){
        
        await db.DBState.update({state: 2}, {where: {}, returning: true});
        logger.info("Rollback 3 complete");
    }else{
        logger.info("Skipping Rollback 3, database isn't newer")
    }
}

module.exports = {
    migrate: migrate,
    rollback: rollback
}