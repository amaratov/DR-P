const DataTypes = require('sequelize').DataTypes;

module.exports = function(sequelize){
    let project = sequelize.define('use_case', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },

        createdBy: {
            type: DataTypes.UUID,
            allowNull: true
        },

        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        
    });

    return project;
}