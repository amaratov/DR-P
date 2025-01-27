const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 25) {
    logger.info("Running Migration 25");
    await db.ProjectBriefcase.sync({ alter: true });
    await db.DBState.update({ state: 25 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 25, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 25) {
    await db.DBState.update({ state: 24 }, { where: {}, returning: true });
    logger.info("Rollback 25 complete");
  } else {
    logger.info("Skipping Rollback 25, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
