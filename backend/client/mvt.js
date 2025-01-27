//TODO: All of these should actually call the mvt apis but they don't exist

const config = require("config");
const TOKEN = config.get("mvtToken");
const MVT_URL = config.get("mvtUrl");
const axios = require("axios");
const logger = require("npmlog");

const GET_MVT_URL = function (path) {
  return `${MVT_URL}/${path}?token=${TOKEN}`;
};

const mvt = {
  getDatacenters: async function (region) {
    try {
      const response = await axios.get(
        `${GET_MVT_URL(
          "api/DataServices/DataCenterLocations"
        )}&region=${region}`
      );
      return response;
    } catch (e) {
      throw e;
    }
  },

  getRegions: async function () {
    try {
      let url = `${GET_MVT_URL("api/DataServices/Regions")}`;
      const response = await axios.get(url);
      return response;
    } catch (e) {
      throw e;
    }
  },

  getDLRMetros: async function () {
    try {
      let url = `${GET_MVT_URL("api/DataServices/DLRMetros")}`;
      const response = await axios.get(url);
      return response;
    } catch (e) {
      throw e;
    }
  },

  getGeocodedAddress: async function (address) {
    try {
      console.log("geo");
      address = encodeURIComponent(address);
      console.log(address);
      let url = `${GET_MVT_URL("api/DataServices/GeoCode/" + address)}`;
      console.log(url);
      const response = await axios.get(url);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  getCloudOptions: async function () {
    try {
      let url = `${GET_MVT_URL("api/DataServices/CloudOptions")}`;
      const response = await axios.get(url);
      return response;
    } catch (e) {
      throw e;
    }
  },

  getCloudOnRamps: async function (region) {
    try {
      const response = await axios.get(
        `${GET_MVT_URL("api/DataServices/CloudsOnRamp")}&dlr_region=${region}`
      );
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  getDgx15Cities: async function () {
    try {
      let url = `${GET_MVT_URL("api/DataServices/DGxIndex15Cities")}`;
      const response = await axios.get(url);
      return response;
    } catch (e) {
      throw e;
    }
  },

  getDgx15: async function (metro, city, region, subregion, year) {
    try {
      let url = `${GET_MVT_URL("api/DataServices/DGxIndex15")}`;

      url += metro ? `&metro=${metro}` : "";
      url += region ? `&region=${region}` : "";
      url += subregion ? `&region_sub=${subregion}` : "";
      // url += year ? `&year=${year}` : '';
      url += city ? `&city=${city}` : "";

      const response = await axios.get(url);
      return response;
    } catch (e) {
      throw e;
    }
  },

  getLatency: async function (address1, address2) {
    try {
      address1 = encodeURIComponent(address1);
      address2 = encodeURIComponent(address2);
      let url = `${GET_MVT_URL(
        "api/DataServices/DataLatency/" + address1 + "/" + address2
      )}`;
      const response = await axios.get(url);
      return response;
    } catch (e) {
      throw e;
    }
  },
};

module.exports = mvt;
