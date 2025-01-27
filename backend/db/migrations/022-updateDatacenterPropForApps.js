const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 22) {
    logger.info("Running Migration 22");

    await db.sequelize.query(`
      UPDATE "projectDetails"
      SET extras = (extras::jsonb - 'dataCenters' || jsonb_build_object('datacenters', extras::jsonb -> 'dataCenters'))::json
      WHERE extras::jsonb ? 'dataCenters';

    `, {
      logging: logger.info,
      raw: true,
    }); 

    await db.Project.sync({ alter: true });
    await db.DBState.update({ state: 22 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 22, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 22) {
    await db.DBState.update({ state: 21 }, { where: {}, returning: true });
    logger.info("Rollback 22 complete");
  } else {
    logger.info("Skipping Rollback 22, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
