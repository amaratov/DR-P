const CREATE_VALUE_ROLES = ["admin", "marketing"];
const EDIT_VALUE_ROLES = ["admin", "marketing"];
const DELETE_VALUE_ROLES = ["admin", "marketing"];

var buildDynamic = function (
  db,
  router,
  auth,
  tableName,
  fieldNames,
  roleIn,
  relatedTables
) {
  var requireRoleFun = auth.requireAdmin;
  if (typeof roleIn !== "undefined" && Array.isArray(roleIn)) {
    requireRoleFun = auth.requireRoleIn(roleIn);
  }
  const defaults = require("./defaults");
  const sequelize = require("sequelize");

  router.get("/", auth.requireLoggedIn, async function (req, res, next) {
    try {
      let resp = {};
      let q = {
        limit: defaults.LIMIT,
        offset: defaults.OFFSET,
        order: [["name", "desc"]],
        where: {},
      };

      if (req.query.limit) {
        if (req.query.limit > defaults.LIMIT_LIMIT) {
          resp.error = `Limit must be less than ${defaults.LIMIT_LIMIT}`;
        } else if (req.query.limit < 0) {
          resp.error = `Limit must be 0 or more`;
        } else {
          q.limit = req.query.limit;
        }
      }

      if (req.query.page) {
        if (req.query.page < 0) {
          resp.error = `Page must be 0 or more`;
        } else {
          let offset = req.query.page * q.limit;
          q.offset = offset;
          resp.page = req.query.page;
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

      for (let i = 0; i < fieldNames.length; i++) {
        if (fieldNames !== "id") {
          if (req.query[fieldNames[i]]) {
            q.where[fieldNames[i]] = req.query[fieldNames[i]];
          }
        }
      }

      // support for count
      if (
        process.env.NODE_ENV !== "test" &&
        typeof relatedTables !== "undefined" &&
        Array.isArray(relatedTables)
      ) {
        q.attributes = {
          include: [],
        };
        for (let i = 0; i < relatedTables.length; i++) {
          q.attributes.include.push([
            sequelize.literal(`(
                            SELECT COUNT(*)
                                FROM ${relatedTables[i].dbName} AS ${relatedTables[i].dbName}
                                WHERE
                                    ${relatedTables[i].where}
                                )`),
            `${relatedTables[i].as}`,
          ]);
        }
      }

      let recs = await db[tableName].findAndCountAll(q);
      let numRecords = recs.count;
      delete recs.count;

      resp[tableName.toLowerCase() + "s"] = recs.rows;
      resp.total = numRecords;
      resp.numPages = Math.ceil(numRecords / q.limit);
      res.status(200).json(resp);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/:id", auth.requireLoggedIn, async function (req, res, next) {
    try {
      const rec = await db[tableName].findByPk(req.params.id, {});

      if (rec === null) {
        return res.status(404).json({ error: "Not Found" });
      }

      let resp = {};
      resp[tableName.toLowerCase()] = rec;
      res.json(resp);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.post(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(CREATE_VALUE_ROLES),
    async function (req, res, next) {
      try {
        let data = {
          createdBy: req.user.id,
        };

        for (let i = 0; i < fieldNames.length; i++) {
          if (req.body && req.body[fieldNames[i]]) {
            data[fieldNames[i]] = req.body[fieldNames[i]];
          }
        }

        const rec = await db[tableName].create(data);

        let resp = {};
        resp[tableName.toLowerCase()] = rec;
        res.status(201).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.put(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_VALUE_ROLES),
    async function (req, res, next) {
      try {
        let data = {};

        for (let i = 0; i < fieldNames.length; i++) {
          if (req.body) {
            if (typeof req.body[fieldNames[i]] !== "undefined") {
              data[fieldNames[i]] = req.body[fieldNames[i]];
            }
          }
        }

        const rec = await db[tableName].update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        if (typeof rec[1] === "undefined" || rec[1].length <= 0) {
          const origRec = await db[tableName].findOne({
            where: { id: req.params.id },
          });
          if (origRec === null) {
            return res.status(404).json({ error: "Not Found" });
          }
          let resp = {};
          resp[tableName.toLowerCase()] = origRec;
          return res.status(200).json(resp);
        }

        let resp = {};
        resp[tableName.toLowerCase()] = rec[1][0];
        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.put(
    "/:id/activate",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_VALUE_ROLES),
    async function (req, res, next) {
      let data = { archived: false };

      const rec = await db[tableName].update(data, {
        where: { id: req.params.id },
        returning: true,
      });

      let resp = {};
      resp[tableName.toLowerCase()] = rec[1][0];
      res.status(200).json(resp);
    }
  );

  router.delete(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(DELETE_VALUE_ROLES),
    async function (req, res, next) {
      try {
        let data = { archived: true };

        const rec = await db[tableName].update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        let resp = {};
        resp[tableName.toLowerCase()] = rec[1][0];
        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  return router;
};

module.exports = {
  buildDynamic: buildDynamic,
};
