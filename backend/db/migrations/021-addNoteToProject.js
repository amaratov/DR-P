const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 21) {
    logger.info("Running Migration 21");
    await db.Project.sync({ alter: true });
    await db.DBState.update({ state: 21 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 21, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 21) {
    await db.DBState.update({ state: 20 }, { where: {}, returning: true });
    logger.info("Rollback 21 complete");
  } else {
    logger.info("Skipping Rollback 21, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
