const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 24) {
    logger.info("Running Migration 24");
    await db.SolutionBriefcase.sync({ alter: true });
    await db.DBState.update({ state: 24 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 24, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 24) {
    await db.DBState.update({ state: 23 }, { where: {}, returning: true });
    logger.info("Rollback 24 complete");
  } else {
    logger.info("Skipping Rollback 24, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
