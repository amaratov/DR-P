const { bindComplete } = require("pg-protocol/dist/messages");

const Model = require("sequelize").Model;
const DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
  let project = sequelize.define("project", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    useCases: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: [],
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      model: "Companies",
      key: "id",
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.STRING(2000),
      defaultValue: "",
      allowNull: true,
    },
  });

  return project;
};
