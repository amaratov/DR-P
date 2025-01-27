
const config = require('config');

const chai = require('chai');
let server = null;
chai.use(require('chai-http'));
chai.use(require("chai-sorted"));
const expect = chai.expect;
const should = chai.should();
let agent = null;
let industryVerticalData = {};
let industryVerticalDataMarketing = {};

const util = require('../util');

const basePath = "/api/v1/industry_vertical/"

describe("Industry Vertical Routes", function() {
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
                .send(industryVerticalData);
            
            res.should.have.status(500);
        });

        it('make a new industryVertical', async function(){
            industryVerticalData.name = "testUseCase"
            await util.login(agent);

            
            let res = await agent
                .post(basePath)
                .send(industryVerticalData);
            
            res.should.have.status(201);
            res.body.should.have.property('industryvertical');
            res.body.industryvertical.should.have.property('name');
            res.body.industryvertical.name.should.equal(industryVerticalData.name)
            res.body.industryvertical.should.have.property('id');
            industryVerticalData.id = res.body.industryvertical.id;
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .post(basePath)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .post(basePath)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .post(basePath)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 201', async function(){
            industryVerticalDataMarketing.name = "testIndustryVerticalMarketing"
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .post(basePath)
                .send(industryVerticalDataMarketing);
            
            res.should.have.status(201);
            res.body.should.have.property('industryvertical');
            res.body.industryvertical.should.have.property('name');
            res.body.industryvertical.name.should.equal(industryVerticalDataMarketing.name)
            res.body.industryvertical.should.have.property('id');
            industryVerticalData.id = res.body.industryvertical.id;
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .post(basePath)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')

            await util.logout(agent);
        });
    });

    describe('PUT /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .put(basePath+industryVerticalData.id);
            res.should.have.status(401);
        });

        it('get a 200 making no changes', async function(){
            await util.login(agent);
            
            let res = await agent
                .put(basePath+industryVerticalData.id)
            
            res.should.have.status(200);
            res.body.should.have.property('industryvertical');
        });

        it('edit industryVertical name', async function(){
            industryVerticalData.name += "E"
            
            let res = await agent
                .put(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(200);
            res.body.should.have.property('industryvertical');
            res.body.industryvertical.should.have.property('name');
            res.body.industryvertical.name.should.equal(industryVerticalData.name)
            res.body.industryvertical.should.have.property('id');
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .put(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .put(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .put(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .put(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(200);
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .put(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')

            await util.logout(agent);
        });
    });

    describe('DELETE /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .delete(basePath+industryVerticalData.id);
            res.should.have.status(401);
        });

        it('delete the industryVertical (setting archived true)', async function(){
            await util.login(agent);
            let res = await agent
                .delete(basePath+industryVerticalData.id)
            
            res.should.have.status(200);
            res.body.should.have.property('industryvertical');
            res.body.industryvertical.should.have.property('name');
            res.body.industryvertical.name.should.equal(industryVerticalData.name)
            res.body.industryvertical.should.have.property('archived');
            res.body.industryvertical.archived.should.equal(true)
            res.body.industryvertical.should.have.property('id');
            
        });

        
        it('SA Role should 404', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .delete(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Sales Role should 404', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .delete(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Customer Role should 404', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .delete(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(404);
            res.body.should.have.property('error');
            res.body.error.should.equal('Not Found')
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .delete(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
            res.should.have.status(200);
        });

        it('SE Role should 404', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .delete(basePath+industryVerticalData.id)
                .send(industryVerticalData);
            
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
            res.body.should.have.property('industryverticals');
            res.body.industryverticals.should.have.property(0);
            res.body.industryverticals[0].should.have.property('id');
            res.body.industryverticals.length.should.equal(2)
            
        });

        
        it('SA Role should 200', async function(){
            await util.login(agent, util.SA_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('industryverticals');

        });

        it('Sales Role should 200', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('industryverticals');

        });

        it('Customer Role should 200', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('industryverticals');
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('industryverticals');
        });

        it('SE Role should 200', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .get(basePath)
            
            res.should.have.status(200);
            res.body.should.have.property('total');
            res.body.total.should.equal(2)
            res.body.should.have.property('industryverticals');

            await util.logout(agent);
        });
    });

    describe('GET /:id', async function () {
        it('should get unauthorized', async function(){
            let res = await agent
                .get(`${basePath}${ADMIN_ROLE}`);
            res.should.have.status(401);
        });

        it('should get a industryVertical', async function(){
            await util.login(agent);
            let res = await agent
                .get(`${basePath}${industryVerticalData.id}`);
            res.should.have.status(200);
            res.should.have.property('body');
            res.body.should.have.property('industryvertical');
            res.body.industryvertical.should.have.property('id')
            res.body.industryvertical.id.should.equal(industryVerticalData.id);
        });

        it('should get no industryVertical', async function(){
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
                .get(`${basePath}${industryVerticalData.id}`);
            
            res.should.have.status(200);
            res.body.should.have.property('industryvertical');

        });

        it('Sales Role should 200', async function(){
            await util.login(agent, util.SALES_USER);
            
            let res = await agent
                .get(`${basePath}${industryVerticalData.id}`);
            
            res.should.have.status(200);
            res.body.should.have.property('industryvertical');

        });

        it('Customer Role should 200', async function(){
            await util.login(agent, util.CUSTOMER_USER);
            
            let res = await agent
                .get(`${basePath}${industryVerticalData.id}`);
        
            res.should.have.status(200);
            res.body.should.have.property('industryvertical');
        });

        it('Marketing Role should 200', async function(){
            await util.login(agent, util.MARKETING_USER);
            
            let res = await agent
                .get(`${basePath}${industryVerticalData.id}`);
            
            res.should.have.status(200);
            res.body.should.have.property('industryvertical');
        });

        it('SE Role should 200', async function(){
            await util.login(agent, util.SE_USER);
            
            let res = await agent
                .get(`${basePath}${industryVerticalData.id}`);
            
            res.should.have.status(200);
            res.body.should.have.property('industryvertical');

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