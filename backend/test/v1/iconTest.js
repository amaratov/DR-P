
// const config = require('config');

// const chai = require('chai');
// let server = null;
// chai.use(require('chai-http'));
// chai.use(require("chai-sorted"));
// const expect = chai.expect;
// const should = chai.should();
// let agent = null;
// let iconData = {};
// let ICON_ID = null;

// const util = require('../util');
// const user = require('../../db/models/user');

// const basePath = "/api/v1/icon/"

// describe("Icon Routes", function() {
//     before(async () => {
//         const dbHandler = require('../db-handler');
//         await dbHandler.init();
//         server = require('../../app');
//         agent = chai.request.agent(server);
//     });

//     describe('POST /', async function () {
//         it('should get unauthorized', async function(){
//             let res = await agent
//                 .post(`${basePath}`);
//             res.should.have.status(401);
//         });

//         it('should get a validation error (iconName)', async function(){
//             await util.login(agent);
//             let res = await agent
//                 .post(`${basePath}`);
//             res.should.have.status(400);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('iconName is required')
//         });

//         it('should make an icon', async function(){
//             iconData.iconName = "FakeIcon"
//             let res = await agent
//                 .post(`${basePath}`)
//                 .send(iconData);
//             res.should.have.status(201);
//             res.should.have.property('body');
//             res.body.should.have.property('icon')
//             res.body.icon.should.have.property('id')
//             let keys = Object.keys(iconData);
//             for (let i=0; i<keys.length; i++){
//                 res.body.icon.should.have.property(keys[i]);
//                 res.body.icon[keys[i]].should.equal(iconData[keys[i]]);
//             }
//             iconData = JSON.parse(JSON.stringify(res.body.icon));
//         });

//         it('should get the new icon', async function(){
            
//             let res = await agent
//                 .get(`${basePath}${iconData.id}`)
//             res.should.have.status(200);
//             res.should.have.property('body');
//             res.body.should.have.property('icon')
//             res.body.icon.should.have.property('id')
//             res.body.icon.id.should.equal(iconData.id);
//             res.body.icon.should.have.property('iconName');
//             res.body.icon.iconName.should.equal(iconData.iconName);
//             res.body.icon.should.have.property('archived');
//             res.body.icon.archived.should.equal(iconData.archived);
//             res.body.icon.should.have.property('createdBy');
//             res.body.icon.createdBy.should.equal(iconData.createdBy);
//         });

//         it('SA Role should 201', async function(){
//             await util.login(agent, util.SA_USER);
//             let origName = iconData.iconName;
//             iconData.iconName = "new ICON name";
            
//             let res = await agent
//                 .post(`${basePath}`)
//                 .send(iconData);

//             iconData.iconName = origName;
            
//             res.should.have.status(201);
            
//         });

//         it('Sales Role should 404', async function(){
//             await util.login(agent, util.SALES_USER);
            
//             let res = await agent
//                 .post(`${basePath}`)
//                 .send(iconData);
            
//             res.should.have.status(404);
//             res.body.should.have.property("error")
//             res.body.error.should.equal("Not Found");
            
//         });

//         it('Customer Role should 404', async function(){
//             await util.login(agent, util.CUSTOMER_USER);
            
//             let res = await agent
//                 .post(`${basePath}`)
//                 .send(iconData);
            
//             res.should.have.status(404);
//             res.body.should.have.property("error")
//             res.body.error.should.equal("Not Found");
            
//         });

//         it('Marketing Role should 404', async function(){
//             await util.login(agent, util.MARKETING_USER);
            
//             let res = await agent
//                 .post(`${basePath}`)
//                 .send(iconData);
            
//             res.should.have.status(404);
//             res.body.should.have.property("error")
//             res.body.error.should.equal("Not Found");
            
//         });

//         it('SE Role should 404', async function(){
//             await util.login(agent, util.SE_USER);
            
//             let res = await agent
//                 .post(`${basePath}`)
//                 .send(iconData);
            
//             res.should.have.status(404);
//             res.body.should.have.property("error")
//             res.body.error.should.equal("Not Found");
//             await util.logout(agent); 
//         });
//     });

//     describe('GET /', async function () {
//         it('should get unauthorized', async function(){
//             let res = await agent
//                 .get(basePath);
//             res.should.have.status(401);
//         });

//         it('should get a list of all(2) icons', async function(){
            
