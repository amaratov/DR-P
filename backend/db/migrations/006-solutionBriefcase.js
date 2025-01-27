const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  var validator = require("validator");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 6) {
    logger.info("Running Migration 6");
    await db.Icon.sync({ alter: true });
    await db.Document.sync({ alter: true });
    await db.ProjectDetail.sync({ alter: true });
    await db.ProjectBriefcase.sync({ alter: true });
    await db.SolutionBriefcase.sync({ alter: true });
    await db.DBState.update({ state: 6 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 6, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();

  if (currState.state >= 6) {
    await db.DBState.update({ state: 5 }, { where: {}, returning: true });
    logger.info("Rollback 6 complete");
  } else {
    logger.info("Skipping Rollback 6, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
