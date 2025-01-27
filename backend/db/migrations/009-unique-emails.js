const logger = require("npmlog");

let migrate = async function () {
  var db = require("../db").init();

  let currState = (await db.DBState.findAll())[0]
  if (currState.state < 9) {
    logger.info("Running Migration 9");

    await db.sequelize.query(`
      DELETE FROM
        users u1
        USING users u2
      WHERE u1."createdAt" > u2."createdAt"
        AND lower(u1."email") = lower(u2."email")
    `, {
      logging: logger.info,
      raw: true,
    });

    await db.sequelize.query('UPDATE users SET "email" = LOWER("email")', {
      logging: logger.info,
      raw: true
    });

    await db.User.sync({ alter: true });
    await db.DBState.update({ state: 9 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 9, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  let currState = (await db.DBState.findAll())[0]
  if (currState.state >= 9) {
    await db.DBState.update({ state: 8 }, { where: {}, returning: true });
    logger.info("Rollback 9 complete");
  } else {
    logger.info("Skipping Rollback 9, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