//             await util.login(agent);
            
//             let res = await agent
//                 .get(basePath)
            
//             res.should.have.status(200);
//             res.body.should.have.property('total');
//             res.body.total.should.equal(2)
//             res.body.should.have.property('icons');
//             res.body.icons.should.have.property(0);
//             res.body.icons[0].should.have.property('id');
//             res.body.icons.length.should.equal(2)
//             ICON_ID = res.body.icons[0].id;
            
//         });

//         it('SA Role should 200', async function(){
//             await util.login(agent, util.SA_USER);
            
//             let res = await agent
//                 .get(basePath)
            
//             res.should.have.status(200);
//             res.body.should.have.property('total');
//             res.body.total.should.equal(2)
//             res.body.should.have.property('icons');

//         });

//         it('Sales Role should 404', async function(){
//             await util.login(agent, util.SALES_USER);
            
//             let res = await agent
//                 .get(basePath)
            
//             res.should.have.status(404);
//             res.body.should.have.property('error');
//             res.body.error.should.equal("Not Found")

//         });

//         it('Customer Role should 404', async function(){
//             await util.login(agent, util.CUSTOMER_USER);
            
//             let res = await agent
//                 .get(basePath)
            
//             res.should.have.status(404);
//             res.body.should.have.property('error');
//             res.body.error.should.equal("Not Found")

//         });

//         it('Marketing Role should 404', async function(){
//             await util.login(agent, util.MARKETING_USER);
            
//             let res = await agent
//                 .get(basePath)
            
//             res.should.have.status(404);
//             res.body.should.have.property('error');
//             res.body.error.should.equal("Not Found")

//         });

//         it('SE Role should 404', async function(){
//             await util.login(agent, util.SE_USER);
//             let res = await agent
//                 .get(basePath)
            
//             res.should.have.status(404);
//             res.body.should.have.property('error');
//             res.body.error.should.equal("Not Found")

//         });

//         it('should get a 500', async function(){
//             await util.login(agent);
//             let res = await agent
//                 .get(basePath+'?order=[[\'lastName\', "ASC"]]')
            
//             res.should.have.status(500);
//             res.body.should.have.property('error');

//             await util.logout(agent);
//         });
//     });

//     describe('GET /:id', async function () {
//         it('should get unauthorized', async function(){
//             let res = await agent
//                 .get(`${basePath}${ICON_ID}`);
//             res.should.have.status(401);
//         });

//         it('should get an icon', async function(){
//             await util.login(agent);
//             let res = await agent
//                 .get(`${basePath}${ICON_ID}`);
//             res.should.have.status(200);
//             res.should.have.property('body');
//             res.body.should.have.property('icon');
//             res.body.icon.should.have.property('id')
//             res.body.icon.id.should.equal(ICON_ID);
//         });

//         it('should get no icon', async function(){
//             const uuidv4 = require('uuid').v4;
//             const fakeID = uuidv4();
//             let res = await agent
//                 .get(`${basePath}${fakeID}`);
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal("Not Found")
//         });

//         it('SA Role should 200', async function(){
//             await util.login(agent, util.SA_USER);
            
//             let res = await agent
//                 .get(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(200);
//             res.body.should.have.property('icon');

//         });

//         it('Sales Role should 404', async function(){
//             await util.login(agent, util.SALES_USER);
            
//             let res = await agent
//                 .get(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');

//         });

//         it('Customer Role should 404', async function(){
//             await util.login(agent, util.CUSTOMER_USER);
            
//             let res = await agent
//                 .get(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');
//         });

//         it('Marketing Role should 404', async function(){
//             await util.login(agent, util.MARKETING_USER);
            
//             let res = await agent
//                 .get(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');
//         });

//         it('SE Role should 404', async function(){
//             await util.login(agent, util.SE_USER);
            
//             let res = await agent
//                 .get(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');

//             await util.login(agent);
//         });

//         it('should get a 500', async function(){
//             let res = await agent
//                 .get(`${basePath}1d`);
//             res.should.have.status(500);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             await util.logout(agent);
//         });

//     });

//     describe('PUT /:id', async function () {
//         it('should get unauthorized', async function(){
//             let res = await agent
//                 .put(`${basePath}${ICON_ID}`);
//             res.should.have.status(401);
//         });

