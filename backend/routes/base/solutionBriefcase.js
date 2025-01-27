const defaults = require('./defaults');
const sequelize = require('sequelize');
const config = require('config');
const tus = require('tus-node-server');
const { EVENTS } = require('tus-node-server');
const fs = require('fs');
const pdf = require('pdf-creator-node');
const NodeCache = require('node-cache');
const minioConf = config.get('minio');
const logger = require('npmlog');
const puppeteer = require('puppeteer');
const OP = sequelize.Op;
const FILE_DIR = './files';
const PUBLIC_DIR = './public';

const SBRIEF_TTL = 60 * 60 * 2;
const SBRIEF_CHECK = SBRIEF_TTL + 20;
const sbriefCache = new NodeCache({
  stdTTL: SBRIEF_TTL,
  checkperiod: SBRIEF_CHECK,
});

sbriefCache.on('del', function (key, value) {
  fs.unlinkSync(`${FILE_DIR}/${key}`);
});

let tusServers = {};

const mClientConf = {
  endPoint: minioConf.url,
  port: minioConf.port,
  useSSL: minioConf.ssl,
  accessKey: minioConf.accessKey,
  secretKey: minioConf.secretKey,
  region: minioConf.bucketRegion,
};

var Minio = require('minio');
const path = require('node:path');
const mmm = require('mmmagic');
const crypto = require('crypto');
var minioClient = new Minio.Client(mClientConf);

const VIEW_SOLUTION_BRIEFCASE_ROLES = ['solutions architect', 'customer'];
const GET_SOLUTION_BRIEFCASE_ROLES = ['solutions architect', 'customer'];
const EDIT_SOLUTION_BRIEFCASE_ROLES = ['solutions architect'];
const CREATE_SOLUTION_BRIEFCASE_ROLES = ['solutions architect'];
const DELETE_SOLUTION_BRIEFCASE_ROLES = ['solutions architect'];

const randomString = req => {
  // same as the default implementation
  const crypto = require('crypto');
  let r = crypto.randomBytes(16).toString('hex');
  if (req.params.id) {
    r = req.params.id + '@' + r;
  }
  return r;
};

var sendEmail = async function (db, updatedObj, user, body) {
  var emailNotify = require('../../notifications/email');
  let applicationName = config.has('applicationName') ? config.get('applicationName') : 'PDx Modeler';

  let emailContent = `<p>New version of the ${body.originalFilename} has been uploaded by ${user.firstName + ' ' + user.lastName}.</p>`;
  emailContent += `<p></p>`;
  emailContent += `<p>${updatedObj[1][0].notes}.</p>`;
  let subject = `New solution brief - ${applicationName}`;

  let roleQ = { where: { name: 'admin' } };

  let adminRole = await db.Role.findOne(roleQ);

  roleQ.where = { name: 'solutions architect' };
  let saRole = await db.Role.findOne(roleQ);

  let projectQ = {
    where: {
      id: updatedObj[1][0].projectId,
    },
    distinct: true,
    order: [['title', 'desc']],
    include: [
      {
        model: db.User,
        as: 'associatedUsers',
        where: {
          [OP.or]: [{ role: adminRole.id }, { role: saRole.id }],
        },
        attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
        through: {
          attributes: [],
        },
      },
    ],
  };

  let project = await db.Project.findOne(projectQ);

  let emailToUsers = project && project.associatedUsers ? project.associatedUsers : [];

  for (let i = 0; i < emailToUsers.length; i++) {
    emailContent = `<p>Hi ${emailToUsers[i].firstName} ${emailToUsers[i].lastName},</p>${emailContent}`;
    try {
      //omit logged in user if applicable
      if (emailToUsers[i].email !== user.email) {
        emailNotify.send(emailContent, emailToUsers[i].email, subject);
        console.log('Email sent to ', emailToUsers[i].email);
      }
    } catch (e) {
      console.error('Failed to send email', emailToUsers[i].email);
    }
  }
};

