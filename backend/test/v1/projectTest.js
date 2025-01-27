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
let PROJECT_ID = null;
let projectData = {};

const util = require("../util");
const user = require("../../db/models/user");

const basePath = "/api/v1/project/";

describe("Project Routes", function () {
  before(async () => {
    const dbHandler = require("../db-handler");
    ROLES = await dbHandler.init();
    let company = await dbHandler.db.Company.Create({
      name: "Project Test Company",
      createdBy: ROLES.ADMIN_ID,
    });
    COMPANY_ID = company.id;
    server = require("../../app");
    agent = chai.request.agent(server);
  });

  describe("POST /", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.post(`${basePath}`);
      res.should.have.status(401);
    });

    it("should get a validation error (title)", async function () {
      await util.login(agent);
      let res = await agent.post(`${basePath}`);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("title is required");
    });

    it("should get a validation error (companyId)", async function () {
      projectData.title = "Fake Project";
      await util.login(agent);
      let res = await agent.post(`${basePath}`).send(projectData);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("companyId is required");
    });

    it("should make a project", async function () {
      projectData.companyId = COMPANY_ID;
      let res = await agent.post(`${basePath}`).send(projectData);
      res.should.have.status(201);
      res.should.have.property("body");
      res.body.should.have.property("project");
      res.body.project.should.have.property("id");
      let keys = Object.keys(projectData);
      for (let i = 0; i < keys.length; i++) {
        res.body.project.should.have.property(keys[i]);
        res.body.project[keys[i]].should.equal(projectData[keys[i]]);
      }
      projectData = JSON.parse(JSON.stringify(res.body.project));
    });

    it("should get the new project", async function () {
      let res = await agent.get(`${basePath}${projectData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("project");
      res.body.project.should.have.property("id");
      res.body.project.id.should.equal(projectData.id);
      res.body.project.should.have.property("title");
      res.body.project.title.should.equal(projectData.title);
      res.body.project.should.have.property("archived");
      res.body.project.archived.should.equal(projectData.archived);
      res.body.project.should.have.property("createdBy");
      res.body.project.createdBy.should.equal(projectData.createdBy);
    });

    it("SA Role should 201", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.post(`${basePath}`).send(projectData);

      res.should.have.status(201);
    });

    it("Sales Role should 201", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.post(`${basePath}`).send(projectData);

      res.should.have.status(201);
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.post(`${basePath}`).send(projectData);

      res.should.have.status(404);
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.post(`${basePath}`).send(projectData);

      res.should.have.status(404);
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.post(`${basePath}`).send(projectData);

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

    it("should get a list of all(3) projects", async function () {
      await util.login(agent);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("projects");
      res.body.projects.should.have.property(0);
      res.body.projects[0].should.have.property("id");
      PROJECT_ID = res.body.projects[0].id;
      res.body.projects.length.should.equal(3);
    });

    it("should search for a list of 3 projects matching title=%ake%", async function () {
      let res = await agent.get(basePath + "?title=%ake%");

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("projects");
      res.body.projects.should.have.property(0);

      res.body.projects[0].should.have.property("title");
      res.body.projects[0].title.should.have.string("ake");
      res.body.projects.length.should.equal(3);
    });

    it("should have pages", async function () {
      let res = await agent.get(basePath + "?limit=1&page=1");

      res.should.have.status(200);
      res.body.total.should.equal(3);
      res.body.should.have.property("projects");
      res.body.projects.length.should.equal(1);
      res.body.projects.should.have.property(0);
      res.body.should.have.property("numPages");
      res.body.numPages.should.equal(3);
    });

    it("should be ordered by title DESC", async function () {
      let res = await agent.get(basePath + '?order=[["title", "DESC"]]');

      res.should.have.status(200);
      res.body.total.should.equal(3);
      res.body.should.have.property("projects");
      res.body.projects.length.should.equal(3);
      res.body.projects.should.have.property(0);
      res.body.projects.should.be.sortedBy("title", { descending: true });
    });

    it("should be ordered by title ASC", async function () {
      let res = await agent.get(basePath + '?order=[["title", "ASC"]]');

      res.should.have.status(200);
      res.body.total.should.equal(3);
      res.body.should.have.property("projects");
      res.body.projects.length.should.equal(3);
      res.body.projects.should.have.property(0);
      res.body.projects.should.be.sortedBy("title");
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("projects");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("projects");
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
    });

    it("SE Role should 200", async function () {
      await util.login(agent, util.SE_USER);
      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
    });

    it("should get a 500", async function () {
      await util.login(agent);
      let res = await agent.get(basePath + "?order=[['title', \"ASC\"]]");

      res.should.have.status(500);
      res.body.should.have.property("error");

      await util.logout(agent);
    });
  });

  describe("GET /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.get(`${basePath}${PROJECT_ID}`);
      res.should.have.status(401);
    });

    it("should get a project", async function () {
      await util.login(agent);
      let res = await agent.get(`${basePath}${PROJECT_ID}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("project");
      res.body.project.should.have.property("id");
      res.body.project.id.should.equal(PROJECT_ID);
    });

    it("should get no project", async function () {
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

      let res = await agent.get(`${basePath}${PROJECT_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("project");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(`${basePath}${PROJECT_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("project");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.get(`${basePath}${PROJECT_ID}`);
      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.get(`${basePath}${PROJECT_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 200", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.get(`${basePath}${PROJECT_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("project");

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
      let res = await agent.put(`${basePath}${projectData.id}`);
      res.should.have.status(401);
    });

    it("should get a 200 changing nothing", async function () {
      await util.login(agent);
      let res = await agent.put(`${basePath}${projectData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("project");
    });

    it("should update a project", async function () {
      projectData.title += "E";
      let res = await agent
        .put(`${basePath}${projectData.id}`)
        .send(projectData);

      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("project");
      res.body.project.should.have.property("id");
      res.body.project.id.should.equal(projectData.id);
      res.body.project.should.have.property("title");
      res.body.project.title.should.equal(projectData.title);
    });

    it("should get the updated project", async function () {
      let res = await agent.get(`${basePath}${projectData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("project");
      res.body.project.should.have.property("id");
      res.body.project.id.should.equal(projectData.id);
      res.body.project.should.have.property("title");
      res.body.project.title.should.equal(projectData.title);
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.put(`${basePath}${PROJECT_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("project");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.put(`${basePath}${PROJECT_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("project");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.put(`${basePath}${PROJECT_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.put(`${basePath}${PROJECT_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.put(`${basePath}${PROJECT_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.logout(agent);
    });
  });

  describe("DELETE /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.put(`${basePath}${projectData.id}`);
      res.should.have.status(401);
    });

    it("should get a 500 changing nothing", async function () {
      await util.login(agent);
      let res = await agent.delete(`${basePath}1d`);
      res.should.have.status(500);
      res.should.have.property("body");
      res.body.should.have.property("error");
    });

    it("should delete (archive) a project", async function () {
      let res = await agent.delete(`${basePath}${projectData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("project");
    });

    it("should get the deleted (archived) project", async function () {
      let res = await agent.get(`${basePath}${projectData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("project");
      res.body.project.should.have.property("id");
      res.body.project.should.have.property("archived");
      res.body.project.archived.should.equal(true);
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.delete(`${basePath}${projectData.id}`);

      res.should.have.status(200);
      res.body.should.have.property("project");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.delete(`${basePath}${projectData.id}`);

      res.should.have.status(200);
      res.body.should.have.property("project");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.delete(`${basePath}${projectData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.delete(`${basePath}${projectData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.delete(`${basePath}${projectData.id}`);

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