//         it('should get a 200 changing nothing', async function(){
//             await util.login(agent);
//             let res = await agent
//             .put(`${basePath}${iconData.id}`);
//             res.should.have.status(200);
//             res.should.have.property('body');
//             res.body.should.have.property('icon');
//         });

//         it('should update an icon', async function(){
//             iconData.iconName += "E"
//             let res = await agent
//                 .put(`${basePath}${iconData.id}`)
//                 .send(iconData);
            
//             res.should.have.status(200);
//             res.should.have.property('body');
//             res.body.should.have.property('icon')
//             res.body.icon.should.have.property('id')
//             res.body.icon.id.should.equal(iconData.id);
//             res.body.icon.should.have.property('iconName')
//             res.body.icon.iconName.should.equal(iconData.iconName);
            
//         });

//         it('should get the updated icon', async function(){
            
//             let res = await agent
//                 .get(`${basePath}${iconData.id}`)
//             res.should.have.status(200);
//             res.should.have.property('body');
//             res.body.should.have.property('icon')
//             res.body.icon.should.have.property('id')
//             res.body.icon.id.should.equal(iconData.id);
//             res.body.icon.should.have.property('iconName')
//             res.body.icon.iconName.should.equal(iconData.iconName);
//         });

//         it('SA Role should 200', async function(){
//             await util.login(agent, util.SA_USER);
            
//             let res = await agent
//                 .put(`${basePath}${iconData.id}`);
            
//             res.should.have.status(200);
//             res.body.should.have.property('icon');

//         });

//         it('Sales Role should 404', async function(){
//             await util.login(agent, util.SALES_USER);
            
//             let res = await agent
//                 .put(`${basePath}${iconData.id}`);
        
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');

//         });

//         it('Customer Role should 404', async function(){
//             await util.login(agent, util.CUSTOMER_USER);
            
//             let res = await agent
//                 .put(`${basePath}${iconData.id}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');
//         });

//         it('Marketing Role should 404', async function(){
//             await util.login(agent, util.MARKETING_USER);
            
//             let res = await agent
//                 .put(`${basePath}${iconData.id}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');
//         });

//         it('SE Role should 404', async function(){
//             await util.login(agent, util.SE_USER);
            
//             let res = await agent
//                 .put(`${basePath}${iconData.id}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');

//             await util.logout(agent);
//         });
//     });

//     describe('DELETE /:id', async function () {
//         it('should get unauthorized', async function(){
//             let res = await agent
//                 .put(`${basePath}${ICON_ID}`);
//             res.should.have.status(401);
//         });

//         it('should get a 500 changing nothing', async function(){
//             await util.login(agent);
//             let res = await agent
//             .delete(`${basePath}1d`);
//             res.should.have.status(500);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//         });

//         it('should delete (archive) an icon', async function(){
//             let res = await agent
//             .delete(`${basePath}${ICON_ID}`);
//             res.should.have.status(200);
//             res.should.have.property('body');
//             res.body.should.have.property('icon');
//         });

//         it('should get the deleted (archived) icon', async function(){
//             let res = await agent
//                 .get(`${basePath}${ICON_ID}`)
//             res.should.have.status(200);
//             res.should.have.property('body');
//             res.body.should.have.property('icon')
//             res.body.icon.should.have.property('id')
//             res.body.icon.should.have.property('archived');
//             res.body.icon.archived.should.equal(true);
//         });

//         it('SA Role should 200', async function(){
//             await util.login(agent, util.SA_USER);
            
//             let res = await agent
//                 .delete(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(200);
//             res.body.should.have.property('icon');

//         });

//         it('Sales Role should 404', async function(){
//             await util.login(agent, util.SALES_USER);
            
//             let res = await agent
//                 .delete(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');

//         });

//         it('Customer Role should 404', async function(){
//             await util.login(agent, util.CUSTOMER_USER);
            
//             let res = await agent
//                 .delete(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');
//         });

//         it('Marketing Role should 404', async function(){
//             await util.login(agent, util.MARKETING_USER);
            
//             let res = await agent
//                 .delete(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');
//         });

//         it('SE Role should 404', async function(){
//             await util.login(agent, util.SE_USER);
            
//             let res = await agent
//                 .delete(`${basePath}${ICON_ID}`);
            
//             res.should.have.status(404);
//             res.should.have.property('body');
//             res.body.should.have.property('error');
//             res.body.error.should.equal('Not Found');

//             await util.logout(agent);
//         });
//     });
// });