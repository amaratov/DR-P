const DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
  let region = sequelize.define("region", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentRegionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['name', 'parentRegionId'],
      },
    ],
  });

  return region;
}