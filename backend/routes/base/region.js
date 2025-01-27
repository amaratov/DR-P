const LIST_REGION_ROLES = ["solutions architect", "sales",  "customer", "solutions engineer"];
const GET_REGION_ROLES = ["solutions architect", "sales",  "customer", "solutions engineer"];
const EDIT_REGION_ROLES = ["solutions architect"];
const CREATE_REGION_ROLES = ["solutions architect"];
const DELETE_REGION_ROLES = ["solutions architect"];

var buildStatic = function(db, router){
    return router;
}

var buildDynamic = function(db, router, auth){
    const defaults = require('./defaults');
    const sequelize = require('sequelize');
    const OP = sequelize.Op;

    async function findRegions(req) {
        let q = {
            limit: defaults.LIMIT,
            offset: defaults.OFFSET,
            distinct: true,
            order: [['name', 'desc']],
            include: [
              {
                  model: db.User,
                  as: "fullCreatedBy",
                  attributes: {exclude: ['password', 'salt', 'resetCode', 'resetExpiry']},
              },
              {
                  model: db.Region,
                  as: "parentRegion",
                  required: false,
              },
            ],
              where: {},
              subQuery: false
          };

          let page = 0;

          if (typeof req.query.limit !== "undefined") {
              if (req.query.limit > defaults.LIMIT_LIMIT) {
                throw new Error(`Limit must be less than ${defaults.LIMIT_LIMIT}`);
              } else if (req.query.limit < 0) {
                throw new Error(`Limit must be 0 or more`);
              } else {
                q.limit = req.query.limit;
              }
            }

          if (typeof req.query.page !== "undefined") {
              if (req.query.page < 0) {
                  throw new Error('Page must be 0 or more');
              } else {
                  let offset = req.query.page * q.limit;
                  q.offset = offset;
                  page = req.query.page;
              }
          }

          if (typeof req.query.name !== "undefined") {
            q.where.name = req.query.name;
          }
  
          if (typeof req.params.id !== "undefined") {
            q.where.id = req.params.id;
          }
  
          let region = await db.Region.findAndCountAll(q);
          region.numPages = Math.ceil(region.count / q.limit);
          region.page = page;
  
          return region;
        }

    router.get("/", auth.requireLoggedIn, auth.requireRoleIn(LIST_REGION_ROLES), async function(req, res, next){
            try{
              
              let resp = {};

              const regions = await findRegions(req);
              let numRecords = regions.count;
              resp.total = numRecords;
              resp.numPages = regions.numPages;
              resp.page = regions.page

              delete regions.count;
              delete regions.numPages;
              delete regions.page;
    
              resp.regions = regions.rows;
    
              res.status(200).json(resp);
            }catch(e){
                res.status(500).json({error: e.message});
            }
    });

    router.get("/:id", auth.requireLoggedIn, auth.requireRoleIn(GET_REGION_ROLES), async function (req, res, next){
            try {
                const region = await findRegions(req);

                if (region.count === 0) {
                    return res.status(404).json({ error: "Not Found" });
                }
    
                res.json({ region: region });
              } catch (e) {
                res.status(500).json({ error: e.message });
              }
            }
    );

    router.post("/", auth.requireLoggedIn, auth.requireRoleIn(CREATE_REGION_ROLES), async function(req, res, next) {
            try {
              if (!req.body || !req.body.name) {
                return res.status(400).json({ error: "region name is required" });
              }
          
              const parentRegionId = req.body.parentRegionId;
          
              let parentRegion = null;
              if (parentRegionId) {
                parentRegion = await db.Region.findByPk(parentRegionId);
                if (!parentRegion) {
                  return res.status(400).json({ error: "parent region not found" });
                }
              }
          
              const data = {
                name: req.body.name,
                createdBy: req.user.id,
                parentRegionId: parentRegion ? parentRegion.id : null
              };
          
              const region = await db.Region.create(data);
          
              res.status(201).json({ region: region });
            } catch (e) {
              res.status(500).json({ error: e.message });
            }
    });

    router.put('/:id/activate', auth.requireLoggedIn, auth.requireRoleIn(EDIT_REGION_ROLES), async function(req, res, next){
        try {
            let data = {archived: false};
                
            const region = await db.Region.update(data, {where: {id: req.params.id}, returning: true});
            
            res.status(200).json({region: region[1][0]});
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    });

    router.put("/:id", auth.requireLoggedIn, auth.requireRoleIn(EDIT_REGION_ROLES), async function (req, res, next) {
            try {
              const region = await db.Region.findByPk(req.params.id);
              if (!region) {
                return res.status(404).json({ error: "Region not found" });
            }

            let parentRegion = null;
            const parentRegionId = req.body.parentRegionId;
            if (parentRegionId) {
                parentRegion = await db.Region.findByPk(parentRegionId);
                if (!parentRegion) {
                    return res.status(400).json({ error: "Invalid parent region ID" });
                }
            }
  
            const data = {};

            if (typeof req.body.name === 'string') {
                data.name = req.body.name;
            }
            if (parentRegion) {
                data.parentRegionId = parentRegionId;
            }

            await region.update(data);

            res.status(200).json({ region: region });
            } catch (e) {
              res.status(500).json({ error: e.message });
            }
        });

    router.delete('/:id', auth.requireLoggedIn, auth.requireRoleIn(DELETE_REGION_ROLES), async function(req, res, next){
          try{
              let data = {archived: true};
              
              const region = await db.Region.update(data, {where: {id: req.params.id}, returning: true});
              
              res.status(200).json({region: region[1][0]});
          }catch(e){
              res.status(500).json({error: e});
          }
    });
  return router;
  }

  module.exports = {
    buildStatic: buildStatic,
    buildDynamic: buildDynamic
  };