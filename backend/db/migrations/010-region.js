const logger = require("npmlog");

let migrate = async function () {
  var db = require("../db").init();
  var validator = require("validator");

  let currState = (await db.DBState.findAll())[0];
  if (currState.state < 10) {
    logger.info("Running Migration 10");
    await db.Region.sync({ alter: true });

      // Default parent regions
      const parentRegions = [
        {
          name: "Americas",
          createdBy: null,
          archived: false,
        },
        {
          name: "EMEA",
          createdBy: null,
          archived: false,
        },
        {
          name: "Asia-Pacific",
          createdBy: null,
          archived: false,
        },
      ];
    
      const parentRegionsCreated = [];
    
      // create parent regions first
      for (const region of parentRegions) {
        const createdRegion = await db.Region.create(region);
        parentRegionsCreated.push(createdRegion);
      }
    
      const america = parentRegionsCreated.find(r => r.name === 'Americas');
      const emea = parentRegionsCreated.find(r => r.name === 'EMEA');
      const asiaPacific = parentRegionsCreated.find(r => r.name === 'Asia-Pacific');
    
      const defaultChildRegions = [
        {
          name: "North America",
          parentRegionId: america.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "South America",
          parentRegionId: america.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "Europe",
          parentRegionId: emea.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "Middle East",
          parentRegionId: emea.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "Africa",
          parentRegionId: emea.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "Australia",
          parentRegionId: asiaPacific.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "China",
          parentRegionId: asiaPacific.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "Japan",
          parentRegionId: asiaPacific.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "Singapore",
          parentRegionId: asiaPacific.id,
          createdBy: null,
          archived: false,
        },
        {
          name: "South Korea",
          parentRegionId: asiaPacific.id,
          createdBy: null,
          archived: false,
        },
      ];
        
      await db.Region.bulkCreate(defaultChildRegions);

    await db.DBState.update({ state: 10 }, { where: {}, returning: true });
  } else {
    logger.info("Skipping Migration 10, database is already newer");
  }
};

let rollback = async function () {
  var db = require("../db").init();

  let currState = (await db.DBState.findAll())[0];
  if (currState.state >= 10) {
    await db.DBState.update({ state: 9 }, { where: {}, returning: true });
    logger.info("Rollback 10 complete");
  } else {
    logger.info("Skipping Rollback 10, database isn't newer");
  }
};

module.exports = {
  migrate: migrate,
  rollback: rollback,
};