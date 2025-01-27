const config = require("config");

const chai = require("chai");
let server = null;
chai.use(require("chai-http"));
chai.use(require("chai-sorted"));
const expect = chai.expect;
const should = chai.should();
let agent = null;
let ROLES = null;
let COMPANY_ID = null;
let companyData = {};

const util = require("../util");
const user = require("../../db/models/user");

const basePath = "/api/v1/company/";

describe("Company Routes", function () {
  before(async () => {
    const dbHandler = require("../db-handler");
    ROLES = await dbHandler.init();
    server = require("../../app");
    agent = chai.request.agent(server);
  });

  describe("POST /", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.post(`${basePath}`);
      res.should.have.status(401);
    });

    it("should get a validation error (name)", async function () {
      await util.login(agent);
      let res = await agent.post(`${basePath}`);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("name is required");
    });

    it("should make a company", async function () {
      companyData.name = "Fake Company";
      let res = await agent.post(`${basePath}`).send(companyData);
      res.should.have.status(201);
      res.should.have.property("body");
      res.body.should.have.property("company");
      res.body.company.should.have.property("id");
      let keys = Object.keys(companyData);
      for (let i = 0; i < keys.length; i++) {
        res.body.company.should.have.property(keys[i]);
        res.body.company[keys[i]].should.equal(companyData[keys[i]]);
      }
      companyData = JSON.parse(JSON.stringify(res.body.company));
    });

    it("should get the new company", async function () {
      let res = await agent.get(`${basePath}${companyData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("company");
      res.body.company.should.have.property("id");
      res.body.company.id.should.equal(companyData.id);
      res.body.company.should.have.property("name");
      res.body.company.name.should.equal(companyData.name);
      res.body.company.should.have.property("archived");
      res.body.company.archived.should.equal(companyData.archived);
      res.body.company.should.have.property("createdBy");
      res.body.company.createdBy.should.equal(companyData.createdBy);
    });

    it("SA Role should 201", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.post(`${basePath}`).send(companyData);

      res.should.have.status(201);
    });

    it("Sales Role should 201", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.post(`${basePath}`).send(companyData);

      res.should.have.status(201);
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.post(`${basePath}`).send(companyData);

      res.should.have.status(404);
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.post(`${basePath}`).send(companyData);

      res.should.have.status(404);
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.post(`${basePath}`).send(companyData);

      res.should.have.status(404);
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
      await util.logout(agent);
    });
  });

  describe("GET /", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.get(basePath);
      res.should.have.status(401);
    });

    it("should get a list of all(3) companies", async function () {
      await util.login(agent);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
      res.body.companies.should.have.property(0);
      res.body.companies[0].should.not.have.property("password");
      res.body.companies[0].should.not.have.property("salt");
      res.body.companies[0].should.have.property("id");
      COMPANY_ID = res.body.companies[0].id;
      res.body.companies.length.should.equal(3);
    });

    it("should search for a list of 3 companies matching name=%ake%", async function () {
      let res = await agent.get(basePath + "?name=%ake%");

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
      res.body.companies.should.have.property(0);

      res.body.companies[0].should.have.property("name");
      res.body.companies[0].name.should.have.string("ake");
      res.body.companies.length.should.equal(3);
    });

    it("should have pages", async function () {
      let res = await agent.get(basePath + "?limit=1&page=1");

      res.should.have.status(200);
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
      res.body.companies.length.should.equal(2);
      res.body.companies.should.have.property(0);
      res.body.should.have.property("numPages");
      res.body.numPages.should.equal(3);
    });

    it("should be ordered by name DESC", async function () {
      let res = await agent.get(basePath + '?order=[["name", "DESC"]]');

      res.should.have.status(200);
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
      res.body.companies.length.should.equal(3);
      res.body.companies.should.have.property(0);
      res.body.companies.should.be.sortedBy("name", { descending: true });
    });

    it("should be ordered by name ASC", async function () {
      let res = await agent.get(basePath + '?order=[["name", "ASC"]]');

      res.should.have.status(200);
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
      res.body.companies.length.should.equal(3);
      res.body.companies.should.have.property(0);
      res.body.companies.should.be.sortedBy("name");
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.get(basePath);

      res.should.have.status(404);
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 200", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
    });

    it("SE Role should 200", async function () {
      await util.login(agent, util.SE_USER);
      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("companies");
    });

    it("should get a 500", async function () {
      await util.login(agent);
      let res = await agent.get(basePath + "?order=[['lastName', \"ASC\"]]");

      res.should.have.status(500);
      res.body.should.have.property("error");

      await util.logout(agent);
    });
  });

  describe("GET /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.get(`${basePath}${COMPANY_ID}`);
      res.should.have.status(401);
    });

    it("should get a company", async function () {
      await util.login(agent);
      let res = await agent.get(`${basePath}${COMPANY_ID}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("company");
      res.body.company.should.have.property("id");
      res.body.company.id.should.equal(COMPANY_ID);
    });

    it("should get no company", async function () {
      const uuidv4 = require("uuid").v4;
      const fakeID = uuidv4();
      let res = await agent.get(`${basePath}${fakeID}`);
      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.get(`${basePath}${COMPANY_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("company");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(`${basePath}${COMPANY_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("company");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.get(`${basePath}${COMPANY_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.get(`${basePath}${COMPANY_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 200", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.get(`${basePath}${COMPANY_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("company");

      await util.login(agent);
    });

    it("should get a 500", async function () {
      let res = await agent.get(`${basePath}1d`);
      res.should.have.status(500);
      res.should.have.property("body");
      res.body.should.have.property("error");
      await util.logout(agent);
    });
  });

  describe("PUT /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.put(`${basePath}${companyData.id}`);
      res.should.have.status(401);
    });

    it("should get a 200 changing nothing", async function () {
      await util.login(agent);
      let res = await agent.put(`${basePath}${companyData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("company");
    });

    it("should update a company", async function () {
      companyData.name += "E";
      let res = await agent
        .put(`${basePath}${companyData.id}`)
        .send(companyData);

      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("company");
      res.body.company.should.have.property("id");
      res.body.company.id.should.equal(companyData.id);
      res.body.company.should.have.property("name");
      res.body.company.name.should.equal(companyData.name);
    });

    it("should get the updated company", async function () {
      let res = await agent.get(`${basePath}${companyData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("company");
      res.body.company.should.have.property("id");
      res.body.company.id.should.equal(companyData.id);
      res.body.company.should.have.property("name");
      res.body.company.name.should.equal(companyData.name);
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.put(`${basePath}${COMPANY_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("company");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.put(`${basePath}${COMPANY_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("company");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.put(`${basePath}${COMPANY_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.put(`${basePath}${COMPANY_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.put(`${basePath}${COMPANY_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.logout(agent);
    });
  });

  describe("DELETE /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.put(`${basePath}${companyData.id}`);
      res.should.have.status(401);
    });

    it("should get a 500 changing nothing", async function () {
      await util.login(agent);
      let res = await agent.delete(`${basePath}1d`);
      res.should.have.status(500);
      res.should.have.property("body");
      res.body.should.have.property("error");
    });

    it("should delete (archive) a company", async function () {
      let res = await agent.delete(`${basePath}${companyData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("company");
    });

    it("should get the deleted (archived) company", async function () {
      let res = await agent.get(`${basePath}${companyData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("company");
      res.body.company.should.have.property("id");
      res.body.company.should.have.property("archived");
      res.body.company.archived.should.equal(true);
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.delete(`${basePath}${companyData.id}`);

      res.should.have.status(200);
      res.body.should.have.property("company");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.delete(`${basePath}${companyData.id}`);

      res.should.have.status(200);
      res.body.should.have.property("company");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.delete(`${basePath}${companyData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.delete(`${basePath}${companyData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.delete(`${basePath}${companyData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.logout(agent);
    });
  });

  // describe('GET /my', async function () {
  //     it('should get unauthorized', async function(){
  //         let res = await agent
  //             .put(`${basePath}my`);
  //         res.should.have.status(401);
  //     });

  //     it('should get current user companies', async function(){
  //         await util.login(agent);
  //         let res = await agent
  //         .get(`${basePath}my`);
  //         res.should.have.status(200);
  //         res.should.have.property('body');
  //         res.body.should.have.property('companies');
  //     });

  //     it('SA Role should 200', async function(){
  //         await util.login(agent, util.SA_USER);

  //         let res = await agent
  //             .get(`${basePath}my`);

  //         res.should.have.status(200);
  //         res.body.should.have.property('companies');

  //     });

  //     it('Sales Role should 200', async function(){
  //         await util.login(agent, util.SALES_USER);

  //         let res = await agent
  //             .get(`${basePath}my`);

  //         res.should.have.status(200);
  //         res.body.should.have.property('companies');

  //     });

  //     it('Customer Role should 200', async function(){
  //         await util.login(agent, util.CUSTOMER_USER);

  //         let res = await agent
  //             .get(`${basePath}my`);

  //         res.should.have.status(200);
  //         res.body.should.have.property('companies');
  //     });

  //     it('Marketing Role should 200', async function(){
  //         await util.login(agent, util.MARKETING_USER);

  //         let res = await agent
  //             .get(`${basePath}my`);

  //         res.should.have.status(200);
  //         res.body.should.have.property('companies');
  //     });

  //     it('SE Role should 200', async function(){
  //         await util.login(agent, util.SE_USER);

  //         let res = await agent
  //             .get(`${basePath}my`);

  //         res.should.have.status(200);
  //         res.body.should.have.property('companies');

  //         await util.logout(agent);
  //     });
  // });
});
