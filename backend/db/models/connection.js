const { bindComplete } = require("pg-protocol/dist/messages");

const Model = require("sequelize").Model;
const DataTypes = require("sequelize").DataTypes;

const CUSTOMER_TYPE = "customer";
const DATACENTER_TYPE = "datacenter";
const REGIONAL_ONRAMP_TYPE = "regionalonramp";
const GLOBAL_ONRAMP_TYPE = "globalonramp";
const TYPE_ARR = [
  CUSTOMER_TYPE,
  DATACENTER_TYPE,
  REGIONAL_ONRAMP_TYPE,
  GLOBAL_ONRAMP_TYPE,
];

module.exports = function (sequelize) {
  let connection = sequelize.define("connection", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    origins: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      //relates to project detail id
    },
    originTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        eachElementIsType: function (value) {
          if (!value) return value;

          var values = Array.isArray(value) ? value : [value];

          values.forEach(function (val) {
            if (TYPE_ARR.indexOf(val) === -1) {
              throw new Error(
                `Each origin type must be one of ${TYPE_ARR.join(", ")}`
              );
            }
          });
          return value;
        },
      },
    },
    endpoint: {
      type: DataTypes.UUID,
      allowNull: true, // allow null as the connection could link to an onRamp endpoint
      //relates to project detail id
    },
    endpointType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [TYPE_ARR],
      },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    onRampOrigins: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
      //relates to onramp names
    },
    onRampEndpoint: {
      type: DataTypes.JSON,
      allowNull: true,
      //relates to onramp names
    },
  });

  return connection;
};
