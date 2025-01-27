
const config = require('config');

const chai = require('chai');
let server = null;
chai.use(require('chai-http'));
chai.use(require("chai-sorted"));
const expect = chai.expect;
const should = chai.should();
let agent = null;
let useCaseData = {};
let useCaseDataMarketing = {};

const util = require('../util');

const basePath = "/api/v1/use_case/"

describe("Use Case Routes", function() {
    before(async () => {
        server = require('../../app');
        agent = chai.request.agent(server);
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
                .send(useCaseData);
            
            res.should.have.status(500);
        });

        it('make a new useCase', async function(){
            useCaseData.name = "testUseCase"
            await util.login(agent);

            
            let res = await agent
                .post(basePath)
                .send(useCaseData);
            
            res.should.have.status(201);
            res.body.should.have.property('usecase');
            res.body.usecase.should.have.property('name');
            res.body.usecase.name.should.equal(useCaseData.name)
            res.body.usecase.should.have.property('id');
            useCaseData.id = res.body.usecase.id;
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .post(basePath)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .post(basePath)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .post(basePath)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 201', async function(){
            useCaseDataMarketing.name = "testUseCaseMarketing"
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .post(basePath)
                .send(useCaseDataMarketing);
            
            res.should.have.status(201);
            res.body.should.have.property('usecase');
            res.body.usecase.should.have.property('name');
            res.body.usecase.name.should.equal(useCaseDataMarketing.name)
            res.body.usecase.should.have.property('id');
            useCaseDataMarketing.id = res.body.usecase.id;
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .post(basePath)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')

            await util.logout(agent);
        });
    });

    describe('PUT /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .put(basePath+useCaseData.id);
            res.should.have.status(401);
        });

        it('get a 200 making no changes', async function(){
            await util.login(agent);
            
            let res = await agent
                .put(basePath+useCaseData.id)
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');
        });

        it('edit useCase name', async function(){
            useCaseData.name += "E"
            
            let res = await agent
                .put(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');
            res.body.usecase.should.have.property('name');
            res.body.usecase.name.should.equal(useCaseData.name)
            res.body.usecase.should.have.property('id');
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .put(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .put(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .put(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .put(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .put(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')

            await util.logout(agent);
        });
    });

    describe('DELETE /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .delete(basePath+useCaseData.id);
            res.should.have.status(401);
        });

        it('delete the useCase (setting archived true)', async function(){
            await util.login(agent);
            let res = await agent
                .delete(basePath+useCaseData.id)
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');
            res.body.usecase.should.have.property('name');
            res.body.usecase.name.should.equal(useCaseData.name)
            res.body.usecase.should.have.property('archived');
            res.body.usecase.archived.should.equal(true)
            res.body.usecase.should.have.property('id');
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .delete(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .delete(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .delete(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .delete(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .delete(basePath+useCaseData.id)
                .send(useCaseData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')

            await util.logout(agent);
        });
    });

    describe('GET /', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .get(basePath);
            res.should.have.status(401);
        });

        it('should get a list of all(2) use cases', async function(){
            
            await util.login(agent);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('usecases');
            res.body.usecases.should.have.property(0);
            res.body.usecases[0].should.have.property('id');
            res.body.usecases.length.should.equal(2)
            
        });

        
        it('SA Role should 200', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('usecases');

        });

        it('Sales Role should 200', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('usecases');

        });

        it('Customer Role should 200', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('usecases');
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('usecases');
        });

        it('SE Role should 200', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('usecases');

            await util.logout(agent);
        });
    });

    describe('GET /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
            res.should.have.status(401);
        });

        it('should get a useCase', async function(){
            await util.login(agent);
            let res = await agent
                .get(`${basePath}${useCaseData.id}`);
            res.should.have.status(200);
            res.should.have.property('body');
            res.body.should.have.property('usecase');
            res.body.usecase.should.have.property('id')
            res.body.usecase.id.should.equal(useCaseData.id);
        });

        it('should get no useCase', async function(){
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
                .get(`${basePath}${useCaseData.id}`);
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');

        });

        it('Sales Role should 200', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .get(`${basePath}${useCaseData.id}`);
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');

        });

        it('Customer Role should 200', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .get(`${basePath}${useCaseData.id}`);
        
            res.should.have.status(200);
            res.body.should.have.property('usecase');
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .get(`${basePath}${useCaseData.id}`);
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');
        });

        it('SE Role should 200', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .get(`${basePath}${useCaseData.id}`);
            
            res.should.have.status(200);
            res.body.should.have.property('usecase');

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
});