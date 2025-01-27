const LIST_MY_PROJECT_ROLES = [
  "sales",
  "solutions architect",
  "customer",
  "solutions engineer",
];
const LIST_PROJECT_ROLES = [
  "sales",
  "solutions architect",
  "solutions engineer",
  "marketing",
];
const GET_PROJECT_ROLES = [
  "sales",
  "solutions architect",
  "customer",
  "solutions engineer",
];
const EDIT_PROJECT_ROLES = ["sales", "solutions architect"];
const CREATE_PROJECT_ROLES = ["sales", "solutions architect"];
const DELETE_PROJECT_ROLES = ["sales", "solutions architect"];
const EDIT_MY_PROJECT_ROLES = [
  "sales",
  "solutions architect",
  "customer",
  "solutions engineer",
];

var buildStatic = function (db, router) {
  return router;
};

var buildDynamic = function (db, router, auth) {
  const defaults = require("./defaults");
  const sequelize = require("sequelize");
  const OP = sequelize.Op;

  const findProjects = require("../util/util").findProjects(db, defaults);

  router.get(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_PROJECT_ROLES),
    async function (req, res, next) {
      try {
        let resp = {};

        const projects = await findProjects(req);
        let numRecords = projects.count;
        resp.total = numRecords;
        resp.numPages = projects.numPages;
        resp.page = projects.page;

        delete projects.count;
        delete projects.numPages;
        delete projects.page;

        resp.projects = projects.rows;

        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/my",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_MY_PROJECT_ROLES),
    async function (req, res, next) {
      try {
        let resp = {};

        const projects = await findProjects(req, true);
        let numRecords = projects.count;
        resp.total = numRecords;
        resp.numPages = projects.numPages;
        resp.page = projects.page;

        delete projects.count;
        delete projects.numPages;
        delete projects.page;

        resp.projects = projects.rows;

        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(GET_PROJECT_ROLES),
    async function (req, res, next) {
      try {
        let q = {
          include: [
            {
              model: db.User,
              as: "fullCreatedBy",
              attributes: {
                exclude: ["password", "salt", "resetCode", "resetExpiry"],
              },
            },
            {
              model: db.Company,
              as: "company",
            },
          ],
        };
        if (process.env.NODE_ENV !== "test") {
          const company = q.include.find(({ model }) => model === db.Company);
          company.include = [
            {
              model: db.User,
              as: "associatedUsers",
              attributes: {
                exclude: ["password", "salt", "resetCode", "resetExpiry"],
              },
            },
          ];
          q.include.push({
            model: db.User,
            as: "associatedUsers",
            attributes: {
              exclude: ["password", "salt", "resetCode", "resetExpiry"],
            },
            through: { attributes: [] },
          });
        }
        const project = await db.Project.findByPk(req.params.id, q);

        if (project === null) {
          return res.status(404).json({ error: "Not Found" });
        }

        let canUserGet = auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        if (!canUserGet && process.env.NODE_ENV !== "test") {
          for (let i = 0; i < project.associatedUsers.length; i++) {
            if (project.associatedUsers[i].id === req.user.id) {
              canUserGet = true;
              break;
            }
          }
        }

        if (!canUserGet) {
          return res.status(404).json({ error: "Not Found" });
        }

        res.json({ project: project });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.post(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(CREATE_PROJECT_ROLES),
    async function (req, res, next) {
      try {
        let userErrors = [];
        if (!req.body || !req.body.title) {
          return res.status(400).json({ error: "title is required" });
        }

        if (!req.body || !req.body.companyId) {
          return res.status(400).json({ error: "companyId is required" });
        }

        let data = {
          title: req.body.title,
          createdBy: req.user.id,
        };

        if (req.body.useCases) {
          data.useCases = req.body.useCases;
        }

        //NOTE: because the same roles that can create/view/edit all companies can create/view/edit all projects we don't
        //need to validate that the user has access to the company
        //(but we do need to validate the company exists)
        let company = null;
        if (req.body.companyId) {
          let companyQ = {};
          if (process.env.NODE_ENV !== "test") {
            companyQ.include = [
              {
                model: db.User,
                as: "associatedUsers",
                attributes: {
                  exclude: ["password", "salt", "resetCode", "resetExpiry"],
                },
                through: { attributes: [] },
              },
            ];
          }
          company = await db.Company.findByPk(req.body.companyId, companyQ);
          if (company === null) {
            return res.status(400).json({ error: "No such company exists" });
          }
          data.companyId = req.body.companyId;
        }

        const project = await db.Project.create(data);

        //pg-mem doens't work with many-many
        if (process.env.NODE_ENV !== "test") {
          if (
            req.body.associatedUsers &&
            Array.isArray(req.body.associatedUsers)
          ) {
            for (let i = 0; i < req.body.associatedUsers.length; i++) {
              let associatedData = {
                userId: req.body.associatedUsers[i],
                projectId: project.id,
              };

              await db.UserProject.create(associatedData);

              if (
                company &&
                company.associatedUsers.findIndex(
                  ({ id }) => id === associatedData.userId
                ) === -1
              ) {
                await db.UserCompany.create({
                  companyId: company.id,
                  userId: associatedData.userId,
                });
              }
            }
          }
        }

        res.status(201).json({
          project: {
            ...project.toJSON(),
            fullCreatedBy: {
              id: req.user.id,
              firstName: req.user.firstName,
              lastName: req.user.lastName,
            },
            userErrors: userErrors,
          },
        });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  router.put(
    "/:id/activate",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_PROJECT_ROLES),
    async function (req, res, next) {
      let data = { archived: false };

      const project = await db.Project.update(data, {
        where: { id: req.params.id },
        returning: true,
      });

      res.status(200).json({ project: project[1][0] });
    }
  );

  router.put(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_PROJECT_ROLES),
    async function (req, res, next) {
      try {
        let data = {};

        let origProject = db.Project.findByPk(req.params.id);

        if (typeof req.body.title !== "undefined") {
          data.title = req.body.title;
        }

        if (typeof req.body.useCases !== "undefined") {
          data.useCases = req.body.useCases;
        }

        if (typeof req.body.notes !== "undefined") {
          data.notes = req.body.notes;
        }

        let company = null;
        let companyQ = {};
        if (process.env.NODE_ENV !== "test") {
          companyQ.include = [
            {
              model: db.User,
              as: "associatedUsers",
              attributes: {
                exclude: ["password", "salt", "resetCode", "resetExpiry"],
              },
              through: { attributes: [] },
            },
          ];
        }
        //NOTE: because the same roles that can create/view/edit all companies can create/view/edit all projects we don't
        //need to validate that the user has access to the company
        //(but we do need to validate the company exists)

        if (typeof req.body.companyId !== "undefined") {
          company = await db.Company.findByPk(req.body.companyId, companyQ);
          if (company === null) {
            return res.status(400).json({ error: "No such company exists" });
          }
          data.companyId = req.body.companyId;
        } else {
          company = await db.Company.findByPk(origProject.companyId, companyQ);
        }
        let userErrors = [];
        //pg-mem doens't work with many-many
        if (process.env.NODE_ENV !== "test") {
          if (
            req.body.associatedUsers &&
            Array.isArray(req.body.associatedUsers)
          ) {
            await db.UserProject.destroy({
              where: { projectId: req.params.id },
            });
            for (let i = 0; i < req.body.associatedUsers.length; i++) {
              let associatedData = {
                userId: req.body.associatedUsers[i],
                projectId: req.params.id,
              };

              let dbUser = await db.User.findOne({
                id: req.body.associatedUsers[i],
              });

              await db.UserProject.create(associatedData);

              if (
                company &&
                company.associatedUsers.findIndex(
                  ({ id }) => id === associatedData.userId
                ) === -1
              ) {
                await db.UserCompany.create({
                  companyId: company.id,
                  userId: associatedData.userId,
                });
              }
            }
          }
        }

        const project = await db.Project.update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        if (typeof project[1] === "undefined") {
          const origProject = await db.Project.findOne({
            where: { id: req.params.id },
          });
          if (origProject === null) {
            res.status(404).json({ error: "Not Found" });
          }
          return res
            .status(200)
            .json({ project: origProject, userErrors: userErrors });
        }

        res
          .status(200)
          .json({ project: project[1][0], userErrors: userErrors });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.delete(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(DELETE_PROJECT_ROLES),
    async function (req, res, next) {
      try {
        let data = { archived: true };

        const project = await db.Project.update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        res.status(200).json({ project: project[1][0] });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  router.get(
    "/:id/details",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_MY_PROJECT_ROLES),
    async function (req, res, next) {
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        //only the projects the user has access to
        const projects = await findProjects(req, my);
        if (projects && projects.rows && projects.rows.length === 1) {
          let q = {};
          q.where = {
            projectId: req.params.id,
          };

          let page = 0;

          if (typeof req.query.limit !== "undefined") {
            if (req.query.limit > defaults.LIMIT_LIMIT) {
              return res.status(400).json({
                error: `Limit must be less than ${defaults.LIMIT_LIMIT}`,
              });
            } else if (req.query.limit < 0) {
              return res.status(400).json({ error: `Limit must be 0 or more` });
            } else {
              q.limit = req.query.limit;
            }
          }

          if (typeof req.query.page !== "undefined") {
            if (req.query.page < 0) {
              return res.status(400).json({ error: `Page must be 0 or more` });
            } else {
              let offset = req.query.page * q.limit;
              q.offset = offset;
              page = req.query.page;
            }
          }

          let details = await db.ProjectDetail.findAndCountAll(q);
          let resp = {};

          let numRecords = details.count;
          resp.total = numRecords;
          resp.numPages = details.numPages;
          resp.page = details.page;

          delete details.count;
          delete details.numPages;
          delete details.page;

          resp.details = details.rows;

          return res.status(200).json(resp);
        }
        return res.status(404).json({ error: "Not Found" });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  router.post(
    "/:id/details",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        if (
          !req.body ||
          !req.body.details ||
          !Array.isArray(req.body.details)
        ) {
          return res
            .status(400)
            .json({ error: "Details is required and must be an array" });
        }

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {};
        q.where = {
          projectId: req.params.id,
        };
        try {
          db.ProjectDetail.destroy(q);
        } catch (e) {
          return res.status(500).json({ error: e });
        }

        let errors = [];
        let bodyDetails = req.body.details;
        for (let i = 0; i < bodyDetails.length; i++) {
          let d = {
            projectId: req.params.id,
            createdBy: req.user.id,
          };

          if (bodyDetails[i].type) {
            d.type = bodyDetails[i].type;
          }

          if (bodyDetails[i].projectNotes) {
            d.projectNotes = bodyDetails[i].projectNotes;
          }

          if (bodyDetails[i].region) {
            d.region = bodyDetails[i].region;
          }

          if (bodyDetails[i].stateInfo) {
            d.stateInfo = bodyDetails[i].stateInfo;
          }

          if (bodyDetails[i].named) {
            d.named = bodyDetails[i].named;
          }

          if (bodyDetails[i].address) {
            d.address = bodyDetails[i].address;
          }

          if (bodyDetails[i].extras) {
            d.extras = bodyDetails[i].extras;
          }

          if (typeof bodyDetails[i].isFuture === "boolean") {
            d.isFuture = bodyDetails[i].isFuture;
          }

          try {
            db.ProjectDetail.create(d);
          } catch (e) {
            errors.push({ index: i, details: bodyDetails[i], error: e });
          }
        }

        let details = await db.ProjectDetail.findAndCountAll(q);
        return res.status(201).json({ details: details, errors: errors });
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  router.put(
    "/:id/details/new",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        if (!req.body) {
          return res
            .status(400)
            .json({ error: "Body is required and must be an object" });
        }

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }
      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {
          returning: true,
        };
        q.where = {
          projectId: req.params.id,
        };

        let d = {
          projectId: req.params.id,
          createdBy: req.user.id,
        };

        if (typeof req.body.projectNotes !== "undefined") {
          d.projectNotes = req.body.projectNotes;
        }

        if (typeof req.body.type !== "undefined") {
          if (db.ProjectDetail.TYPES.indexOf(req.body.type) === -1) {
            return res.status(400).json({
              error: `Invalid type select one of ${db.ProjectDetail.TYPES}`,
            });
          }
          d.type = req.body.type;
        }

        if (typeof req.body.region !== "undefined") {
          d.region = req.body.region;
        }

        if (typeof req.body.stateInfo !== "undefined") {
          d.stateInfo = req.body.stateInfo;
        }

        if (typeof req.body.named !== "undefined") {
          d.named = req.body.named;
        }

        if (typeof req.body.address !== "undefined") {
          d.address = req.body.address;
        }

        if (typeof req.body.extras !== "undefined") {
          d.extras = req.body.extras;
        }

        if (typeof req.body.isFuture === "boolean") {
          d.isFuture = req.body.isFuture;
        }

        // region is stateless, make sure isFuture = false for regions
        if (d.type === "regions") {
          d.isFuture = false;
        }

        if (d.type === "notes") {
          const existingDetails = await db.ProjectDetail.findAll({
            where: {
              named: d.named,
              projectId: d.projectId,
              region: d.region,
              isFuture: d.isFuture,
              type: "notes",
            },
          });

          if (existingDetails?.length > 0 || !d.region) {
            return res.status(404).json({ error: "Not Found." });
          }
        }

        if (
          d.type === db.ProjectDetail.DATACENTER_TYPE ||
          d.type === db.ProjectDetail.CUSTOMER_LOCATION_TYPE
        ) {
          const existingDetails = await db.ProjectDetail.findAll({
            where: {
              named: { [OP.iLike]: d.named },
              projectId: d.projectId,
              region: d.region,
              isFuture: d.isFuture,
              type: {
                [OP.in]: [
                  db.ProjectDetail.DATACENTER_TYPE,
                  db.ProjectDetail.CUSTOMER_LOCATION_TYPE,
                ],
              },
            },
          });

          if (existingDetails?.length >= 1) {
            return res.status(400).json({
              error:
                "Name must be unique across a project, current future pairing among all datacenters and customer locations",
            });
          }
        }

        try {
          const pd = await db.ProjectDetail.create(d, q);

          return res.status(201).json(pd);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  router.put(
    "/:id/details/:detailId",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        if (!req.body) {
          return res
            .status(400)
            .json({ error: "Body is required and must be an object" });
        }

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }
      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {
          returning: true,
        };
        q.where = {
          projectId: req.params.id,
          id: req.params.detailId,
        };

        let d = {
          projectId: req.params.id,
        };

        if (typeof req.body.type !== "undefined") {
          if (db.ProjectDetail.TYPES.indexOf(req.body.type) === -1) {
            return res.status(400).json({
              error: `Invalid type select one of ${db.ProjectDetail.TYPES}`,
            });
          }
          d.type = req.body.type;
        }

        if (typeof req.body.projectNotes !== "undefined") {
          d.projectNotes = req.body.projectNotes;
        }

        if (typeof req.body.region !== "undefined") {
          d.region = req.body.region;
        }

        if (typeof req.body.stateInfo !== "undefined") {
          d.stateInfo = req.body.stateInfo;
        }

        if (typeof req.body.named !== "undefined") {
          d.named = req.body.named;
        }

        if (typeof req.body.address !== "undefined") {
          d.address = req.body.address;
        }

        if (typeof req.body.extras !== "undefined") {
          d.extras = req.body.extras;
        }

        if (typeof req.body.isFuture === "boolean") {
          d.isFuture = req.body.isFuture;
        }

        try {
          const pd = await db.ProjectDetail.update(d, q);

          return res.status(200).json({ detail: pd[1][0] });
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  router.delete(
    "/:id/details/:detailId",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {};
        q.where = {
          projectId: req.params.id,
          id: req.params.detailId,
        };
        try {
          let result = db.ProjectDetail.destroy(q);
          return res.status(200).json(result);
        } catch (e) {
          return res.status(500).json({ error: e });
        }
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  router.delete(
    "/:id/details/:detailId/detach",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      if (!req.body.region) {
        return res.status(404).json({ error: "Not Found" });
      }

      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {};
        q.where = {
          projectId: req.params.id,
          region: req.body.region,
        };
        try {
          let result = db.ProjectDetail.destroy(q);
          return res.status(200).json(result);
        } catch (e) {
          return res.status(500).json({ error: e });
        }
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  router.get(
    "/:id/connections",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_MY_PROJECT_ROLES),
    async function (req, res, next) {
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        //only the projects the user has access to
        const projects = await findProjects(req, my);
        if (projects && projects.rows && projects.rows.length === 1) {
          let q = {};
          q.where = {
            projectId: req.params.id,
          };

          let page = 0;

          if (typeof req.query.limit !== "undefined") {
            if (req.query.limit > defaults.LIMIT_LIMIT) {
              return res.status(400).json({
                error: `Limit must be less than ${defaults.LIMIT_LIMIT}`,
              });
            } else if (req.query.limit < 0) {
              return res.status(400).json({ error: `Limit must be 0 or more` });
            } else {
              q.limit = req.query.limit;
            }
          }

          if (typeof req.query.page !== "undefined") {
            if (req.query.page < 0) {
              return res.status(400).json({ error: `Page must be 0 or more` });
            } else {
              let offset = req.query.page * q.limit;
              q.offset = offset;
              page = req.query.page;
            }
          }

          let connections = await db.Connection.findAndCountAll(q);
          let resp = {};

          let numRecords = connections.count;
          resp.total = numRecords;
          resp.numPages = connections.numPages;
          resp.page = connections.page;

          delete connections.count;
          delete connections.numPages;
          delete connections.page;

          resp.connections = connections.rows;

          return res.status(200).json(resp);
        }
        return res.status(404).json({ error: "Not Found" });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  router.post(
    "/:id/connections",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        if (
          !req.body ||
          !req.body.connections ||
          !Array.isArray(req.body.connections)
        ) {
          return res
            .status(400)
            .json({ error: "Details is required and must be an array" });
        }

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }
      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {};
        q.where = {
          projectId: req.params.id,
        };
        try {
          db.Connection.destroy(q);
        } catch (e) {
          return res.status(500).json({ error: e });
        }

        let errors = [];
        let bodyConnections = req.body.connections;
        for (let i = 0; i < bodyConnections.length; i++) {
          let d = {
            projectId: req.params.id,
            createdBy: req.user.id,
          };

          if (bodyConnections[i].name) {
            d.name = bodyConnections[i].name;
          }

          if (bodyConnections[i].notes) {
            d.notes = bodyConnections[i].notes;
          }

          if (bodyConnections[i].origins) {
            d.origins = bodyConnections[i].origins;
          }

          if (bodyConnections[i].onRampOrigins) {
            d.onRampOrigins = bodyConnections[i].onRampOrigins;
          }

          if (bodyConnections[i].originTypes) {
            d.originTypes = bodyConnections[i].originTypes;
          }

          if (bodyConnections[i].endpoint) {
            d.endpoint = bodyConnections[i].endpoint;
          }

          if (bodyConnections[i].onRampEndpoint) {
            d.onRampEndpoint = bodyConnections[i].onRampEndpoint;
          }

          if (bodyConnections[i].endpointType) {
            d.endpointType = bodyConnections[i].endpointType;
          }

          if (!d.endpoint && !d.onRampEndpoint) {
            return res
              .status(500)
              .json({ error: "Must have at least one endpoint" });
          }

          if (d.endpoint && d.onRampEndpoint) {
            return res
              .status(500)
              .json({ error: "Can only have one endpoint" });
          }

          try {
            db.Connection.create(d);
          } catch (e) {
            errors.push({
              index: i,
              connections: bodyConnections[i],
              error: e,
            });
          }
        }

        let connections = await db.Connection.findAndCountAll(q);
        return res
          .status(201)
          .json({ connections: connections, errors: errors });
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  router.put(
    "/:id/connections/new",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        if (!req.body) {
          return res
            .status(400)
            .json({ error: "Body is required and must be an object" });
        }

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }
      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {
          returning: true,
        };
        q.where = {
          projectId: req.params.id,
        };

        let d = {
          projectId: req.params.id,
          createdBy: req.user.id,
        };

        if (req.body.name) {
          d.name = req.body.name;
        }

        if (req.body.notes) {
          d.notes = req.body.notes;
        }

        if (req.body.origins) {
          d.origins = req.body.origins;
        }

        if (req.body.onRampOrigins) {
          d.onRampOrigins = req.body.onRampOrigins;
        }

        if (req.body.originTypes) {
          d.originTypes = req.body.originTypes;
        }

        if (req.body.endpoint) {
          d.endpoint = req.body.endpoint;
        }

        if (req.body.onRampEndpoint) {
          d.onRampEndpoint = req.body.onRampEndpoint;
        }

        if (req.body.endpointType) {
          d.endpointType = req.body.endpointType;
        }

        if (!d.endpoint && !d.onRampEndpoint) {
          return res
            .status(500)
            .json({ error: "Connection must have at least one endpoint" });
        }

        if (d.endpoint && d.onRampEndpoint) {
          return res
            .status(500)
            .json({ error: "Connection can only have one endpoint" });
        }

        try {
          const pd = await db.Connection.create(d, q);

          return res.status(201).json({ connection: pd });
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  router.put(
    "/:id/connections/:connectionId",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        if (!req.body) {
          return res
            .status(400)
            .json({ error: "Body is required and must be an object" });
        }

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }
      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {
          returning: true,
        };
        q.where = {
          projectId: req.params.id,
          id: req.params.connectionId,
        };

        let d = {
          projectId: req.params.id,
        };

        if (typeof req.body.name !== "undefined") {
          d.name = req.body.name;
        }

        if (typeof req.body.notes !== "undefined") {
          d.notes = req.body.notes;
        }

        if (typeof req.body.origins !== "undefined") {
          d.origins = req.body.origins;
        }

        if (typeof req.body.onRampOrigins !== "undefined") {
          d.onRampOrigins = req.body.onRampOrigins;
        }

        if (typeof req.body.originTypes !== "undefined") {
          d.originTypes = req.body.originTypes;
        }

        if (typeof req.body.endpoint !== "undefined") {
          d.endpoint = req.body.endpoint;
        }

        if (typeof req.body.onRampEndpoint !== "undefined") {
          d.onRampEndpoint = req.body.onRampEndpoint;
        }

        if (typeof req.body.endpointType !== "undefined") {
          d.endpointType = req.body.endpointType;
        }

        if (!d.endpoint && !d.onRampEndpoint) {
          return res
            .status(500)
            .json({ error: "Connection must have at least one endpoint" });
        }

        if (d.endpoint && d.onRampEndpoint) {
          return res
            .status(500)
            .json({ error: "Connection can only have one endpoint" });
        }

        try {
          const c = await db.Connection.update(d, q);

          return res.status(200).json({ connection: c[1][0] });
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  router.delete(
    "/:id/connections/:detailId",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_MY_PROJECT_ROLES),
    async function (req, res, next) {
      let projects = null;
      try {
        let my = !auth.hasRoleIn(LIST_PROJECT_ROLES, req.user);

        //only the projects the user has access to
        projects = await findProjects(req, my);
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      if (projects && projects.rows && projects.rows.length === 1) {
        let q = {};
        q.where = {
          projectId: req.params.id,
          id: req.params.detailId,
        };
        try {
          let result = db.Connection.destroy(q);
          return res.status(200).json(result);
        } catch (e) {
          return res.status(500).json({ error: e });
        }
      }
      return res.status(404).json({ error: "Not Found" });
    }
  );

  return router;
};

module.exports = {
  buildStatic: buildStatic,
  buildDynamic: buildDynamic,
};
