const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  var validator = require("validator");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 7) {
    logger.info("Running Migration 7");
    await db.Icon.sync({ alter: true });
    await db.Document.sync({ alter: true });
    await db.ProjectDetail.sync({ alter: true });
    await db.ProjectBriefcase.sync({ alter: true });
    await db.SolutionBriefcase.sync({ alter: true });
    await db.Compliance.sync({ alter: true });
    await db.DBState.update({ state: 7 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 7, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();

  if (currState.state >= 7) {
    await db.DBState.update({ state: 6 }, { where: {}, returning: true });
    logger.info("Rollback 7 complete");
  } else {
    logger.info("Skipping Rollback 7, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
