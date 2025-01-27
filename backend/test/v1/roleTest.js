
const config = require('config');

const chai = require('chai');
let server = null;
chai.use(require('chai-http'));
chai.use(require("chai-sorted"));
const expect = chai.expect;
const should = chai.should();
let agent = null;
let ROLES = null;
let ADMIN_ID = null;
let roleData = {};

const util = require('../util');
const user = require('../../db/models/user');

const basePath = "/api/v1/role/"

describe("Role Routes", function() {
    before(async () => {
        server = require('../../app');
        agent = chai.request.agent(server);
    });

    describe('GET /', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .get(basePath);
            res.should.have.status(401);
        });

        it('should get a list of all(6) roles', async function(){
            
            await util.login(agent);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(6)
            res.body.should.have.property('roles');
            res.body.roles.should.have.property(0);
            res.body.roles[0].should.have.property('id');
            res.body.roles.length.should.equal(6)
            ADMIN_ROLE = res.body.roles[0].id;
            
        });

        it('should have pages', async function(){
            
            let res = await agent
                .get(basePath+'?limit=1&page=1')
            
            res.should.have.status(200);
            res.body.total.should.equal(6)
            res.body.should.have.property('roles');
            res.body.roles.length.should.equal(1)
            res.body.roles.should.have.property(0);
            res.body.roles[0].should.have.property('id')
            res.body.roles[0].id.should.not.equal(ADMIN_ROLE)
            res.body.should.have.property('numPages');
            res.body.numPages.should.equal(6);
        });

        
        it('SA Role should 200', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(6)
            res.body.should.have.property('roles');

        });

        it('Sales Role should 200', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(6)
            res.body.should.have.property('roles');

        });

        it('Customer Role should 200', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(6)
            res.body.should.have.property('roles');
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(6)
            res.body.should.have.property('roles');
        });

        it('SE Role should 200', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(6)
            res.body.should.have.property('roles');

            await util.logout(agent);
        });
    });

    describe('GET /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
            res.should.have.status(401);
        });

        it('should get a role', async function(){
            await util.login(agent);
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
            res.should.have.status(200);
            res.should.have.property('body');
            res.body.should.have.property('role');
            res.body.role.should.have.property('id')
            res.body.role.id.should.equal(ADMIN_ROLE);
        });

        it('should get no role', async function(){
            const uuidv4 = require('uuid').v4;
            const fakeID = uuidv4();
            let res = await agent
                .get(`${basePath}${fakeID}`);
            res.should.have.status(404);
            res.should.have.property('body');
            res.body.should.have.property('error');
            res.body.error.should.equal("Not Found")
        });

        it('SA Role should 200', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
            
            res.should.have.status(200);
            res.body.should.have.property('role');

        });

        it('Sales Role should 200', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
            
            res.should.have.status(200);
            res.body.should.have.property('role');

        });

        it('Customer Role should 200', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
        
            res.should.have.status(200);
            res.body.should.have.property('role');
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
            
            res.should.have.status(200);
            res.body.should.have.property('role');
        });

        it('SE Role should 200', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
            
            res.should.have.status(200);
            res.body.should.have.property('role');

            await util.login(agent);
        });

        it('should get a 500', async function(){
            let res = await agent
                .get(`${basePath}1d`);
            res.should.have.status(500);
            res.should.have.property('body');
            res.body.should.have.property('error');
            await util.logout(agent);
        });

    });

    describe('POST /', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .post(basePath);
            res.should.have.status(401);
        });

        it('get a validation error (name)', async function(){
            await util.login(agent);
            
            let res = await agent
                .post(basePath)
                .send(roleData);
            
            res.should.have.status(500);
        });

        it('make a new role', async function(){
            roleData.name = "testRole"
            await util.login(agent);

            
            let res = await agent
                .post(basePath)
                .send(roleData);
            
            res.should.have.status(201);
            res.body.should.have.property('role');
            res.body.role.should.have.property('name');
            res.body.role.name.should.equal(roleData.name)
            res.body.role.should.have.property('id');
            roleData.id = res.body.role.id;
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .post(basePath)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .post(basePath)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .post(basePath)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 201', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .post(basePath)
                .send(roleData);
            
            res.should.have.status(201);
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .post(basePath)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')

            await util.logout(agent);
        });
    });

    describe('PUT /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .put(basePath+roleData.id);
            res.should.have.status(401);
        });

        it('get a 200 making no changes', async function(){
            await util.login(agent);
            
            let res = await agent
                .put(basePath+roleData.id)
            
            res.should.have.status(200);
            res.body.should.have.property('role');
        });

        it('edit role name', async function(){
            roleData.name += "E"
            
            let res = await agent
                .put(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(200);
            res.body.should.have.property('role');
            res.body.role.should.have.property('name');
            res.body.role.name.should.equal(roleData.name)
            res.body.role.should.have.property('id');
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .put(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .put(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .put(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .put(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(200);
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .put(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')

            await util.logout(agent);
        });
    });

    describe('DELETE /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .delete(basePath+roleData.id);
            res.should.have.status(401);
        });

        it('delete the role (setting archived true)', async function(){
            await util.login(agent);
            let res = await agent
                .delete(basePath+roleData.id)
            
            res.should.have.status(200);
            res.body.should.have.property('role');
            res.body.role.should.have.property('name');
            res.body.role.name.should.equal(roleData.name)
            res.body.role.should.have.property('archived');
            res.body.role.archived.should.equal(true)
            res.body.role.should.have.property('id');
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .delete(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .delete(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .delete(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 404', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .delete(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(200);
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .delete(basePath+roleData.id)
                .send(roleData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')

            await util.logout(agent);
        });
    });
});