//https://sequelize.org/docs/v6
var pg = require("pg");
const Sequelize = require("sequelize").Sequelize;
const config = require("config");
const e = require("express");

var db = {};
db.sequelize = null;

db.init = function (forcedConnection) {
  if (db.sequelize === null) {
    if (!forcedConnection) {
      if (!config.has("database")) {
        throw new Error("Database configuration is required but not provided");
      }
      const dbConf = config.get("database");

      if (!dbConf.user || !dbConf.password || !dbConf.host || !dbConf.dbname) {
        throw new Error(
          "Database configuration is required but not fully provided, need user, password, host and dbname"
        );
      }
      let connString = `postgres://${dbConf.user}:${dbConf.password}@${dbConf.host}/${dbConf.dbname}`;

      db.sequelize = new Sequelize(connString, {
        dialectModule: pg,
        logging: false,
      });
    } else {
      db.sequelize = new Sequelize({
        dialect: "postgres",
        dialectModule: forcedConnection.adapters.createPg(),
        logging: false,
      });
    }

    db.DBState = require("./models/dbState")(db.sequelize);
    db.User = require("./models/user")(db.sequelize);
    db.Role = require("./models/role")(db.sequelize);
    db.IndustryVertical = require("./models/industryVertical")(db.sequelize);
    db.UseCase = require("./models/useCase")(db.sequelize);
    db.Company = require("./models/company")(db.sequelize);
    db.UserCompany = require("./models/userCompany")(db.sequelize);
    db.Project = require("./models/project")(db.sequelize);
    db.UserProject = require("./models/userProject")(db.sequelize);

    db.Icon = require("./models/icon")(db.sequelize);
    db.Document = require("./models/documents")(db.sequelize);

    db.ProjectDetail = require("./models/projectDetail")(db.sequelize);
    db.ProjectBriefcase = require("./models/projectBriefcase")(db.sequelize);
    db.SolutionBriefcase = require("./models/solutionBriefcase")(db.sequelize);

    db.Compliance = require("./models/compliance")(db.sequelize);

    db.Region = require("./models/region")(db.sequelize);

    db.Connection = require("./models/connection")(db.sequelize);
    db.Tag = require("./models/tags")(db.sequelize);

    // db.Role.hasMany(db.User, {
    //     foreignKey: 'role',
    // });
    db.User.belongsTo(db.Role, {
      foreignKey: "role",
      as: "fullRole",
    });

    db.User.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.Company.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.IndustryVertical.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.UseCase.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.Icon.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.Document.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.ProjectBriefcase.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.SolutionBriefcase.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.Compliance.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.Region.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.Region.belongsTo(db.Region, {
      foreignKey: "parentRegionId",
      as: "parentRegion",
    });

    db.User.belongsToMany(db.Company, { through: db.UserCompany });
    db.Company.belongsToMany(db.User, {
      through: db.UserCompany,
      as: "associatedUsers",
    });
    db.Company.belongsToMany(db.User, { through: db.UserCompany, as: "users" });
    db.Company.hasMany(db.UserCompany);
    db.User.hasMany(db.UserCompany);

    db.User.belongsToMany(db.Project, { through: db.UserProject });
    db.Project.belongsToMany(db.User, {
      through: db.UserProject,
      as: "associatedUsers",
    });
    db.Project.belongsToMany(db.User, { through: db.UserProject, as: "users" });
    db.Project.hasMany(db.UserProject);
    db.User.hasMany(db.UserProject);

    db.Project.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });

    db.Project.belongsTo(db.Company, {
      foreignKey: "companyId",
      as: "company",
    });

    db.Company.hasMany(db.Project);

    db.Connection.belongsTo(db.User, {
      foreignKey: "createdBy",
      as: "fullCreatedBy",
    });
  }
  return db;
};

module.exports = db;
