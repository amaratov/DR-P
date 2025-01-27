const VIEW_PROJECT_BRIEFCASE_ROLES = [
  "solutions architect",
  "customer",
  "solutions engineer",
  "sales",
  "marketing",
];
const GET_PROJECT_BRIEFCASE_ROLES = [
  "solutions architect",
  "customer",
  "solutions engineer",
  "sales",
  "marketing",
];
const EDIT_PROJECT_BRIEFCASE_ROLES = ["solutions architect"];
const CREATE_PROJECT_BRIEFCASE_ROLES = ["solutions architect"];
const DELETE_PROJECT_BRIEFCASE_ROLES = ["solutions architect"];

var buildStatic = function (db, router, auth) {
  const sequelize = require("sequelize");
  const OP = sequelize.Op;

  router.put(
    "/:id/publish",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_PROJECT_BRIEFCASE_ROLES),
    async function (req, res, next) {
      let data = {};

      const existingBriefcase = await db.ProjectBriefcase.findByPk(
        req.params.id
      );
      if (!existingBriefcase) {
        return res.status(404).json({ error: "Not Found" });
      }
      // publish all associated marketing documents
      data.publishedMarketing = existingBriefcase.associatedMarketing;
      // publish all associated customer documents
      data.publishedDocument = existingBriefcase.associatedDocument;
      // keep last publish date and published by
      data.lastPublishedDate = sequelize.fn("NOW");
      data.lastPublishedBy = {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      };

      const briefcase = await db.ProjectBriefcase.update(data, {
        where: { id: req.params.id },
        returning: true,
      });

      if (typeof briefcase[1] === "undefined" && existingBriefcase) {
        return res.status(200).json({ briefcase: existingBriefcase });
      }
      res.status(200).json({ briefcase: briefcase[1][0] });
    }
  );

  return router;
};

var buildDynamic = function (db, router, auth) {
  const defaults = require("./defaults");
  const sequelize = require("sequelize");
  const OP = sequelize.Op;

  async function findProjectBriefcase(req) {
    let q = {
      limit: defaults.LIMIT,
      offset: defaults.OFFSET,
      distinct: true,
      order: [["id", "desc"]],
      include: [
        {
          model: db.User,
          as: "fullCreatedBy",
          attributes: { exclude: ["password", "salt"] },
        },
      ],
      where: {},
      subQuery: false,
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
        throw new Error(`Page must be 0 or more`);
      } else {
        let offset = req.query.page * q.limit;
        q.offset = offset;
        page = req.query.page;
      }
    }

    if (req.query.order) {
      try {
        let order = req.query.order;
        order = JSON.parse(order);
        q.order = order;
      } catch (e) {
        q.order = req.query.order;
      }
    }

    if (req.query.projectId) {
      q.where.projectId = req.query.projectId;
    }

    let briefcases = await db.ProjectBriefcase.findAndCountAll(q);
    briefcases.numPages = Math.ceil(briefcases.count / q.limit);
    briefcases.page = page;
    return briefcases;
  }

  router.get(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(GET_PROJECT_BRIEFCASE_ROLES),
    async function (req, res, next) {
      try {
        let resp = {};

        const briefcases = await findProjectBriefcase(req);
        let numRecords = briefcases.count;
        resp.total = numRecords;
        resp.numPages = briefcases.numPages;
        resp.page = briefcases.page;

        delete briefcases.count;
        delete briefcases.numPages;
        delete briefcases.page;

        resp.briefcases = briefcases.rows;

        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(GET_PROJECT_BRIEFCASE_ROLES),
    async function (req, res, next) {
      try {
        let q = {
          include: [
            {
              model: db.User,
              as: "fullCreatedBy",
              attributes: { exclude: ["password", "salt"] },
            },
          ],
        };
        if (req.params.id === null) {
          return res.status(404).json({ error: "Not Found" });
        }

        const briefcase = await db.ProjectBriefcase.findByPk(req.params.id, q);

        if (briefcase === null) {
          return res.status(404).json({ error: "Not Found" });
        }

        res.json({ briefcase: briefcase });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.post(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(CREATE_PROJECT_BRIEFCASE_ROLES),
    async function (req, res, next) {
      try {
        if (!req.body || !req.body.projectId) {
          return res.status(400).json({ error: "projectId is required" });
        }

        let data = {
          associatedMarketing: req.body.associatedMarketing,
          publishedMarketing: req.body.publishedMarketing,
          associatedDocument: req.body.associatedDocument,
          publishedDocument: req.body.publishedDocument,
          projectId: req.body.projectId,
          createdBy: req.user.id,
        };

        const projectBriefcase = await db.ProjectBriefcase.create(data);

        res.status(201).json({ briefcase: projectBriefcase });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  // for add/remove associated marketing document purpose
  router.put(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_PROJECT_BRIEFCASE_ROLES),
    async function (req, res, next) {
      try {
        let data = {};

        if (typeof req.body.associatedMarketing !== "undefined") {
          data.associatedMarketing = req.body.associatedMarketing;
        }
        if (typeof req.body.associatedDocument !== "undefined") {
          data.associatedDocument = req.body.associatedDocument;
        }
        const briefcase = await db.ProjectBriefcase.update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        if (typeof briefcase[1] === "undefined") {
          const origBriefcase = await db.ProjectBriefcase.findOne({
            where: { id: req.params.id },
          });
          if (origBriefcase === null) {
            res.status(404).json({ error: "Not Found" });
          }
          return res.status(200).json({ briefcase: origBriefcase });
        }
        res.status(200).json({ briefcase: briefcase[1][0] });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  router.delete(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(DELETE_PROJECT_BRIEFCASE_ROLES),
    async function (req, res, next) {
      try {
        const briefcaseToBeRemoved = await db.ProjectBriefcase.destroy({
          where: { id: req.params.id },
        });

        res.status(200).json({
          briefcase: { id: req.params.id },
          message: "Successfully removed briefcase.",
        });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  return router;
};

module.exports = {
  buildStatic: buildStatic,
  buildDynamic: buildDynamic,
};
