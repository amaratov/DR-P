const { ValidationError } = require("sequelize");

const LIST_USER_ROLES = ["sales", "solutions architect"];
const EDIT_USER_ROLES = ["sales", "solutions architect"];
const CREATE_USER_ROLES = ["sales", "solutions architect"];
const DELETE_USER_ROLES = ["sales", "solutions architect"];

var buildStatic = function (db, router, auth) {
  const logger = require("npmlog");
  const config = require("config");

  router.post("/forgotpassword", async function (req, res, next) {
    if (!req.body || !req.body.email) {
      return res.status(404).json({ error: "Not Found" });
    }

    try {
      const user = await db.User.findOne(
        { where: { email: req.body.email.toLowerCase() } },
        { attributes: { exclude: ["password", "salt"] } }
      );
      if (user === null) {
        return res.status(404).json({ error: "Not Found" });
      }

      let date = new Date();

      //fail quicker if the user has already requested a reset token that hasn't yet expired
      //to prevent brute force attacks
      if (user.resetExpiry !== null && date < user.resetExpiry) {
        return res.status(404).json({ error: "Not Found" });
      }

      let host = req.get("host");
      if (host.indexOf(":") !== -1) {
        host = host.substring(0, host.indexOf(":"));
        host = host + ":3001";
      }
      let expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      const crypto = require("crypto");
      let token = crypto
        .randomBytes(40)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/\=/g, "");

      const resetUrl = `${req.protocol}://${host}/reset?resetCode=${token}`;
      user.resetCode = token;
      user.resetExpiry = expiry;
      await user.save();

      var emailNotify = require("../../notifications/email");
      let applicationName = config.has("applicationName")
        ? config.get("applicationName")
        : "PDx Modeler";
      let emailContent = `<p>Hi ${user.firstName} ${user.lastName},</p>`;

      emailContent += `<p>You have requested a password reset for ${applicationName}.</p>`;
      emailContent += `<p>to continue resetting your password you 24 hours at the following link ${resetUrl}.</p>`;
      emailContent += `<p>Your verification code is ${user.resetCode} and expires ${user.resetExpiry}</p>`;
      emailContent += `<p>If you did not request this you can safely ignore this email.</p>`;
      let subject = applicationName;
      subject += " - Password Reset";
      emailNotify.send(emailContent, user.email, subject);

      //always return a 404 not found to prevent a bad actor from learning an account exists
      res.status(404).json({ error: "Not Found" });
    } catch (e) {
      logger.error("Error resetting password", e.message, e);
      return res.status(404).json({ error: "Not Found" });
    }
  });

  router.post("/resetpassword", async function (req, res, next) {
    if (!req.body || !req.body.email) {
      return res.status(404).json({ error: "Not Found" });
    }

    if (!req.body.password) {
      return res.status(404).json({ error: "Not Found" });
    }

    if (!req.body.token) {
      return res.status(404).json({ error: "Not Found" });
    }

    try {
      const user = await db.User.findOne(
        { where: { email: req.body.email.toLowerCase() } },
        { attributes: { exclude: ["password", "salt"] } }
      );
      if (user === null) {
        return res.status(404).json({ error: "Not Found" });
      }

      if (user.resetCode !== req.body.token) {
        return res.status(404).json({ error: "Not Found" });
      }

      let date = new Date();

      if (date > user.resetExpiry) {
        return res.status(404).json({ error: "Not Found" });
      }

      user.password = req.body.password;
      user.resetCode = null;
      user.resetExpiry = null;
      user.salt = null;
      await user.save();

      res.status(202).json({ message: "Success" });
    } catch (e) {
      logger.error("Error resetting password", e.message, e);
      return res.status(404).json({ error: "Not Found" });
    }
  });

  router.get("/whoami", auth.requireLoggedIn, async function (req, res, next) {
    res.status(200).json({ user: req.user });
  });

  return router;
};

