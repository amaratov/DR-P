const newDb = require("pg-mem").newDb;
const DATABASE = newDb();
const util = require('./util');

const db = require('../db/db');
const crypto = require('crypto');
const uuidv4 = require('uuid').v4;

const setSaltAndPassword = function(user){
    user.salt = generateSalt()
    user.password = encryptPassword(user.password, user.salt)
    return user;
}

var previoslyInited = false;
var ADMIN_ROLE = null;
var CUST_ROLE = null;
var SALES_ROLE = null;
var SA_ROLE = null;
var SE_ROLE = null;
var MARK_ROLE = null;
var ADMIN_ID = null;

const generateSalt = function() {
    return crypto.randomBytes(16).toString('base64')
}
const encryptPassword = function(plainText, salt) {
    return crypto
        .createHash('RSA-SHA256')
        .update(plainText)
        .update(salt)
        .digest('hex')
}

init = async function(){
    if (!previoslyInited){
        await db.init(DATABASE);
        
        await db.Role.sync({alter: true});
        await db.User.sync({alter: true});
        await db.UseCase.sync({alter: true});
        await db.IndustryVertical.sync({alter: true});
        
        await db.Company.sync({alter: true});
        await db.UserCompany.sync({alter: true});
        await db.Project.sync({alter: true});
        await db.UserProject.sync({alter: true});

        //await db.Icon.sync({alter: true});
        await db.Document.sync({alter: true});

        const Create = function(table){
            return async function(data){
                data.createdAt = new Date();
                data.updatedAt = new Date();
                data.id = uuidv4();
                return await DATABASE.getTable(table).insert(data);
            }
        }

        let data = {
            name: 'admin',
            archived: false
        }

        db.Role.Create = Create('roles');
        db.User.Create = Create('users');
        db.Company.Create = Create('companies');

        let role = await db.Role.Create(data);
        ADMIN_ROLE = role.id;

        data.name = 'customer';
        role = await db.Role.Create(data);
        CUST_ROLE = role.id;

        data.name = 'sales';
        role = await db.Role.Create(data);
        SALES_ROLE = role.id;

        data.name = 'solutions architect';
        role = await db.Role.Create(data);
        SA_ROLE = role.id;

        data.name = 'solutions engineer';
        role = await db.Role.Create(data);
        SE_ROLE = role.id;

        data.name = 'marketing';
        role = await db.Role.Create(data);
        MARK_ROLE = role.id;

        let userData = {
            role: ADMIN_ROLE,
            password: util.ADMIN_USER,
            firstName: util.ADMIN_USER,
            lastName: util.ADMIN_USER,
            phone: "1-555-555-5555",
            email: util.ADMIN_USER+"@fakeEmail.test"
        }
        userData = setSaltAndPassword(userData)
        
        let adminU = await db.User.Create(userData);
        ADMIN_ID = adminU.id;
        
        userData = {
            role: CUST_ROLE,
            password: util.CUSTOMER_USER,
            firstName: util.CUSTOMER_USER,
            lastName: util.CUSTOMER_USER,
            phone: "1-555-555-5555",
            email: util.CUSTOMER_USER+"@fakeEmail.test"
        }
        userData = setSaltAndPassword(userData)
        await db.User.Create(userData);

        userData = {
            role: SALES_ROLE,
            password: util.SALES_USER,
            firstName: util.SALES_USER,
            lastName: util.SALES_USER,
            phone: "1-555-555-5555",
            email: util.SALES_USER+"@fakeEmail.test"
        }
        userData = setSaltAndPassword(userData)
        await db.User.Create(userData);

        userData = {
            role: SA_ROLE,
            password: util.SA_USER,
            firstName: util.SA_USER,
            lastName: util.SA_USER,
            phone: "1-555-555-5555",
            email: util.SA_USER+"@fakeEmail.test"
        }
        userData = setSaltAndPassword(userData)
        await db.User.Create(userData);

        userData = {
            role: SE_ROLE,
            password: util.SE_USER,
            firstName: util.SE_USER,
            lastName: util.SE_USER,
            phone: "1-555-555-5555",
            email: util.SE_USER+"@fakeEmail.test"
        }
        userData = setSaltAndPassword(userData)
        await db.User.Create(userData);

        userData = {
            role: MARK_ROLE,
            password: util.MARKETING_USER,
            firstName: util.MARKETING_USER,
            lastName: util.MARKETING_USER,
            phone: "1-555-555-5555",
            email: util.MARKETING_USER+"@fakeEmail.test"
        }
        userData = setSaltAndPassword(userData)
        await db.User.Create(userData);
    }
    previoslyInited = true;

    let rv = {
        ADMIN_ROLE: ADMIN_ROLE,
        CUSTOMER_ROLE: CUST_ROLE,
        SALES_ROLE: SALES_ROLE,
        SA_ROLE: SA_ROLE,
        SE_ROLE: SE_ROLE,
        MARKETING_ROLE: MARK_ROLE,
        ADMIN_ID: ADMIN_ID,
    }

    return rv;
}




module.exports = {
    db: db,
    init: init
};