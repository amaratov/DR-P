const config = require("config");

const chai = require("chai");
let server = null;
chai.use(require("chai-http"));
chai.use(require("chai-sorted"));
const expect = chai.expect;
const should = chai.should();
let agent = null;
let mdocData = {};
let MDOC_ID = null;

const util = require("../util");
const user = require("../../db/models/user");

const basePath = "/api/v1/marketingdocument/";

describe("Document Routes", function () {
  before(async () => {
    const dbHandler = require("../db-handler");
    await dbHandler.init();
    server = require("../../app");
    agent = chai.request.agent(server);
  });

  describe("POST /", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.post(`${basePath}`);
      res.should.have.status(401);
    });

    it("should get a validation error (docName)", async function () {
      await util.login(agent);
      let res = await agent.post(`${basePath}`);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("docName is required");
    });

    it("should make an marketingdocument", async function () {
      mdocData.docName = "FakeDocument";
      let res = await agent.post(`${basePath}`).send(mdocData);
      res.should.have.status(201);
      res.should.have.property("body");
      res.body.should.have.property("document");
      res.body.document.should.have.property("id");
      let keys = Object.keys(mdocData);
      for (let i = 0; i < keys.length; i++) {
        res.body.document.should.have.property(keys[i]);
        res.body.document[keys[i]].should.equal(mdocData[keys[i]]);
      }
      mdocData = JSON.parse(JSON.stringify(res.body.document));
    });

    it("should get the new marketingdocument", async function () {
      let res = await agent.get(`${basePath}${mdocData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("document");
      res.body.document.should.have.property("id");
      res.body.document.id.should.equal(mdocData.id);
      res.body.document.should.have.property("docName");
      res.body.document.docName.should.equal(mdocData.docName);
      res.body.document.should.have.property("archived");
      res.body.document.archived.should.equal(mdocData.archived);
      res.body.document.should.have.property("createdBy");
      res.body.document.createdBy.should.equal(mdocData.createdBy);
    });

    it("SA Role should 201", async function () {
      await util.login(agent, util.SA_USER);
      let origName = mdocData.docName;
      mdocData.docName = "new document name";

      let res = await agent.post(`${basePath}`).send(mdocData);

      mdocData.docName = origName;

      res.should.have.status(201);
    });

    it("Sales Role should 404", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.post(`${basePath}`).send(mdocData);

      res.should.have.status(404);
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.post(`${basePath}`).send(mdocData);

      res.should.have.status(404);
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 201", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.post(`${basePath}`).send(mdocData);

      res.should.have.status(201);
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.post(`${basePath}`).send(mdocData);

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

    it("should get a list of all(3) document", async function () {
      await util.login(agent);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("documents");
      res.body.documents.should.have.property(0);
      res.body.documents[0].should.have.property("id");
      res.body.documents.length.should.equal(3);
      MDOC_ID = res.body.documents[0].id;
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("documents");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("documents");
    });

    it("Customer Role should 200", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("documents");
    });

    it("Marketing Role should 200", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(3);
      res.body.should.have.property("documents");
    });

    it("SE Role should 200", async function () {
      await util.login(agent, util.SE_USER);
      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
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
      let res = await agent.get(`${basePath}${MDOC_ID}`);
      res.should.have.status(401);
    });

    it("should get an document", async function () {
      await util.login(agent);
      let res = await agent.get(`${basePath}${MDOC_ID}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("document");
      res.body.document.should.have.property("id");
      res.body.document.id.should.equal(MDOC_ID);
    });

    it("should get no document", async function () {
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

      let res = await agent.get(`${basePath}${MDOC_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("document");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(`${basePath}${MDOC_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("document");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.get(`${basePath}${MDOC_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 200", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.get(`${basePath}${MDOC_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("document");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.get(`${basePath}${MDOC_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

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
      let res = await agent.put(`${basePath}${MDOC_ID}`);
      res.should.have.status(401);
    });

    it("should get a 200 changing nothing", async function () {
      await util.login(agent);
      let res = await agent.put(`${basePath}${mdocData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("document");
    });

    it("should update an document", async function () {
      mdocData.docName += "E";
      let res = await agent.put(`${basePath}${mdocData.id}`).send(mdocData);

      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("document");
      res.body.document.should.have.property("id");
      res.body.document.id.should.equal(mdocData.id);
      res.body.document.should.have.property("docName");
      res.body.document.docName.should.equal(mdocData.docName);
    });

    it("should get the updated document", async function () {
      let res = await agent.get(`${basePath}${mdocData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("document");
      res.body.document.should.have.property("id");
      res.body.document.id.should.equal(mdocData.id);
      res.body.document.should.have.property("docName");
      res.body.document.docName.should.equal(mdocData.docName);
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.put(`${basePath}${mdocData.id}`);

      res.should.have.status(200);
    });

    it("Sales Role should 404", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.put(`${basePath}${mdocData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.put(`${basePath}${mdocData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 200", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.put(`${basePath}${mdocData.id}`);

      res.should.have.status(200);
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.put(`${basePath}${mdocData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.logout(agent);
    });
  });

  describe("DELETE /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.put(`${basePath}${MDOC_ID}`);
      res.should.have.status(401);
    });

    it("should get a 500 changing nothing", async function () {
      await util.login(agent);
      let res = await agent.delete(`${basePath}1d`);
      res.should.have.status(500);
      res.should.have.property("body");
      res.body.should.have.property("error");
    });

    it("should delete (archive) an document", async function () {
      let res = await agent.delete(`${basePath}${MDOC_ID}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("document");
    });

    it("should get the deleted (archived) document", async function () {
      let res = await agent.get(`${basePath}${MDOC_ID}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("document");
      res.body.document.should.have.property("id");
      res.body.document.should.have.property("archived");
      res.body.document.archived.should.equal(true);
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.delete(`${basePath}${MDOC_ID}`);

      res.should.have.status(200);
    });

    it("Sales Role should 404", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.delete(`${basePath}${MDOC_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.delete(`${basePath}${MDOC_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 200", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.delete(`${basePath}${MDOC_ID}`);

      res.should.have.status(200);
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.delete(`${basePath}${MDOC_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.logout(agent);
    });
  });
});
