const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  var validator = require("validator");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 8) {
    logger.info("Running Migration 8");
    await db.Icon.sync({ alter: true });
    await db.DBState.update({ state: 8 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 8, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();

  if (currState.state >= 8) {
    await db.DBState.update({ state: 7 }, { where: {}, returning: true });
    logger.info("Rollback 8 complete");
  } else {
    logger.info("Skipping Rollback 8, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
