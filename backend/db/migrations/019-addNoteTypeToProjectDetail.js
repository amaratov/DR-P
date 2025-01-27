const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 19) {
    logger.info("Running Migration 19");
    await db.ProjectDetail.sync({ alter: true });
    await db.DBState.update({ state: 19 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 19, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 18) {
    await db.ProjectDetail.sync({ alter: true });
    await db.DBState.update({ state: 18 }, { where: {}, returning: true });
    logger.info("Rollback 19 complete");
  } else {
    logger.info("Skipping Rollback 19, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
