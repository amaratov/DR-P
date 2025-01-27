const DataTypes = require('sequelize').DataTypes;

module.exports = function(sequelize){
    let company = sequelize.define('company', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        industryVertical: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: []
        },
        salesforceId: {
            type: DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false,
            defaultValue: [],
            validate: {
                validObjects(value){
                    let validFieldNames = ['field', 'id']
                    let invalidKeyError = "Each salesforceId must only have field and id attributes";
                    if (value !== null){
                        for (let i=0; i<value.length; i++){
                            let k = Object.keys(value[i]);
                            if (k.length !== 2){
                                throw new Error(invalidKeyError)
                            }
                            if (validFieldNames.indexOf(k[0]) === -1){
                                throw new Error(invalidKeyError)
                            }
                            if (validFieldNames.indexOf(k[1]) === -1){
                                throw new Error(invalidKeyError)
                            }

                            //TODO: validate field values based after we learn what they can be

                        }
                    }
                }
            }
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        
    });

    return company;
}