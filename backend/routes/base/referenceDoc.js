const LIST_RDOC_ROLES = ["solutions architect", "solutions engineer", "sales", "customer", "marketing"];
const GET_RDOC_ROLES = ["solutions architect", "sales", "marketing"];
const EDIT_RDOC_ROLES = ["solutions architect", "marketing"];
const CREATE_RDOC_ROLES = ["solutions architect", "marketing"];
const DELETE_RDOC_ROLES = ["solutions architect", "marketing"];

const VIEW_RDOC_ROLES = [
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
const RDOC_TTL = 60 * 60 * 2;
const RDOC_CHECK = RDOC_TTL + 20;
const rdocCache = new NodeCache({ stdTTL: RDOC_TTL, checkperiod: RDOC_CHECK });

rdocCache.on("del", function (key, value) {
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

var minioClient = new Minio.Client(mClientConf);

var buildStatic = function (db, router) {
  return router;
};

var buildDynamic = function (db, router, auth) {
  const defaults = require("./defaults");
  const sequelize = require("sequelize");
  const OP = sequelize.Op;
  const logger = require("npmlog");

  // req is http.IncomingMessage
  const randomString = (req) => {
    // same as the default implementation
    const crypto = require("crypto");
    let r = crypto.randomBytes(16).toString("hex");
    if (req.params.id) {
      r = req.params.id + "@" + r;
    }
    return r;
  };

  async function findRdocs(req) {
    let q = {
      limit: defaults.LIMIT,
      offset: defaults.OFFSET,
      distinct: true,
      order: [["docName", "desc"]],
      include: [
        {
          model: db.User,
          as: "fullCreatedBy",
          attributes: { exclude: ["password", "salt"] },
        },
      ],
      where: {
        docType: db.Document.ARCHITECTURE_TYPE,
      },
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

    if (req.query.docName) {
      q.where.docName = { [OP.iLike]: req.query.docName };
    }

    if (req.query.projectId) {
      q.where.projectId = { [OP.match]: req.query.projectId };
    }

    if (typeof req.query.archived !== "undefined") {
      let archivedVal = req.query.archived.toLowerCase() === "true";
      q.where.archived = archivedVal;
    }

    if (req.query.types) {
      let typeArr = req.query.types;
      q.where.types = { [OP.overlap]: typeArr };
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

    if (req.query.originalFilename) {
      q.where.originalFilename = originalFilename;
    }

    let docs = await db.Document.findAndCountAll(q);
    docs.numPages = Math.ceil(docs.count / q.limit);
    docs.page = page;
    return docs;
  }

  router.get(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_RDOC_ROLES),
    async function (req, res, next) {
      try {
        let resp = {};

        const docs = await findRdocs(req);
        let numRecords = docs.count;
        resp.total = numRecords;
        resp.numPages = docs.numPages;
        resp.page = docs.page;

        delete docs.count;
        delete docs.numPages;
        delete docs.page;

        resp.documents = docs.rows;

        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(GET_RDOC_ROLES),
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

        const doc = await db.Document.findByPk(req.params.id, q);

        if (doc === null) {
          return res.status(404).json({ error: "Not Found" });
        }

        res.json({ document: doc });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.post(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(CREATE_RDOC_ROLES),
    async function (req, res, next) {
      try {
        if (!req.body || !req.body.docName) {
          return res.status(400).json({ error: "docName is required" });
        }

        let data = {
          docType: db.Document.ARCHITECTURE_TYPE,
          docName: req.body.docName,
          originalFilename: req.body.originalFilename
            ? req.body.originalFilename
            : "",
          createdBy: req.user.id,
          archived: false,
        };

        if (req.body.industryVertical) {
          data.industryVertical = req.body.industryVertical;
        }

        if (req.body.useCase) {
          data.useCase = req.body.useCase;
        }

        if (req.body.notes) {
          data.notes = req.body.notes;
        }

        if (req.body.types) {
          data.types = req.body.types;
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

        if (req.body.fileSize) {
          data.fileSize = req.body.fileSize;
        }

        const document = await db.Document.create(data);

        res.status(201).json({ document: document });
      } catch (e) {
        res.status(500).json({ error: e });
      }
    }
  );

  router.put(
    "/:id/activate",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_RDOC_ROLES),
    async function (req, res, next) {
      let data = { archived: false };

      const document = await db.Document.update(data, {
        where: { id: req.params.id },
        returning: true,
      });

      res.status(200).json({ document: document[1][0] });
    }
  );

  router.all(
    "/:id/upload",
    /*auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_RDOC_ROLES),*/
    async function (req, res, next) {
      if (req.method === "GET") {
        res.status(404).json({ error: "Not Found" });
      }
      if (typeof tusServers[req.params.id] === "undefined") {
        tusServers[req.params.id] = new tus.Server({
          path: `/${req.params.id}/mupload`,
          namingFunction: randomString,
        });
        tusServers[req.params.id].datastore = new tus.FileStore({
          directory: FILE_DIR,
        });

        tusServers[req.params.id].on(
          EVENTS.EVENT_UPLOAD_COMPLETE,
          async (event) => {
            let id = event.file.id;
            let docId = null;
            if (id.indexOf("@") !== -1) {
              docId = id.substring(0, id.indexOf("@"));
            }
            if (docId !== null) {
              // File that needs to be uploaded.
              var file = FILE_DIR + "/" + event.file.id;

              minioClient.fPutObject(
                minioConf.bucket,
                event.file.id,
                file,
                {},
                function (err, etag) {
                  fs.unlinkSync(file);
                  if (err) {
                    console.error(
                      "S3 upload failed for mdocument: " +
                        docId +
                        " with file id:" +
                        event.file.id,
                      err
                    );
                  } else {
                    logger.debug(
                      "S3 upload for mdocument: " +
                        docId +
                        " with file id:" +
                        event.file.id +
                        " successful."
                    );
                    let url = "http";
                    url += minioConf.ssl ? "s" : "";
                    url += "://" + minioConf.url + "/" + minioConf.bucket + "/";
                    url += event.file.id;
                    let data = { storageLocation: url };

                    db.Document.update(data, {
                      where: { id: docId },
                      returning: true,
                    })
                      .then((docData) => {
                        logger.debug("RDoc updated", docData);
                      })
                      .catch((docE) => {
                        logger.debug("Failed to update document", docE);
                      });
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
    "/:id/mupload/:fileid",
    /*auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_RDOC_ROLES),*/
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
    auth.requireRoleIn(VIEW_RDOC_ROLES),*/
    async function (req, res, next) {
      const doc = await db.Document.findByPk(req.params.id);
      if (!doc || !doc.storageLocation) {
        return res.status(404).json({ error: "Not Found" });
      }

      let docId = null;
      let lastInd = doc.storageLocation.lastIndexOf("/");
      if (lastInd > -1) {
        docId = doc.storageLocation.substring(lastInd + 1);
      }

      if (docId === null) {
        return res.status(404).json({ error: "Not Found" });
      }

      const path = require("node:path");
      let sendFileOpts = {
        root: path.join(__dirname, "../../"),
      };

      //docId should be something like req.params.id + "@" + tus id
      if (fs.existsSync(`${FILE_DIR}/${docId}`)) {
        if (rdocCache.has(docId)) {
          rdocCache.ttl(docId, RDOC_TTL); //extend ttl
        } else {
          rdocCache.set(docId, docId);
        }
        var mmm = require("mmmagic"),
          Magic = mmm.Magic;
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(`${FILE_DIR}/${docId}`, function (err, result) {
          res.setHeader("Content-Type", result);
          return res.sendFile(`${FILE_DIR}/${docId}`, sendFileOpts);
        });
      } else {
        minioClient.fGetObject(
          minioConf.bucket,
          docId,
          `${FILE_DIR}/${docId}`,
          function (err) {
            if (err) {
              return console.log(err);
            }

            rdocCache.set(docId, docId);
            var mmm = require("mmmagic"),
              Magic = mmm.Magic;
            var magic = new Magic(mmm.MAGIC_MIME_TYPE);
            magic.detectFile(`${FILE_DIR}/${docId}`, function (err, result) {
              res.setHeader("Content-Type", result);
              return res.sendFile(`${FILE_DIR}/${docId}`, sendFileOpts);
            });
          }
        );
      }
    }
  );

  router.put(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_RDOC_ROLES),
    async function (req, res, next) {
      try {
        let data = {};

        if (typeof req.body.docName !== "undefined") {
          data.docName = req.body.docName;
        }

        if (typeof req.body.originalFilename !== "undefined") {
          data.originalFilename = req.body.originalFilename;
        }

        if (typeof req.body.notes !== "undefined") {
          data.notes = req.body.notes;
        }

        if (typeof req.body.industryVertical !== "undefined") {
          data.industryVertical = req.body.industryVertical;
        }

        if (typeof req.body.useCase !== "undefined") {
          data.useCase = req.body.useCase;
        }

        if (typeof req.body.types !== "undefined") {
          data.types = req.body.types;
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

        const document = await db.Document.update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        if (typeof document[1] === "undefined") {
          const origDoc = await db.Document.findOne({
            where: { id: req.params.id },
          });
          if (origDoc === null) {
            res.status(404).json({ error: "Not Found" });
          }
          return res.status(200).json({ document: origDoc });
        }

        res.status(200).json({
          document: {
            ...document[1][0].toJSON(),
            fullCreatedBy: {
              id: req.user.id,
              firstName: req.user.firstName,
              lastName: req.user.lastName,
            },
          },
        });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.delete(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(DELETE_RDOC_ROLES),
    async function (req, res, next) {
      try {
        let data = { archived: true };

        const document = await db.Document.update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        res.status(200).json({ document: document[1][0] });
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
