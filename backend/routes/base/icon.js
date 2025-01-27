const env = process.env.NODE_ENV || "development";

const LIST_ICON_ROLES = [
  "customer",
  "solutions architect",
  "solutions engineer",
  "sales",
  "marketing",
];
const GET_ICON_ROLES = ["solutions architect", "sales", "marketing"];
const EDIT_ICON_ROLES = ["solutions architect", "marketing"];
const CREATE_ICON_ROLES = ["solutions architect", "marketing"];
const DELETE_ICON_ROLES = ["solutions architect", "marketing"];

const VIEW_ICON_ROLES = [
  "sales",
  "solutions architect",
  "customer",
  "solutions engineer",
  "marketing",
];

const FILE_DIR = "./files";

const config = require("config");

const fs = require("fs");
const NodeCache = require("node-cache");
const ICON_TTL = 60 * 60 * 2; //ttl is in seconds so this is 2 hours
const ICON_CHECK = ICON_TTL + 20;
const iconCache = new NodeCache({ stdTTL: ICON_TTL, checkperiod: ICON_CHECK });

iconCache.on("del", function (key, value) {
  fs.unlinkSync(`${FILE_DIR}/${key}`);
});

const tus = require("tus-node-server");
const EVENTS = require("tus-node-server").EVENTS;
let tusServers = {};

const minioConf = config.get("minio");
const mClientConf = {
  endPoint: minioConf.url,
  port: minioConf.port,
  useSSL: minioConf.ssl,
  accessKey: minioConf.accessKey,
  secretKey: minioConf.secretKey,
  region: minioConf.bucketRegion,
};

var Minio = require("minio");
const defaults = require("./defaults");

var minioClient = new Minio.Client(mClientConf);

var buildStatic = function (db, router) {
  return router;
};

