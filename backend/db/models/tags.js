const Model = require("sequelize").Model;
const DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
  let tags = sequelize.define("tag", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return tags;
};
