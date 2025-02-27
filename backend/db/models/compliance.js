const DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
  let compliance = sequelize.define("compliance", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return compliance;
};
