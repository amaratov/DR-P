//https://propane.atlassian.net/wiki/spaces/DR/pages/1782448172/Roles+and+permissions

const Model = require('sequelize').Model;
const DataTypes = require('sequelize').DataTypes;

module.exports = function(sequelize){
    let role = sequelize.define('role', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return role;
}