const config = require("config");

const chai = require("chai");
let server = null;
chai.use(require("chai-http"));
chai.use(require("chai-sorted"));
const expect = chai.expect;
const should = chai.should();
let agent = null;
let ROLES = null;
let ADMIN_ID = null;
let userData = {};

const util = require("../util");
const user = require("../../db/models/user");

const basePath = "/api/v1/user/";

describe("User Routes", function () {
  before(async () => {
    const dbHandler = require("../db-handler");
    try {
      ROLES = await dbHandler.init();
      server = require("../../app");
      agent = chai.request.agent(server);
    } catch (e) {
      console.error("e", e.message, e);
      throw e;
    }
  });

  describe("GET /", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.get(basePath);
      res.should.have.status(401);
    });

    it("should get a list of all(6) users", async function () {
      await util.login(agent);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(6);
      res.body.should.have.property("users");
      res.body.users.should.have.property(0);
      res.body.users[0].should.not.have.property("password");
      res.body.users[0].should.not.have.property("salt");
      res.body.users[0].should.have.property("id");
      ADMIN_ID = res.body.users[0].id;
      res.body.users.length.should.equal(6);
    });

    it("should search for a list of 1 user matching firstName=%dmin", async function () {
      let res = await agent.get(basePath + "?firstName=%dmin");

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(1);
      res.body.should.have.property("users");
      res.body.users.should.have.property(0);
      res.body.users[0].should.not.have.property("password");
      res.body.users[0].should.not.have.property("salt");
      res.body.users[0].should.have.property("firstName");
      res.body.users[0].firstName.should.have.string("dmin");
      res.body.users[0].should.have.property("role");
      res.body.users[0].role.should.equal(ROLES.ADMIN_ROLE);
      res.body.users.length.should.equal(1);
    });

    it("should search for a list of 1 user matching lastName=%dmin", async function () {
      let res = await agent.get(basePath + "?lastName=%dmin");

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(1);
      res.body.should.have.property("users");
      res.body.users.should.have.property(0);
      res.body.users[0].should.not.have.property("password");
      res.body.users[0].should.not.have.property("salt");
      res.body.users[0].should.have.property("firstName");
      res.body.users[0].firstName.should.have.string("dmin");
      res.body.users.length.should.equal(1);
    });

    it("should search for a list of 0 user (all archived)", async function () {
      let res = await agent.get(basePath + "?archived=true");

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(0);
      res.body.should.have.property("users");
      res.body.users.length.should.equal(0);
    });

    it("should search for a list of 1 user by role", async function () {
      let res = await agent.get(basePath + "?roles[0]=" + ROLES.MARKETING_ROLE);

      res.should.have.status(200);
      res.body.total.should.equal(1);
      res.body.should.have.property("users");
      res.body.users.length.should.equal(1);
      res.body.users.should.have.property(0);
      res.body.users[0].should.have.property("role");
      res.body.users[0].role.should.equal(ROLES.MARKETING_ROLE);
    });

    it("should have pages", async function () {
      let res = await agent.get(basePath + "?limit=1&page=1");

      res.should.have.status(200);
      res.body.total.should.equal(6);
      res.body.should.have.property("users");
      res.body.users.length.should.equal(1);
      res.body.users.should.have.property(0);
      res.body.users[0].should.have.property("role");
      res.body.users[0].role.should.not.equal(ROLES.ADMIN_ROLE);
      res.body.should.have.property("numPages");
      res.body.numPages.should.equal(6);
    });

    it("should be ordered by firstName DESC", async function () {
      let res = await agent.get(basePath + '?order=[["firstName", "DESC"]]');

      res.should.have.status(200);
      res.body.total.should.equal(6);
      res.body.should.have.property("users");
      res.body.users.length.should.equal(6);
      res.body.users.should.have.property(0);
      res.body.users.should.be.sortedBy("firstName", { descending: true });
    });

    it("should be ordered by lastName ASC", async function () {
      let res = await agent.get(basePath + '?order=[["lastName", "ASC"]]');

      res.should.have.status(200);
      res.body.total.should.equal(6);
      res.body.should.have.property("users");
      res.body.users.length.should.equal(6);
      res.body.users.should.have.property(0);
      res.body.users.should.be.sortedBy("lastName");
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(6);
      res.body.should.have.property("users");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(basePath);

      res.should.have.status(200);
      res.body.should.have.property("total");
      res.body.total.should.equal(6);
      res.body.should.have.property("users");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.get(basePath);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.get(basePath);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.get(basePath);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.login(agent);
    });

    it("should get a 500", async function () {
      let res = await agent.get(basePath + "?order=[['lastName', \"ASC\"]]");

      res.should.have.status(500);
      res.body.should.have.property("error");

      await util.logout(agent);
    });
  });

  describe("GET /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.get(`${basePath}${ADMIN_ID}`);
      res.should.have.status(401);
    });

    it("should get a user", async function () {
      await util.login(agent);
      let res = await agent.get(`${basePath}${ADMIN_ID}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("user");
      res.body.user.should.have.property("id");
      res.body.user.id.should.equal(ADMIN_ID);
    });

    it("should get no user", async function () {
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

      let res = await agent.get(`${basePath}${ADMIN_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(`${basePath}${ADMIN_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.get(`${basePath}${ADMIN_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.get(`${basePath}${ADMIN_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.get(`${basePath}${ADMIN_ID}`);

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

  describe("POST /", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.post(`${basePath}`);
      res.should.have.status(401);
    });

    it("should get a validation error (firstName)", async function () {
      await util.login(agent);
      let res = await agent.post(`${basePath}`);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("firstName is required");
    });

    it("should get a validation error (lastName)", async function () {
      userData.firstName = "John";
      let res = await agent.post(`${basePath}`).send(userData);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("lastName is required");
    });

    it("should get a validation error (email)", async function () {
      userData.lastName = "Doe";
      let res = await agent.post(`${basePath}`).send(userData);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("email is required");
    });

    it("should get a validation error (password)", async function () {
      userData.email = "johndoe@gmail.com";
      let res = await agent.post(`${basePath}`).send(userData);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("password is required");
    });

    it("should get a validation error (role)", async function () {
      userData.password = "password";
      let res = await agent.post(`${basePath}`).send(userData);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("role is required");
    });

    it("should get a validation error (phone)", async function () {
      userData.role = ROLES.ADMIN_ROLE;
      userData.phone = "invalid number";
      let res = await agent.post(`${basePath}`).send(userData);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body?.[0].should.have.property("message");
      res.body?.[0].message.should.equal("Validation is on phone failed");
    });

    it("should make a user", async function () {
      userData.phone = "1-555-555-5555";
      let res = await agent.post(`${basePath}`).send(userData);
      res.should.have.status(201);
      res.should.have.property("body");
      res.body.should.have.property("user");
      res.body.user.should.have.property("id");
      let keys = Object.keys(userData);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "password") {
          res.body.user.should.have.property(keys[i]);
          res.body.user[keys[i]].should.equal(userData[keys[i]]);
        }
      }
      userData = JSON.parse(JSON.stringify(res.body.user));
    });

    it("should get the new user", async function () {
      let res = await agent.get(`${basePath}${userData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("user");
      res.body.user.should.have.property("id");
      let keys = Object.keys(userData);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "password" && keys[i] !== "salt") {
          res.body.user.should.have.property(keys[i]);
          if (userData[keys[i]] || userData[keys[i]] === false) {
            res.body.user[keys[i]].should.equal(userData[keys[i]]);
          }
        }
      }
    });

    it("SA Role should 403 when setting admin role", async function () {
      let origEmail = userData.email;

      userData.email = "SAU@sau.ca";
      userData.password = "sau";
      await util.login(agent, util.SA_USER);

      let res = await agent.post(`${basePath}`).send(userData);

      userData.email = origEmail;
      delete userData.password;

      res.should.have.status(403);
    });

    it("Sales Role should 403 when setting admin role", async function () {
      let origEmail = userData.email;

      userData.email = "SALU@salu.ca";
      userData.password = "salu";
      await util.login(agent, util.SALES_USER);

      let res = await agent.post(`${basePath}`).send(userData);

      userData.email = origEmail;
      delete userData.password;
      res.should.have.status(403);
    });

    it("SA Role should 201", async function () {
      let origEmail = userData.email;

      userData.email = "SAU@sau.ca";
      userData.password = "sau";
      userData.role = ROLES.MARKETING_ROLE;
      await util.login(agent, util.SA_USER);

      let res = await agent.post(`${basePath}`).send(userData);

      userData.email = origEmail;
      delete userData.password;
      userData.role = ROLES.ADMIN_ROLE;

      res.should.have.status(201);
    });

    it("Sales Role should 201", async function () {
      let origEmail = userData.email;

      userData.email = "SALU@salu.ca";
      userData.password = "salu";
      userData.role = ROLES.MARKETING_ROLE;
      await util.login(agent, util.SALES_USER);

      let res = await agent.post(`${basePath}`).send(userData);

      userData.email = origEmail;
      delete userData.password;
      userData.role = ROLES.ADMIN_ROLE;

      res.should.have.status(201);
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.post(`${basePath}`).send(userData);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.post(`${basePath}`).send(userData);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.post(`${basePath}`).send(userData);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.logout(agent);
    });
  });

  describe("PUT /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.put(`${basePath}${userData.id}`);
      res.should.have.status(401);
    });

    it("should get a 200 changing nothing", async function () {
      delete userData.password;
      delete userData.salt;
      await util.login(agent);
      let res = await agent.put(`${basePath}${userData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("user");
    });

    it("should get a validation error (phone)", async function () {
      let origPhone = userData.phone;
      userData.phone = "NotAPhone";
      let res = await agent.put(`${basePath}${user.id}`).send(userData);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property(0);
      res.body[0].should.have.property("message");
      res.body[0].message.should.equal("Validation is on phone failed");
      userData.phone = origPhone;
    });

    it("should fail to update password for a different user", async function () {
      userData.password = "NotMyPassword";
      let res = await agent.put(`${basePath}${user.id}`).send(userData);
      res.should.have.status(400);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal(
        "You are not allowed to update another users password"
      );
      delete userData.password;
    });

    it("should update a user", async function () {
      userData.firstName += "E";
      userData.lastName += "E";
      userData.email = "janedoe@gmail.ca";
      userData.role = ROLES.SA_ROLE;
      userData.phone = "1-555-555-5556";
      let res = await agent.put(`${basePath}${userData.id}`).send(userData);

      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("user");
      res.body.user.should.have.property("id");
      let keys = Object.keys(userData);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "password" && keys[i] !== "updatedAt") {
          res.body.user.should.have.property(keys[i]);
          if (userData[keys[i]] !== null) {
            res.body.user[keys[i]].should.equal(userData[keys[i]]);
          }
        }
      }

      userData = JSON.parse(JSON.stringify(res.body.user));
    });

    it("should get the updated user", async function () {
      let res = await agent.get(`${basePath}${userData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("user");
      res.body.user.should.have.property("id");
      let keys = Object.keys(userData);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "password" && keys[i] !== "salt") {
          res.body.user.should.have.property(keys[i]);
          if (userData[keys[i]] || userData[keys[i]] === false) {
            res.body.user[keys[i]].should.equal(userData[keys[i]]);
          }
        }
      }
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.put(`${basePath}${ADMIN_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.put(`${basePath}${ADMIN_ID}`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.put(`${basePath}${ADMIN_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.put(`${basePath}${ADMIN_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.put(`${basePath}${ADMIN_ID}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.logout(agent);
    });
  });

  describe("DELETE /:id", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.put(`${basePath}${userData.id}`);
      res.should.have.status(401);
    });

    it("should get a 404 changing nothing", async function () {
      await util.login(agent);
      let res = await agent.delete(`${basePath}1d`);
      res.should.have.status(500);
      res.should.have.property("body");
      res.body.should.have.property("error");
    });

    it("should delete (archive) a user", async function () {
      let res = await agent.delete(`${basePath}${userData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("user");
    });

    it("should get the deleted (archived) user", async function () {
      let res = await agent.get(`${basePath}${userData.id}`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("user");
      res.body.user.should.have.property("id");
      res.body.user.should.have.property("archived");
      res.body.user.archived.should.equal(true);
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.delete(`${basePath}${userData.id}`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.delete(`${basePath}${userData.id}`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Customer Role should 404", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.delete(`${basePath}${userData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("Marketing Role should 404", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.delete(`${basePath}${userData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");
    });

    it("SE Role should 404", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.delete(`${basePath}${userData.id}`);

      res.should.have.status(404);
      res.should.have.property("body");
      res.body.should.have.property("error");
      res.body.error.should.equal("Not Found");

      await util.logout(agent);
    });
  });

  describe("GET /whoami", async function () {
    it("should get unauthorized", async function () {
      let res = await agent.put(`${basePath}whoami`);
      res.should.have.status(401);
    });

    it("should get current user info", async function () {
      await util.login(agent);
      let res = await agent.get(`${basePath}whoami`);
      res.should.have.status(200);
      res.should.have.property("body");
      res.body.should.have.property("user");
    });

    it("SA Role should 200", async function () {
      await util.login(agent, util.SA_USER);

      let res = await agent.get(`${basePath}whoami`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Sales Role should 200", async function () {
      await util.login(agent, util.SALES_USER);

      let res = await agent.get(`${basePath}whoami`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Customer Role should 200", async function () {
      await util.login(agent, util.CUSTOMER_USER);

      let res = await agent.get(`${basePath}whoami`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("Marketing Role should 200", async function () {
      await util.login(agent, util.MARKETING_USER);

      let res = await agent.get(`${basePath}whoami`);

      res.should.have.status(200);
      res.body.should.have.property("user");
    });

    it("SE Role should 200", async function () {
      await util.login(agent, util.SE_USER);

      let res = await agent.get(`${basePath}whoami`);

      res.should.have.status(200);
      res.body.should.have.property("user");

      await util.logout(agent);
    });
  });
});
