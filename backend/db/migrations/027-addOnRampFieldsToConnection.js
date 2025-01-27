const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  var validator = require("validator");
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 27) {
    logger.info("Running Migration 27");
    await db.Connection.sync({ alter: true });
    await db.DBState.update({ state: 27 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 27, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 27) {
    await db.DBState.update({ state: 26 }, { where: {}, returning: true });
    logger.info("Rollback 27 complete");
  } else {
    logger.info("Skipping Rollback 27, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
