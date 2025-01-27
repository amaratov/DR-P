const DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
  let solutionBriefcase = sequelize.define("solutionBriefcase", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    originalFilename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storageLocation: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    projectId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    publishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    publishedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // separate version code, major and minor for better searching
    briefcaseVersionCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    briefcaseMajorVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    briefcaseMinorVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    fileSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return solutionBriefcase;
};
