const DataTypes = require('sequelize').DataTypes;

module.exports = function(sequelize){
    let DBState = sequelize.define('db_state', {
        state: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return DBState;
}