const PLACEHOLDER_ROLES = [
  "sales",
  "solutions architect",
  "customer",
  "solutions engineer",
];

var buildStatic = function (db, router) {
  return router;
};

var buildDynamic = function (db, router, auth) {
  const defaults = require("./defaults");
  const sequelize = require("sequelize");
  const OP = sequelize.Op;
  const mvtApi = require("../client/mvt");

  router.get(
    "/datacenters",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        let region = req.query.region;
        if (!region) {
          return res.status(400).json({ error: "region is required" });
        }
        let resp = await mvtApi.getDatacenters(region);
        res.status(200).json(resp.data);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/regions",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        let resp = await mvtApi.getRegions();

        res.status(200).json(resp.data);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/dlr_metros",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        let resp = await mvtApi.getDLRMetros();

        res.status(200).json(resp.data);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/geocode",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        if (!req.query.address) {
          return res.status(400).json({ error: "address is required" });
        }

        let resp = await mvtApi.getGeocodedAddress(req.query.address);

        res.status(200).json(resp.data);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/cloud_options",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        let resp = await mvtApi.getCloudOptions();

        res.status(200).json(resp.data);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/cloud_on_ramps",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        let region = req.query.region;
        if (!region) {
          return res.status(400).json({ error: "region is required" });
        }

        let resp = await mvtApi.getCloudOnRamps(region);

        res.status(200).json(resp.data);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/dgx_cities",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        let resp = await mvtApi.getDgx15Cities();

        res.status(200).json(resp.data);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/dgx",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        let region = req.query.region;
        let metro = req.query.metro;
        let city = req.query.city;
        let subregion = req.query.subregion;
        let year = req.query.year;

        let resp = await mvtApi.getDgx15(metro, city, region, subregion, year);

        res.status(200).json(resp.data);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  router.get(
    "/latency",
    auth.requireLoggedIn,
    auth.requireRoleIn(PLACEHOLDER_ROLES),
    async function (req, res, next) {
      try {
        if (!req.query.address) {
          return res.status(400).json({ error: "address is required" });
        }

        if (!req.query.address2) {
          return res.status(400).json({ error: "address2 is required" });
        }

        let resp = await mvtApi.getLatency(
          req.query.address.trim(),
          req.query.address2.trim()
        );

        if (resp.data.length === 0) {
          console.log(
            "No MVT Latency results",
            new Date(),
            "|",
            req.query.address,
            "|",
            req.query.address2,
            "|",
            resp.data
          );
        }

        return res.status(200).json({
          ...resp.data,
          originId: req.query.originId,
          endpointId: req.query.endpointId,
          isOnRampOrigin: req.query.isOnRampOrigin,
          isOnRampEnd: req.query.isOnRampEnd,
          onRampOriginParentId: req.query.onRampOriginParentId,
          onRampEndParentId: req.query.onRampEndParentId,
        });
      } catch (e) {
        console.error("MVT Error", e);
        res.status(500).json({ error: e.message });
      }
    }
  );

  return router;
};

module.exports = {
  buildStatic: buildStatic,
  buildDynamic: buildDynamic,
};
