const { bindComplete } = require("pg-protocol/dist/messages");

const Model = require("sequelize").Model;
const DataTypes = require("sequelize").DataTypes;

const REGION_TYPE = "regions";
const COMPLIANCE_TYPE = "compliances";
const DATACENTER_TYPE = "datacenters";
const CLOUD_TYPE = "clouds";
const APPLICATION_TYPE = "applications";
const PARTNERSUPPLIER_TYPE = "partnersuppliers";
const CUSTOMER_LOCATION_TYPE = "customerlocations";
const NOTE_TYPE = "notes";
const MODEL_TYPE = "model";

const TYPES = [
  REGION_TYPE,
  COMPLIANCE_TYPE,
  DATACENTER_TYPE,
  CLOUD_TYPE,
  APPLICATION_TYPE,
  PARTNERSUPPLIER_TYPE,
  CUSTOMER_LOCATION_TYPE,
  NOTE_TYPE,
  MODEL_TYPE,
];

module.exports = function (sequelize) {
  let projectDetail = sequelize.define("projectDetail", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    projectNotes: {
      type: DataTypes.STRING(2000),
      defaultValue: "",
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: TYPES,
      allowNull: false,
      required: true,
    },
    named: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    extras: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
    },
    stateInfo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isFuture: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  projectDetail.REGION_TYPE = REGION_TYPE;
  projectDetail.COMPLIANCE_TYPE = COMPLIANCE_TYPE;
  projectDetail.DATACENTER_TYPE = DATACENTER_TYPE;
  projectDetail.CLOUD_TYPE = CLOUD_TYPE;
  projectDetail.APPLICATION_TYPE = APPLICATION_TYPE;
  projectDetail.PARTNERSUPPLIER_TYPE = PARTNERSUPPLIER_TYPE;
  projectDetail.CUSTOMER_LOCATION_TYPE = CUSTOMER_LOCATION_TYPE;
  projectDetail.NOTE_TYPE = NOTE_TYPE;
  projectDetail.MODEL_TYPE = MODEL_TYPE;

  projectDetail.TYPES = TYPES;

  return projectDetail;
};
