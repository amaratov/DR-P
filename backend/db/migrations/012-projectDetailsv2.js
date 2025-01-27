const logger = require("npmlog");

let migrate = async function () {
  var db = require("../db").init();

  let currState = (await db.DBState.findAll())[0]
  if (currState.state < 12) {
    logger.info("Running Migration 12");

    await db.ProjectDetail.sync({ alter: true, force: true });
    await db.DBState.update({ state: 12 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 12, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  let currState = (await db.DBState.findAll())[0]
  if (currState.state >= 12) {
    await db.ProjectDetail.sync({ alter: true });
    await db.DBState.update({ state: 11 }, { where: {}, returning: true });
    logger.info("Rollback 12 complete");
  } else {
    logger.info("Skipping Rollback 12, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
