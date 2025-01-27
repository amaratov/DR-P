const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 23) {
    logger.info("Running Migration 23");
    await db.ProjectDetail.sync({ alter: true });
    await db.DBState.update({ state: 23 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 23, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 23) {
    await db.ProjectDetail.update(
      { state: 22 },
      { where: {}, returning: true }
    );
    logger.info("Rollback 23 complete");
  } else {
    logger.info("Skipping Rollback 23, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
