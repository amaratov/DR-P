const Model = require('sequelize').Model;
const DataTypes = require('sequelize').DataTypes;
const crypto = require('crypto')

module.exports = function(sequelize){
    let user = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV4
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: 'Please enter valid email address'
                }
            },
            allowNull: false,
            unique: {
                msg: 'Email is already in use'
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            validate: {
                is: /(^$)|^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.UUID,
            //DataTypes.ARRAY(DataTypes.UUID)?
            allowNull: false
        },
        // picture: {
        //     type: DataTypes.STRING,
        // },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        resetCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetExpiry: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true
        }
    }, {
        hooks: {
            beforeValidate: (record, options) => {
                // even though the unique constraint will catch character casing, this
                // helps with just re-using the existing error message for unique emails
                // on the frontend
                record.dataValues.email = record.dataValues.email?.toString()?.toLowerCase();
            }
        },
        indexes: [
            { 
                unique: true,
                name: 'unique_name',
                fields: [sequelize.fn('lower', sequelize.col('email'))]
            }
        ]
    });

    user.prototype.generateSalt = function() {
        return crypto.randomBytes(16).toString('base64')
    }
    user.prototype.encryptPassword = function(plainText, salt) {
        return crypto
            .createHash('RSA-SHA256')
            .update(plainText)
            .update(salt)
            .digest('hex')
    }

    const setSaltAndPassword = function(user){
        if ( (user.changed('password')) && (user.salt === null) || (user.salt === '') ) {
            user.salt = user.generateSalt()
            user.password = user.encryptPassword(user.password, user.salt)
        }
    }
    user.beforeValidate(setSaltAndPassword)

    user.prototype.correctPassword = function(enteredPassword) {
        return this.encryptPassword(enteredPassword, this.salt) === this.password
    }
    

    return user;
}