var buildStatic = function (db, router, auth) {
  // Going to let Frontend handles version on payload
  // router.get(
  //   "/latestVersion",
  //   auth.requireLoggedIn,
  //   auth.requireRoleIn(EDIT_SOLUTION_BRIEFCASE_ROLES),
  //   async function (req, res, next) {}
  // );

  router.put('/generate_pdf', auth.requireLoggedIn, auth.requireRoleIn(EDIT_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    let browser;
    try {
      // During development, if restarting the backend or the session expires, need to relogin in order for this endpoint
      // to work, because the set jwt on the user is lost when the backend goes down.
      if (!req.user?.jwt) {
        return res.status(401).json({ error: 'Not Authorized' });
      }

      browser = await puppeteer.launch({
        args: ['--disable-web-security'],
        headless: 'new',
        ignoreHTTPSErrors: true,
      });
      const page = await browser.newPage();

      const currentDateTime = new Date();
      const localStorageItems = {
        userDrJWT: req.user.jwt,
        userLoginExpiringAt: currentDateTime.setHours(currentDateTime.getHours() + 2).toString(),
        userLoginStatus: 'Logged in',
      };

      await page.evaluateOnNewDocument(localStorageItems => {
        for (const key in localStorageItems) {
          localStorage.setItem(key, localStorageItems[key]);
        }
      }, localStorageItems);

      // Expecting to be the `pdx` key and value, necessary to making sure puppeteer has the same
      // authorization and authentication as this request user
      const [name, value] = Object.entries(req.cookies)[0];
      await page.setCookie({ domain: 'localhost', name, value });

      const { id: solutionBriefId, projectId } = req.body;

      if (!projectId) {
        return res.status(400).json({ error: 'Missing `projectId` in request body' });
      }

      if (!solutionBriefId) {
        return res.status(400).json({ error: 'Missing `id` in request body' });
      }

      const project = await db.Project.findByPk(projectId);

      if (project === null) {
        console.error(`Can't find project: ${projectId}`);
        return res.status(404).json({ error: 'Not Found' });
      }

      const solutionBrief = await db.SolutionBriefcase.findByPk(solutionBriefId);

      if (solutionBrief === null) {
        console.error(`Can't find solution brief: ${solutionBriefId}`);
        return res.status(404).json({ error: 'Not Found' });
      }

      let host = req.get('host');
      if (host.indexOf(':') !== -1) {
        host = host.substring(0, host.indexOf(':'));
        host = host + ':3001';
      }

      await page.goto(`${req.protocol}://${host}/pdf/discover-customer-view?projectId=${projectId}&solutionBriefId=${solutionBriefId}`, { waitUntil: 'networkidle2' });
      let stats = {};
      const file = `${FILE_DIR}/${req.body.originalFilename || 'output.pdf'}`;
      await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true });

      await browser.close();

      //upload the file and delete from temp folder
      let url = 'http';
      url += minioConf.ssl ? 's' : '';
      url += '://' + minioConf.url + '/' + minioConf.bucket + '/';
      url += req.body.originalFilename;
      let data = { storageLocation: url };

      // wait for update url to be completed(if generate fails the record will be deleted anyways)
      const updatedObj = await db.SolutionBriefcase.update(data, {
        where: { id: solutionBriefId },
        returning: true,
      });

      if (fs.existsSync(file) && updatedObj?.[1]?.[0]?.id) {
        try {
          stats = fs.statSync(file);
          minioClient.fPutObject(minioConf.bucket, req.body.originalFilename, file, {}, async function (err, etag) {
            fs.unlinkSync(file);
            if (err) {
              console.error('S3 upload failed for solution briefcase: ' + req.body.originalFilename + ' with file id:' + req.body.originalFilename, err);
            } else {
              logger.debug('S3 upload for solution briefcase: ' + req.body.originalFilename + ' with file id:' + req.body.originalFilename + ' successful.');
            }
          });
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: 'Failed uploading' });
        }

        await sendEmail(db, updatedObj, req.user, req.body);

        res.status(200).json({ updatedObj, stats, message: 'Generate completed' });
      } else {
        res.status(500).json({ error: 'Failed generate pdf' });
      }

      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  return router;
};

