const logger = require("npmlog");
let migrate = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 26) {
    logger.info("Running Migration 26");

    try {
      await db.sequelize.query(
        'ALTER TABLE "documents" DROP CONSTRAINT "documents_docName_key";'
      );
      await db.Document.sync({ alter: true });
    } catch (e) {
      logger.error("Migration error: ", e);
    }

    await db.DBState.update({ state: 26 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 26, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 26) {
    try {
      await db.sequelize.query(
        'ALTER TABLE "documents" ADD UNIQUE ("docName");'
      );
      await db.Document.sync({ alter: true });
    } catch (e) {
      logger.error("Migration error: ", e);
      throw e;
    }
    await db.DBState.update({ state: 25 }, { where: {}, returning: true });
    logger.info("Rollback 26 complete");
  } else {
    logger.info("Skipping Rollback 26, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
