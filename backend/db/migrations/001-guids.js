let migrate = async function () {
  var db = require("../db").init();
  var validator = require("validator");
  const logger = require("npmlog");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 1 || currState.state === 20) {
    const companies = await db.Company.findAll();
    logger.info("Migrating " + companies.length + " companies");
    let skipped = 0;
    let migrated = 0;
    let failedNoVert = 0;
    let failed = 0;

    for (let i = 0; i < companies.length; i++) {
      let data = {
        industryVertical: [],
      };
      let migratedAny = false;
      for (let j = 0; j < companies[i].industryVertical.length; j++) {
        if (
          !validator.isUUID(companies[i].industryVertical[j]) &&
          companies[i].industryVertical[j].length > 0
        ) {
          let vert = await db.IndustryVertical.findAll({
            where: { name: companies[i].industryVertical[j] },
          });
          if (vert.length === 0 || vert[0] === null) {
            failedNoVert++;
          } else {
            data.industryVertical.push(vert[0].id);
            migratedAny = true;
          }
        }
      }
      if (companies[i].industryVertical.length > 0 && !migratedAny) {
        skipped++;
      } else {
        try {
          await db.Company.update(data, {
            where: { id: companies[i].id },
            returning: true,
          });
          migrated++;
        } catch (e) {
          failed++;
        }
      }
    }

    logger.info("--------------------------------------------------");
    logger.info("GUID Company Migration");
    logger.info("Migrated: " + migrated);
    logger.info("Skipped: " + skipped);
    logger.info("Failed: " + failed);
    logger.info("Failed no Vertical: " + failedNoVert);
    logger.info("Total Failed: " + (failed + failedNoVert));
    logger.info("Total Records " + companies.length);
    logger.info("--------------------------------------------------");

    const projects = await db.Project.findAll();
    logger.info("Migrating " + projects.length + " projects");
    skipped = 0;
    migrated = 0;
    failedNoVert = 0;
    failed = 0;

    for (let i = 0; i < projects.length; i++) {
      let data = {
        useCases: [],
      };
      let migratedAny = false;
      for (let j = 0; j < projects[i].useCases.length; j++) {
        if (
          !validator.isUUID(projects[i].useCases[j]) &&
          projects[i].useCases[j].length > 0
        ) {
          let usec = await db.UseCase.findAll({
            where: { name: projects[i].useCases[j] },
          });
          if (usec.length === 0 || usec[0] === null) {
            failedNoVert++;
          } else {
            data.useCases.push(usec[0].id);
            migratedAny = true;
          }
        }
      }
      if (projects[i].useCases.length > 0 && !migratedAny) {
        skipped++;
      } else {
        try {
          await db.Project.update(data, {
            where: { id: projects[i].id },
            returning: true,
          });
          migrated++;
        } catch (e) {
          failed++;
        }
      }
    }

    logger.info("GUID Project Migration");
    logger.info("Migrated: " + migrated);
    logger.info("Skipped: " + skipped);
    logger.info("Failed: " + failed);
    logger.info("Failed no Use Case: " + failedNoVert);
    logger.info("Total Failed: " + (failed + failedNoVert));
    logger.info("Total Records " + projects.length);
    logger.info("--------------------------------------------------");

    try {
      await db.sequelize.query(
        'ALTER TABLE "companies" ALTER COLUMN "industryVertical" SET NOT NULL;ALTER TABLE "companies" ALTER COLUMN "industryVertical" SET DEFAULT ARRAY[]::UUID[];ALTER TABLE "companies" ALTER COLUMN "industryVertical" TYPE UUID[] USING "industryVertical"::uuid[];'
      );
      await db.sequelize.query(
        'ALTER TABLE "projects" ALTER COLUMN "useCases" SET NOT NULL;ALTER TABLE "projects" ALTER COLUMN "useCases" SET DEFAULT ARRAY[]::UUID[];ALTER TABLE "projects" ALTER COLUMN "useCases" TYPE UUID[] USING "useCases"::uuid[];'
      );
      await db.Company.sync({ alter: true });
      await db.Project.sync({ alter: true });
    } catch (e) {
      logger.error("Migration error: ", e);
    }

    await db.DBState.update({ state: 1 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 1, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();
  db.Company = require("./oldModels/001/company")(db.sequelize);
  db.Project = require("./oldModels/001/project")(db.sequelize);
  const logger = require("npmlog");
  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 1) {
    try {
      await db.sequelize.query(
        'ALTER TABLE "companies" ALTER COLUMN "industryVertical" SET NOT NULL;ALTER TABLE "companies" ALTER COLUMN "industryVertical" TYPE VARCHAR(255)[] USING "industryVertical"::varchar[];ALTER TABLE "companies" ALTER COLUMN "industryVertical" SET DEFAULT ARRAY[]::VARCHAR(255)[];'
      );
      await db.sequelize.query(
        'ALTER TABLE "projects" ALTER COLUMN "useCases" SET NOT NULL;ALTER TABLE "projects" ALTER COLUMN "useCases" TYPE VARCHAR(255)[] USING "useCases"::varchar[];ALTER TABLE "projects" ALTER COLUMN "useCases" SET DEFAULT ARRAY[]::VARCHAR(255)[];'
      );
      await db.Company.sync({ alter: true });
      await db.Project.sync({ alter: true });
    } catch (e) {
      logger.error("Migration error: ", e);
      throw e;
    }

    const companies = await db.Company.findAll();
    logger.info("Rolling back " + companies.length + " companies");
    let skipped = 0;
    let migrated = 0;
    let failedNoVert = 0;
    let failed = 0;

    for (let i = 0; i < companies.length; i++) {
      let data = {
        industryVertical: [],
      };
      let migratedAny = false;
      for (let j = 0; j < companies[i].industryVertical.length; j++) {
        if (companies[i].industryVertical[j].length > 0) {
          let vert = await db.IndustryVertical.findAll({
            where: { name: companies[i].industryVertical[j] },
          });
          if (vert.length === 0 || vert[0] === null) {
            failedNoVert++;
          } else {
            data.industryVertical.push(vert[0].name);
            migratedAny = true;
          }
        }
      }
      if (companies[i].industryVertical.length > 0 && !migratedAny) {
        skipped++;
      } else {
        try {
          await db.Company.update(data, {
            where: { id: companies[i].id },
            returning: true,
          });
          migrated++;
        } catch (e) {
          failed++;
        }
      }
    }

    logger.info("--------------------------------------------------");
    logger.info("GUID Company Rollback");
    logger.info("Migrated: " + migrated);
    logger.info("Skipped: " + skipped);
    logger.info("Failed: " + failed);
    logger.info("Failed no Vertical: " + failedNoVert);
    logger.info("Total Failed: " + (failed + failedNoVert));
    logger.info("Total Records " + companies.length);
    logger.info("--------------------------------------------------");

    const projects = await db.Project.findAll();
    logger.info("Rolling back " + projects.length + " projects");
    skipped = 0;
    migrated = 0;
    failedNoVert = 0;
    failed = 0;

    for (let i = 0; i < projects.length; i++) {
      let data = {
        useCases: [],
      };
      let migratedAny = false;
      for (let j = 0; j < projects[i].useCases.length; j++) {
        if (projects[i].useCases[j].length > 0) {
          let usec = await db.UseCase.findAll({
            where: { name: projects[i].useCases[j] },
          });
          if (usec.length === 0 || usec[0] === null) {
            failedNoVert++;
          } else {
            data.useCases.push(usec[0].name);
            migratedAny = true;
          }
        }
      }
      if (projects[i].useCases.length > 0 && !migratedAny) {
        skipped++;
      } else {
        try {
          await db.Project.update(data, {
            where: { id: projects[i].id },
            returning: true,
          });
          migrated++;
        } catch (e) {
          failed++;
        }
      }
    }

    logger.info("GUID Project Rollback");
    logger.info("Migrated: " + migrated);
    logger.info("Skipped: " + skipped);
    logger.info("Failed: " + failed);
    logger.info("Failed no Use Case: " + failedNoVert);
    logger.info("Total Failed: " + (failed + failedNoVert));
    logger.info("Total Records " + projects.length);
    logger.info("--------------------------------------------------");

    await db.DBState.update({ state: 0 }, { where: {}, returning: true });
    logger.info("Rollback 1 complete");
  } else {
    logger.info("Skipping Rollback 1, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};
