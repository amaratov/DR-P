const DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
  let projectBriefcase = sequelize.define("projectBriefcase", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // id, addedBy, dateAdded
    associatedMarketing: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
    },
    publishedMarketing: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
    },
    associatedDocument: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
    },
    publishedDocument: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
    },
    lastPublishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastPublishedBy: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return projectBriefcase;
};
