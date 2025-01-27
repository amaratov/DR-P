const { ValidationError } = require("sequelize");

const GET_CONFIG_ROLES = [
  "sales",
  "solutions architect",
  "customer",
  "solutions engineer"
];

const config = require('config');

const SAFE_KEYS = ['mapToken'];

var buildStatic = function (db, router, auth) {
  return router;
};

var buildDynamic = function (db, router, auth) {

  router.get(
    "/:key",
    auth.requireLoggedIn,
    auth.requireRoleIn(GET_CONFIG_ROLES),
    async function (req, res, next) {
      try {
        if ( (config.has(req.params.key)) && (SAFE_KEYS.indexOf(req.params.key) !== -1) ){
          return res.json({ key: req.params.key, value: config.get(req.params.key) });
        }
        return res.status(404).json({ error: "Not Found" });
        
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    }
  );

  return router;
};

module.exports = {
  buildStatic: buildStatic,
  buildDynamic: buildDynamic,
};
