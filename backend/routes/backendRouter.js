var init = function(logger){
  let express = require('express');
  let router = express.Router();
  const path = require('path');

  global.catchAsync = fn => {
      return (req, res, next) => {
        fn(req, res, next).catch(next)
      };
  };

  const v1 = require('./v1/v1');
  router.use('/v1', v1(express.Router(), logger));

  //api spec
  router.use('/spec', express.static(path.join(__dirname, 'spec')));

  //api docs
  router.use('/api-docs', function(req, res){
      const docs = require('./docs/docs');
      res.send(docs.getDocHTML("v1"));
  });
  return router;
}

module.exports = init;