var buildDynamic = function (db, router, auth, logger, type) {
  const defaults = require("./defaults");
  const sequelize = require("sequelize");
  const OP = sequelize.Op;

  if (typeof type !== "undefined") {
    if (db.Icon.TYPES.indexOf(type) === -1) {
      throw new Error("Invalid type");
    }
  } else {
    type = false;
  }

  // req is http.IncomingMessage
  const randomString = (req) => {
    // same as the default implementation
    const crypto = require("crypto");
    let r = crypto.randomBytes(16).toString("hex");
    if (req.params.id) {
      console.log("RANDOM STRING", req.params.id);
      r = req.params.id + "@" + r;
    }
    return r;
  };

  async function findIcons(req) {
    let q = {
      limit: defaults.LIMIT,
      offset: defaults.OFFSET,
      distinct: true,
      order: [["iconName", "desc"]],
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

    if (type) {
      q.where.tag = type;
    }

    let page = 0;

    if (typeof req.query.limit !== "undefined") {
      if (req.query.limit > defaults.LIMIT_LIMIT) {
        throw new Error(`Limit must be less than ${defaults.LIMIT_LIMIT}`);
      } else if (req.query.limit <= 0) {
        delete q.limit;
      } else {
        q.limit = req.query.limit;
      }
    }

    if (typeof req.query.page !== "undefined") {
      if (req.query.page < 0) {
        throw new Error(`Page must be 0 or more`);
      } else {
        let offset = req.query.page * (q.limit ? q.limit : 0);
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

    if (req.query.iconName) {
      q.where.iconName = { [OP.iLike]: req.query.iconName };
    }

    if (req.query.notes) {
      q.where.notes = { [OP.eq]: req.query.notes };
    }

    if (req.query.tags) {
      let tagArr = req.query.tags;
      q.where.tag = { [OP.in]: tagArr };
    } else if (req.query.tag) {
      let tagArr = req.query.tag;
      q.where.tag = { [OP.in]: tagArr };
    }

    if (req.query.types) {
      let typeArr = req.query.types;
      q.where.type = { [OP.overlap]: typeArr };
    }

    if (req.query.industryVertical) {
      let vertArr = req.query.industryVertical;
      q.where.industryVertical = { [OP.overlap]: vertArr };
    }

    if (req.query.useCase) {
      let useArr = req.query.useCase;
      q.where.useCase = { [OP.overlap]: useArr };
    }

    if (req.query.partners) {
      let partnerArr = req.query.partners;
      q.where.partners = { [OP.overlap]: partnerArr };
    }

    if (req.query.technologies) {
      let techArr = req.query.technologies;
      q.where.technologies = { [OP.overlap]: techArr };
    }

    if (req.query.hub) {
      let hubArr = req.query.hub;
      q.where.hub = { [OP.overlap]: hubArr };
    }

    if (req.query.otherTags) {
      let otherArr = req.query.otherTags;
      q.where.otherTags = { [OP.overlap]: otherArr };
    }

    if (req.query.iconIds && !req.query.iconName) {
      let idArr = req.query.iconIds;
      q.where.iconName = { [OP.in]: idArr };
    }

    if (typeof req.query.archived !== "undefined") {
      let archivedVal = req.query.archived.toLowerCase() === "true";
      q.where.archived = archivedVal;
    }

    let icons = await db.Icon.findAndCountAll(q);
    icons.numPages = Math.ceil(icons.count / q.limit);
    icons.page = page;
    return icons;
  }

  async function findPreviewIcons(req) {
    let q = {
      limit: defaults.LIMIT,
      offset: defaults.OFFSET,
      distinct: true,
      order: [["iconName", "desc"]],
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
      } else if (req.query.limit <= 0) {
        delete q.limit;
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

    if (req.body.iconNames) {
      let nameArr = req.body.iconNames;
      q.where.iconName = { [OP.in]: nameArr };
    } else if (req.body.iconIds) {
      let nameArr = req.body.iconIds;
      q.where.id = { [OP.in]: nameArr };
    }

    q.where.archived = "false";

    let icons = await db.Icon.findAndCountAll(q);
    icons.numPages = Math.ceil(icons.count / q.limit);
    icons.page = page;
    return icons;
  }

  router.get(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_ICON_ROLES),
    async function (req, res, next) {
      try {
        let resp = {};

        const icons = await findIcons(req);
        let numRecords = icons.count;
        resp.total = numRecords;
        resp.numPages = icons.numPages;
        resp.page = icons.page;

        delete icons.count;
        delete icons.numPages;
        delete icons.page;

        resp.icons = icons.rows;

        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(GET_ICON_ROLES),
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

        if (type) {
          q.where.tag = type;
        }

        const icon = await db.Icon.findByPk(req.params.id, q);

        if (icon === null) {
          return res.status(404).json({ error: "Not Found" });
        }

        res.json({ icon: icon });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.post(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(CREATE_ICON_ROLES),
    async function (req, res, next) {
      try {
        if (!req.body || !req.body.iconName) {
          return res.status(400).json({ error: "iconName is required" });
        }

        let data = {
          iconName: req.body.iconName,
          originalFilename: req.body.originalFilename
            ? req.body.originalFilename
            : "",
          createdBy: req.user.id,
          archived: false,
        };

        if (type) {
          data.tag = type;
          data.discoveryModel = true;
        } else if (typeof req.body.tag === "string" && req.body.tag !== "") {
          data.tag = req.body.tag;
          data.discoveryModel = true;
        } else {
          data.tag = null;
          data.discoveryModel = false;
        }

        if (!db.Icon.TYPES.includes(data.tag) && !!data.tag) {
          return res.status(400).json({
            error: `Tag must either be empty or in ${db.Icon.TYPES}`,
          });
        }

        if (typeof req.body.discoveryModel === "boolean") {
          data.discoveryModel = req.body.discoveryModel;
        }

        if (req.body.industryVertical) {
          data.industryVertical = req.body.industryVertical;
        }

        if (req.body.useCase) {
          data.useCase = req.body.useCase;
        }

        if (req.body.notes) {
          data.notes = req.body.notes;
        }

        if (req.body.partners) {
          data.partners = req.body.partners;
        }

        if (req.body.technologies) {
          data.technologies = req.body.technologies;
        }

        if (req.body.hub) {
          data.hub = req.body.hub;
        }

        if (req.body.otherTags) {
          data.otherTags = req.body.otherTags;
        }

        if (req.body.storageLocation) {
          data.storageLocation = req.body.storageLocation;
        }

        const icon = await db.Icon.create(data);

        res.status(201).json({ icon: icon });
      } catch (e) {
        console.log({ e });
        res.status(500).json({ error: e });
      }
    }
  );

  router.put(
    "/previews",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_ICON_ROLES),
    async function (req, res, next) {
      try {
        let resp = {};

        const icons = await findPreviewIcons(req);
        let numRecords = icons.count;
        resp.total = numRecords;
        resp.numPages = icons.numPages;
        resp.page = icons.page;

        delete icons.count;
        delete icons.numPages;
        delete icons.page;

        resp.icons = icons.rows;

        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.put(
    "/:id/activate",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_ICON_ROLES),
    async function (req, res, next) {
      let data = { archived: false };

      const icon = await db.Icon.update(data, {
        where: { id: req.params.id },
        returning: true,
      });

      res.status(200).json({ icon: icon[1][0] });
    }
  );

  router.all(
    "/:id/upload",
    /*auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_ICON_ROLES),*/
    async function (req, res, next) {
      if (req.method === "GET") {
        res.status(404).json({ error: "Not Found" });
      }
      if (typeof tusServers[req.params.id] === "undefined") {
        tusServers[req.params.id] = new tus.Server({
          path: `/${req.params.id}/upload`,
          namingFunction: randomString,
        });
        tusServers[req.params.id].datastore = new tus.FileStore({
          directory: FILE_DIR,
        });

        tusServers[req.params.id].on(
          EVENTS.EVENT_UPLOAD_COMPLETE,
          async (event) => {
            const uploadMetadata = event.file.upload_metadata
              .split(",")
              .reduce((acc, cur) => {
                const [key, value] = cur.split(" ");
                const curValue = new Buffer(value, "base64").toString("ascii");
                return {
                  ...acc,
                  [key]: curValue,
                };
              }, {});

            var originalFileName = uploadMetadata?.filename;
            let fileExt =
              originalFileName?.substring(
                originalFileName?.lastIndexOf(".") + 1,
                originalFileName?.length
              ) || "";
            let id = event.file.id;
            let iconId = null;
            console.log("369 pre @", id);
            if (id.indexOf("@") !== -1) {
              iconId = id.substring(0, id.indexOf("@"));
            }
            if (iconId !== null) {
              // File that needs to be uploaded.
              var file = FILE_DIR + "/" + event.file.id;

              minioClient.fPutObject(
                minioConf.bucket,
                event.file.id,
                file,
                {
                  "Content-Type": uploadMetadata?.filetype || null,
                },
                function (err, etag) {
                  if (err) {
                    console.error(
                      "S3 upload failed for icon: " +
                        iconId +
                        " with file id:" +
                        event.file.id,
                      err
                    );
                  } else {
                    var icon = FILE_DIR + "/" + iconId + "." + fileExt;
                    console.log("set tag ", minioConf.bucket, event.file.id);
                    minioClient.setObjectTagging(
                      minioConf.bucket,
                      event.file.id,
                      { icon: true }
                    );
                    // added extension
                    logger.debug(
                      "S3 upload for icon: " +
                        iconId +
                        " with file id:" +
                        event.file.id +
                        " successful."
                    );
                    let url = "http";
                    url += minioConf.ssl ? "s" : "";
                    url += "://" + minioConf.url;
                    url += env === "development" ? `:${minioConf.port}/` : "/";
                    url += minioConf.bucket + "/";
                    url += event.file.id;
                    let data = { storageLocation: url };

                    db.Icon.update(data, {
                      where: { id: iconId },
                      returning: true,
                    })
                      .then((iconData) => {
                        logger.debug("Icon updated", iconData);
                      })
                      .catch((iconE) => {
                        logger.debug("Failed to update icon", iconE);
                      });
                  }
                  if (fs.existsSync(icon)) {
                    fs.unlinkSync(file);
                  }
                }
              );
            } else {
            }
          }
        );
      }
      return tusServers[req.params.id].handle(req, res);
    }
  );

  router.all(
    "/:id/upload/:fileid",
    /*auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_ICON_ROLES),*/
    async function (req, res, next) {
      if (req.method === "GET") {
        res.status(404).json({ error: "Not Found" });
      }
      return tusServers[req.params.id].handle(req, res);
    }
  );

  router.get(
    "/:id/download",
    /*auth.requireLoggedIn,
    auth.requireRoleIn(VIEW_ICON_ROLES),*/
    async function (req, res, next) {
      const icon = await db.Icon.findByPk(req.params.id);
      if (!icon || !icon.storageLocation) {
        return res.status(404).json({ error: "Not Found" });
      }

      // gather info for saving preview
      var fileId = req.params.id;
      var originalFilename = icon?.originalFilename || "";
      var lastIndex = originalFilename?.lastIndexOf(".");
      var fileExt =
        originalFilename?.substring(lastIndex + 1, originalFilename.length) ||
        "";

      let iconId = null;
      let lastInd = icon.storageLocation.lastIndexOf("/");
      if (lastInd > -1) {
        iconId = icon.storageLocation.substring(lastInd + 1);
      }

      if (iconId === null) {
        return res.status(404).error({ error: "Not Found" });
      }

      const path = require("node:path");
      let sendFileOpts = {
        root: path.join(__dirname, "../../"),
      };

      //iconId should be something like req.params.id + "@" + tus id
      if (fs.existsSync(`${FILE_DIR}/${iconId}`)) {
        // save it to /icons folder for preview

        if (iconCache.has(iconId)) {
          iconCache.ttl(iconId, ICON_TTL); //extend ttl
        } else {
          iconCache.set(iconId, iconId);
        }
        var mmm = require("mmmagic"),
          Magic = mmm.Magic;
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(`${FILE_DIR}/${iconId}`, function (err, result) {
          res.setHeader("Content-Type", result);
          return res.sendFile(`${FILE_DIR}/${iconId}`, sendFileOpts);
        });
      } else {
        minioClient.fGetObject(
          minioConf.bucket,
          iconId,
          `${FILE_DIR}/${iconId}`,
          function (err) {
            if (err) {
              return console.log(err);
            }

            iconCache.set(iconId, iconId);
            var mmm = require("mmmagic"),
              Magic = mmm.Magic;
            var magic = new Magic(mmm.MAGIC_MIME_TYPE);
            magic.detectFile(`${FILE_DIR}/${iconId}`, function (err, result) {
              res.setHeader("Content-Type", result);
              return res.sendFile(`${FILE_DIR}/${iconId}`, sendFileOpts);
            });
          }
        );
      }
    }
  );

  router.put(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_ICON_ROLES),
    async function (req, res, next) {
      try {
        let data = {};

        if (typeof req.body.iconName !== "undefined") {
          data.iconName = req.body.iconName;
        }

        if (typeof req.body.originalFilename !== "undefined") {
          data.originalFilename = req.body.originalFilename;
        }

        data.tag = type || req.body.tag;

        if (!data.tag || data.tag === "") {
          data.tag = null;
        }

        data.discoveryModel = !!data.tag;

        if (
          typeof req.body.tag === "string" &&
          !db.Icon.TYPES.includes(data.tag) &&
          !!data.tag
        ) {
          return res
            .status(400)
            .json({ error: `Tag must either be empty or in ${db.Icon.TYPES}` });
        }

        if (typeof req.body.discoveryModel === "boolean") {
          data.discoveryModel = req.body.discoveryModel;
        }

        if (typeof req.body.industryVertical !== "undefined") {
          data.industryVertical = req.body.industryVertical;
        }

        if (typeof req.body.useCase !== "undefined") {
          data.useCase = req.body.useCase;
        }

        if (typeof req.body.notes !== "undefined") {
          data.notes = req.body.notes;
        }

        if (typeof req.body.partners !== "undefined") {
          data.partners = req.body.partners;
        }

        if (typeof req.body.technologies !== "undefined") {
          data.technologies = req.body.technologies;
        }

        if (typeof req.body.hub !== "undefined") {
          data.hub = req.body.hub;
        }

        if (typeof req.body.otherTags !== "undefined") {
          data.otherTags = req.body.otherTags;
        }

        const icon = await db.Icon.update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        if (typeof icon[1] === "undefined") {
          const origIcon = await db.Icon.findOne({
            where: { id: req.params.id },
          });
          if (origIcon === null) {
            res.status(404).json({ error: "Not Found" });
          }
          return res.status(200).json({ icon: origIcon });
        }

        res.status(200).json({ icon: icon[1][0] });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.delete(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(DELETE_ICON_ROLES),
    async function (req, res, next) {
      try {
        let data = { archived: true };

        const icon = await db.Icon.update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        res.status(200).json({ icon: icon[1][0] });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  router.delete(
    "/:id/detach",
    auth.requireLoggedIn,
    auth.requireRoleIn(DELETE_ICON_ROLES),
    async function (req, res, next) {
      const existingIcon = await db.Icon.findByPk(req.params.id);
      const storageLocation = existingIcon
        ? existingIcon.storageLocation
        : null;
      const originalFileName = existingIcon.originalFilename || "";
      if (!storageLocation) {
        return res
          .status(500)
          .json({ error: "Unable to locate the image file." });
      }
      if (req.query.isUsingDefault) {
        let data = { storageLocation: null };
        const icon = await db.Icon.update(data, {
          where: { id: req.params.id },
          returning: true,
        });
        res.status(200).json({
          icon: { id: req.params.id },
          message: "Successfully removed image file: " + originalFileName,
        });
      } else {
        const locationArr = storageLocation ? storageLocation.split("/") : [];
        const fileId = locationArr[locationArr.length - 1];
        if (fileId && fileId.includes("@")) {
          try {
            minioClient.removeObject(minioConf.bucket, fileId, function (err) {
              if (err) {
                return res.status(500).json({ error: err });
              }
            });
            let data = { storageLocation: null };
            const icon = await db.Icon.update(data, {
              where: { id: req.params.id },
              returning: true,
            });
            res.status(200).json({
              icon: { id: req.params.id },
              message: "Successfully removed image file: " + originalFileName,
            });
          } catch (e) {
            res.status(500).json({ error: e });
          }
        }
      }
    }
  );

  return router;
};

module.exports = {
  buildStatic: buildStatic,
  buildDynamic: buildDynamic,
};
