try{
    const moment = require('moment');
    moment.suppressDeprecationWarnings = true;
}catch(e){}

describe("PDX Mapper Api Unit Tests", function() {
    require('./v1/v1');
});