const DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
  const MARKETING_TYPE = "marketing";
  const ARCHITECTURE_TYPE = "architecture";
  const CUSTOMER_TYPE = "customer";
  let document = sequelize.define("document", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    originalFilename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    docType: {
      //type: DataTypes.ENUM(MARKETING_TYPE, ARCHITECTURE_TYPE)
      type: DataTypes.STRING,
      isIn: [[MARKETING_TYPE, ARCHITECTURE_TYPE, CUSTOMER_TYPE]],
    },
    docName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storageLocation: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    types: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    industryVertical: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: [],
    },
    useCase: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: [],
    },
    partners: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    hub: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    otherTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    projectId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fileSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  document.MARKETING_TYPE = MARKETING_TYPE;
  document.ARCHITECTURE_TYPE = ARCHITECTURE_TYPE;
  document.CUSTOMER_TYPE = CUSTOMER_TYPE;

  return document;
};