var buildDynamic = function (db, router, auth) {
  const OP = require("sequelize").Op;
  const Sequelize = require("sequelize");
  const PASSWORD_LIMIT = 60;
  const defaults = require("./defaults");

  router.get(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_USER_ROLES),
    async function (req, res, next) {
      try {
        let resp = {};
        let q = {
          attributes: { exclude: ["password", "salt"] },
          include: [
            { model: db.Role, as: "fullRole" },
            { model: db.User, as: "fullCreatedBy" },
          ],
          limit: defaults.LIMIT,
          offset: defaults.OFFSET,
          where: {},
          distinct: true,
          order: [
            ["lastName", "ASC"],
            ["firstName", "ASC"],
          ],
        };

        //pg-mem doesn't like many-many
        if (process.env.NODE_ENV !== "test") {
          assoc = {
            model: db.Company,
            as: "companies",
            attributes: {},
            through: {
              attributes: [],
            },
          };

          q.include.push(assoc);
        }

        if (req.query.firstName) {
          q.where.firstName = { [OP.iLike]: req.query.firstName };
        }

        if (req.query.lastName) {
          q.where.lastName = { [OP.iLike]: req.query.lastName };
        }

        if (req.query.name){
          q.where.namesQuery = Sequelize.where(Sequelize.fn('concat', Sequelize.col('user.firstName'), ' ', Sequelize.col('user.lastName')), {
            [OP.iLike]: req.query.name
          });
        }

        if (req.query.roles) {
          q.where.role = {
            [OP.in]: req.query.roles,
          };
        }

        if (req.query.archived) {
          q.where.archived = req.query.archived;
        }

        if (req.query.order) {
          let order = req.query.order;
          order = JSON.parse(order);
          q.order = order;
        }

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

        if (req.query.or) {
          q.where = {
            [OP.or]: q.where,
          };
        }

        let users = await db.User.findAndCountAll(q);
        let numRecords = users.count;
        delete users.count;
        resp.users = users.rows;
        resp.total = numRecords;
        resp.numPages = Math.ceil(numRecords / q.limit);
        res.status(200).json(resp);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(LIST_USER_ROLES),
    async function (req, res, next) {
      try {
        let q = {
          attributes: { exclude: ["password", "salt"] },
          include: [
            { model: db.Role, as: "fullRole" },
            { model: db.User, as: "fullCreatedBy" },
          ],
        };

        //pg-mem doesn't like many-many
        if (process.env.NODE_ENV !== "test") {
          assoc = {
            model: db.Company,
            as: "companies",
            attributes: {},
            through: {
              attributes: [],
            },
          };

          q.include.push(assoc);
        }

        const user = await db.User.findByPk(req.params.id, q);
        if (user === null) {
          return res.status(404).json({ error: "Not Found" });
        }
        res.json({ user: user });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.post(
    "/",
    auth.requireLoggedIn,
    auth.requireRoleIn(CREATE_USER_ROLES),
    async function (req, res, next) {
      try {
        if (!req.body || !req.body.firstName) {
          return res.status(400).json({ error: "firstName is required" });
        }

        if (!req.body || !req.body.lastName) {
          return res.status(400).json({ error: "lastName is required" });
        }

        if (!req.body || !req.body.email) {
          return res.status(400).json({ error: "email is required" });
        }

        if (!req.body || !req.body.password) {
          return res.status(400).json({ error: "password is required" });
        } else {
          if (typeof req.body.password !== "string") {
            return res.status(400).json({ error: "Password must be a string" });
          }

          if (req.body.password.length > PASSWORD_LIMIT) {
            return res.status(400).json({
              error: `Password length is limited to ${PASSWORD_LIMIT}`,
            });
          }
        }

        if (!req.body || !req.body.role) {
          return res.status(400).json({ error: "role is required" });
        }

        const role = await db.Role.findByPk(req.body.role);
        if (role === null) {
          return res.status(400).json({ error: "role does not exist" });
        }

        if (role.name.toLowerCase() === "admin") {
          if (!auth.hasRoleIn(["admin"], req.user)) {
            return res.status(403).json({
              error: "You cannot assign the admin role unless you are an admin",
            });
          }
        }

        let data = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          phone: req.body.phone ? req.body.phone : "",
          createdBy: req.user.id,
          salt: "",
        };

        let user = JSON.parse(JSON.stringify(await db.User.create(data)));

        //pg-mem doens't work with many-many
        if (process.env.NODE_ENV !== "test") {
          if (
            req.body.associatedCompanies &&
            Array.isArray(req.body.associatedCompanies)
          ) {
            for (let i = 0; i < req.body.associatedCompanies.length; i++) {
              let associatedData = {
                userId: user.id,
                companyId: req.body.associatedCompanies[i],
              };
              let companyExists = await db.Company.findByPk(
                associatedData.companyId
              );
              if (companyExists !== null) {
                await db.UserCompany.create(associatedData);
              }
            }
          }

          if (
            req.body.associatedProjects &&
            Array.isArray(req.body.associatedProjects)
          ) {
            for (let i = 0; i < req.body.associatedProjects.length; i++) {
              let associatedData = {
                userId: user.id,
                projectId: req.body.associatedProjects[i],
              };
              let projectExists = await db.Project.findByPk(
                associatedData.projectId
              );
              if (projectExists !== null) {
                await db.UserProject.create(associatedData);  
              }
            }
          }
        }

        delete user.password;
        delete user.salt;

        res.status(201).json({ user: user });
      } catch (e) {
        switch(true) {
        case e instanceof ValidationError:
          const scrubbedErrors = e.errors.reduce((acc, cur) => {
            const { password, salt, ...user } = cur.instance.dataValues;
            cur.instance.dataValues = user;  // excludes the password and salt from the ValidationErrorItem instance prop
            return [...acc, cur];
          }, []);
          res.status(400).json(scrubbedErrors);
          break;
        default:
          res.status(500).json(e.message);
        }
      }
    }
  );

  router.put(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_USER_ROLES),
    async function (req, res, next) {
      try {
        let data = {};

        if (typeof req.body.firstName !== "undefined") {
          data.firstName = req.body.firstName;
        }

        if (typeof req.body.lastName !== "undefined") {
          data.lastName = req.body.lastName;
        }

        if (typeof req.body.email !== "undefined") {
          data.email = req.body.email;
        }

        if (typeof req.body.role !== "undefined") {
          data.role = req.body.role;
        }

        if (typeof req.body.phone !== "undefined") {
          data.phone = req.body.phone;
        }

        if (typeof req.body.password !== "undefined") {
          //only allow password change by the user
          if (typeof req.body.password === "string") {
            if (req.body.password.length <= PASSWORD_LIMIT) {
              if (req.user && req.user.id === req.params.id) {
                data.password = req.body.password;
              } else {
                return res.status(400).json({
                  error: `You are not allowed to update another users password`,
                });
              }
            } else {
              return res.status(400).json({
                error: `Password length is limited to ${PASSWORD_LIMIT}`,
              });
            }
          } else {
            return res.status(400).json({ error: "Password must be a string" });
          }
        }

        const user = await db.User.update(data, {
          where: { id: req.params.id },
          attributes: { exclude: ["password", "salt"] },
          returning: true,
        });

        //pg-mem doens't work with many-many
        if (process.env.NODE_ENV !== "test") {
          if (
            req.body.associatedCompanies &&
            Array.isArray(req.body.associatedCompanies)
          ) {
            for (let i = 0; i < req.body.associatedCompanies.length; i++) {
              let associatedData = {
                userId: req.params.id,
                companyId: req.body.associatedCompanies[i],
              };
              let companyExists = await db.Company.findByPk(
                associatedData.companyId
              );
              if (companyExists !== null) {
                await db.UserCompany.create(associatedData);
              }
            }
          }
        }

        if (typeof user[1] === "undefined") {
          const origUser = await db.User.findOne(
            { where: { id: req.params.id } },
            { attributes: { exclude: ["password", "salt"] } }
          );
          if (origUser === null) {
            res.status(404).json({ error: "Not Found" });
          }
          return res.status(200).json({ user: origUser });
        }

        res.status(200).json({ user: user[1][0] });
      } catch (e) {
        switch(true) {
        case e instanceof ValidationError:
          res.status(400).json(e.errors);
          break;
        default:
          res.status(500).json(e.message);
        }
      }
    }
  );

  router.put(
    "/:id/activate",
    auth.requireLoggedIn,
    auth.requireRoleIn(EDIT_USER_ROLES),
    async function (req, res, next) {
      let data = { archived: false };

      const user = await db.User.update(data, {
        where: { id: req.params.id },
        returning: true,
      });

      res.status(200).json({ user: user[1][0] });
    }
  );

  router.delete(
    "/:id",
    auth.requireLoggedIn,
    auth.requireRoleIn(DELETE_USER_ROLES),
    async function (req, res, next) {
      try {
        let data = { archived: true };

        const user = await db.User.update(data, {
          where: { id: req.params.id },
          returning: true,
        });

        res.status(200).json({ user: user[1][0] });
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
