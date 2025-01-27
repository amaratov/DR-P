const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 20) {
    logger.info("Running Migration 20");
    await db.ProjectDetail.sync({ alter: true });
    await db.DBState.update({ state: 20 }, { where: {}, returning: true });

  } else {
    logger.info("Skipping Migration 20, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 20) {

    await db.DBState.update({ state: 19 }, { where: {}, returning: true });
    logger.info("Rollback 20 complete");
  } else {
    logger.info("Skipping Rollback 20, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};