var buildDynamic = function (db, router, auth) {
  // const randomString = (req) => {
  //   // same as the default implementation
  //   const crypto = require("crypto");
  //   let r = crypto.randomBytes(16).toString("hex");
  //   if (req.params.id) {
  //     r = req.params.id + "@" + r;
  //   }
  //   return r;
  // };

  async function findSolutionBriefcase(req) {
    let q = {
      limit: defaults.LIMIT,
      offset: defaults.OFFSET,
      distinct: true,
      order: [['id', 'desc']],
      distinct: true,
      include: [
        {
          model: db.User,
          as: 'fullCreatedBy',
          attributes: { exclude: ['password', 'salt'] },
        },
      ],
      where: {},
      subQuery: false,
    };

    let page = 0;

    if (typeof req.query.limit !== 'undefined') {
      if (req.query.limit > defaults.LIMIT_LIMIT) {
        throw new Error(`Limit must be less than ${defaults.LIMIT_LIMIT}`);
      } else if (req.query.limit < 0) {
        throw new Error(`Limit must be 0 or more`);
      } else {
        q.limit = req.query.limit;
      }
    }

    if (typeof req.query.page !== 'undefined') {
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

    let solutionBriefcases = await db.SolutionBriefcase.findAndCountAll(q);
    solutionBriefcases.numPages = Math.ceil(solutionBriefcases.count / q.limit);
    solutionBriefcases.page = page;
    return solutionBriefcases;
  }

  router.get('/', auth.requireLoggedIn, auth.requireRoleIn(GET_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    try {
      let resp = {};

      const solutionBriefcases = await findSolutionBriefcase(req);
      let numRecords = solutionBriefcases.count;
      resp.total = numRecords;
      resp.numPages = solutionBriefcases.numPages;
      resp.page = solutionBriefcases.page;

      delete solutionBriefcases.count;
      delete solutionBriefcases.numPages;
      delete solutionBriefcases.page;

      resp.solutionBriefcases = solutionBriefcases.rows;

      res.status(200).json(resp);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.get('/:id', auth.requireLoggedIn, auth.requireRoleIn(GET_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    try {
      let q = {
        include: [
          {
            model: db.User,
            as: 'fullCreatedBy',
            attributes: { exclude: ['password', 'salt'] },
          },
        ],
      };
      if (req.params.id === null) {
        return res.status(404).json({ error: 'Not Found' });
      }

      const solutionBriefcase = await db.SolutionBriefcase.findByPk(req.params.id, q);

      if (solutionBriefcase === null) {
        return res.status(404).json({ error: 'Not Found' });
      }

      res.json({ solutionBriefcase: solutionBriefcase });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  router.post('/', auth.requireLoggedIn, auth.requireRoleIn(CREATE_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    try {
      if (!req.body || !req.body.projectId) {
        return res.status(400).json({ error: 'projectId is required' });
      }

      if (!(req.body || req.body.briefcaseVersionCode || req.body.briefcaseMajorVersion || req.body.briefcaseMinorVersion)) {
        return res.status(400).json({ error: 'version is required' });
      }

      let data = {
        originalFilename: req.body.originalFilename ? req.body.originalFilename : '',
        projectId: req.body.projectId,
        briefcaseVersionCode: req.body.briefcaseVersionCode,
        briefcaseMajorVersion: req.body.briefcaseMajorVersion,
        briefcaseMinorVersion: req.body.briefcaseMinorVersion,
        notes: req.body.notes,
        createdBy: req.user.id,
      };
      if (req?.body?.publishedBy) {
        data.publishedBy = req.user.id;
      }

      if (req.body.fileSize) {
        data.fileSize = req.body.fileSize;
      }

      const solutionBriefcase = await db.SolutionBriefcase.create(data);

      res.status(201).json({
        solutionBriefcase: {
          ...solutionBriefcase.toJSON(),
          fullCreatedBy: {
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
          },
        },
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.all('/:id/upload', auth.requireLoggedIn, auth.requireRoleIn(EDIT_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    const existingBrief = await db.SolutionBriefcase.findByPk(req.params.id);
    if (!existingBrief || !existingBrief.originalFilename) {
      res.status(404).json({ error: 'Source Not Found' });
    }
    if (req.method === 'GET') {
      res.status(404).json({ error: 'Not Found' });
    }
    if (typeof tusServers[req.params.id] === 'undefined') {
      tusServers[req.params.id] = new tus.Server({
        path: `/${req.params.id}/mupload`,
        namingFunction: () => encodeURIComponent(existingBrief.originalFilename),
      });
      tusServers[req.params.id].datastore = new tus.FileStore({
        directory: FILE_DIR,
      });

      tusServers[req.params.id].on(EVENTS.EVENT_UPLOAD_COMPLETE, async event => {
        let id = event.file.id;
        let docId = null;
        const originalFilename = existingBrief.originalFilename;
        const originalFilenameEncoded = encodeURIComponent(existingBrief.originalFilename);
        // if (id.indexOf("@") !== -1) {
        //   docId = id.substring(0, id.indexOf("@"));
        // }
        if (originalFilename && originalFilenameEncoded) {
          var file = FILE_DIR + '/' + originalFilenameEncoded;

          minioClient.fPutObject(minioConf.bucket, originalFilename, file, {}, function (err, etag) {
            fs.unlinkSync(file);
            if (err) {
              console.error('S3 upload failed for solution briefcase: ' + originalFilename, err);
            } else {
              logger.debug('S3 upload for solution briefcase: ' + originalFilename + ' successful.');
              let url = 'http';
              url += minioConf.ssl ? 's' : '';
              url += '://' + minioConf.url + '/' + minioConf.bucket + '/';
              url += originalFilenameEncoded;
              let data = { storageLocation: url };

              db.SolutionBriefcase.update(data, {
                where: { id: req.params.id },
                returning: true,
              })
                .then(async docData => {
                  let b = {
                    originalFilename: originalFilename,
                  };
                  await sendEmail(db, docData, req.user, b);
                  logger.debug('Solution briefcase updated', docData);
                })
                .catch(docE => {
                  logger.debug('Failed to update solution briefcase', docE);
                });
            }
          });
        } else {
        }
      });
    }
    if (req.headers.origin) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    return tusServers[req.params.id].handle(req, res);
  });

  router.all(
    '/:id/mupload/:fileid',
    /*auth.requireLoggedIn, auth.requireRoleIn(EDIT_SBRIEF_ROLES),*/ async function (req, res, next) {
      if (req.method === 'GET') {
        res.status(404).json({ error: 'Not Found' });
      }

      return tusServers[req.params.id].handle(req, res);
    }
  );

  router.get('/:id/download', auth.requireLoggedIn, auth.requireRoleIn(VIEW_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    const solutionBrief = await db.SolutionBriefcase.findByPk(req.params.id);
    if (!solutionBrief || !solutionBrief.storageLocation) {
      return res.status(404).json({ error: 'Not Found' });
    }

    let docId = solutionBrief.originalFilename;

    const path = require('node:path');
    let sendFileOpts = {
      root: path.join(__dirname, '../../'),
    };

    if (fs.existsSync(`${FILE_DIR}/${docId}`)) {
      if (sbriefCache.has(docId)) {
        sbriefCache.ttl(docId, SBRIEF_TTL); //extend ttl
      } else {
        sbriefCache.set(docId, docId);
      }
      var mmm = require('mmmagic'),
        Magic = mmm.Magic;
      var magic = new Magic(mmm.MAGIC_MIME_TYPE);
      magic.detectFile(`${FILE_DIR}/${docId}`, function (err, result) {
        res.setHeader('Content-Type', result);
        return res.sendFile(`${FILE_DIR}/${docId}`, sendFileOpts);
      });
    } else {
      minioClient.fGetObject(minioConf.bucket, docId, `${FILE_DIR}/${docId}`, function (err) {
        if (err) {
          return console.log(err);
        }

        sbriefCache.set(docId, docId);
        var mmm = require('mmmagic'),
          Magic = mmm.Magic;
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(`${FILE_DIR}/${docId}`, function (err, result) {
          res.setHeader('Content-Type', result);
          return res.sendFile(`${FILE_DIR}/${docId}`, sendFileOpts);
        });
      });
    }
  });

  router.put('/:id', auth.requireLoggedIn, auth.requireRoleIn(EDIT_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    try {
      let data = {};

      if (typeof req.body.notes !== "undefined") {
        data.notes = req.body.notes;
      }
      if (req.body.fileSize) {
        data.fileSize = req.body.fileSize;
      }
      if (req.body?.publishedBy === "null") {
        data.publishedBy = null;
      }
      const solutionBriefcase = await db.SolutionBriefcase.update(data, {
        where: { id: req.params.id },
        returning: true,
      });

      if (typeof solutionBriefcase[1] === 'undefined') {
        const origSolutionBriefcase = await db.SolutionBriefcase.findOne({
          where: { id: req.params.id },
        });
        if (origSolutionBriefcase === null) {
          res.status(404).json({ error: 'Not Found' });
        }
        return res.status(200).json({ solutionBriefcase: origSolutionBriefcase });
      }
      res.status(200).json({ solutionBriefcase: solutionBriefcase[1][0] });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  router.put('/:id/publish', auth.requireLoggedIn, auth.requireRoleIn(EDIT_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    let data = {};

    const existingBriefcase = await db.SolutionBriefcase.findByPk(req.params.id);

    if (!existingBriefcase) {
      return res.status(404).json({ error: 'Not Found' });
    }
    if (existingBriefcase?.briefcaseMajorVersion === 0 && existingBriefcase?.briefcaseMinorVersion === 0) {
      return res.status(400).json({ error: 'Can not publish the initial version' });
    }

    if (!(req.body || req.body.briefcaseMajorVersion)) {
      return res.status(400).json({ error: 'Major version is required' });
    }

    data.publishedDate = sequelize.fn('NOW');
    data.notes = req.body.notes ? req.body.notes : '';
    // code stays the same
    data.briefcaseVersionCode = existingBriefcase.briefcaseVersionCode;
    // only need to update the major version to be the largest
    data.briefcaseMajorVersion = req.body.briefcaseMajorVersion;
    // minor version is always 0 when published
    data.briefcaseMinorVersion = 0;
    data.publishedBy = req.user.id;

    const solutionBriefcase = await db.SolutionBriefcase.update(data, {
      where: { id: req.params.id },
      returning: true,
    });

    var emailNotify = require('../../notifications/email');
    let applicationName = config.has('applicationName') ? config.get('applicationName') : 'PDx Modeler';

    let projectQ = {
      where: {
        id: solutionBriefcase[1][0].projectId,
      },
      distinct: true,
      order: [['title', 'desc']],
      include: [
        {
          model: db.User,
          as: 'associatedUsers',
          attributes: { exclude: ['password', 'salt', 'resetCode', 'resetExpiry'] },
          through: {
            attributes: [],
          },
        },
      ],
    };

    let project = await db.Project.findOne(projectQ);

    let host = req.get('host');
    if (host.indexOf(':') !== -1) {
      host = host.substring(0, host.indexOf(':'));
      host = host + ':3001';
    }

    let path = `${req.protocol}://${host}/project-modeler/${project.id}`;

    let emailContent = `<p>New documents are available from the ${project.title} briefcase.</p>`;
    emailContent += `<p></p>`;
    emailContent += `<p>Please visit <a href="${path}">${path}</a> to download.</p>`;
    let subject = `New documents in briefcase - ${applicationName}`;

    let emailToUsers = project && project.associatedUsers ? project.associatedUsers : [];

    for (let i = 0; i < emailToUsers.length; i++) {
      emailContent = `${emailContent}`;
      try {
        //omit logged in user if applicable
        if (emailToUsers[i].email !== req.user.email) {
          emailNotify.send(emailContent, emailToUsers[i].email, subject);
        }
      } catch (e) {
        console.error('Failed to send email');
      }
    }

    res.status(200).json({ solutionBriefcase: solutionBriefcase[1][0] });
  });

  router.delete('/:id', auth.requireLoggedIn, auth.requireRoleIn(DELETE_SOLUTION_BRIEFCASE_ROLES), async function (req, res, next) {
    try {
      const solutionBriefcaseToBeRemoved = await db.SolutionBriefcase.destroy({
        where: { id: req.params.id },
      });

      res.status(200).json({
        solutionBriefcase: { id: req.params.id },
        message: 'Successfully removed briefcase.',
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  return router;
};

module.exports = {
  buildStatic: buildStatic,
  buildDynamic: buildDynamic,
};
