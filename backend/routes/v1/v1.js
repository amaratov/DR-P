var express = require("express");
var path = require("path");

let db = require("../../db/db").init();

let auth = require("../../auth/auth");

const { Router } = require("express");
const rdocRoutes = require("../base/referenceDoc");
const basicCrud = require("../base/basicCrud");
const mdocRoutes = require("../base/marketingDoc");
const sbcRoutes = require("../base/solutionBriefcase");

/* if used for v2 this should do the same thing as base, but also import the ./v2 version and buildstatic/dynamic after
building the base ones*/

module.exports = (router, logger) => {
  var companyRoutes = require("../base/company");
  var cRouter = new Router();
  cRouter = companyRoutes.buildStatic(db, cRouter);
  cRouter = companyRoutes.buildDynamic(db, cRouter, auth);
  router.use("/company", cRouter);

  var userRoutes = require("../base/user");
  var uRouter = new Router();
  uRouter = userRoutes.buildStatic(db, uRouter, auth);
  uRouter = userRoutes.buildDynamic(db, uRouter, auth);
  router.use("/user", uRouter);

  var loginRoutes = require("../base/login");
  var lRouter = new Router();
  lRouter = loginRoutes.buildStatic(db, lRouter, auth);
  lRouter = loginRoutes.buildDynamic(db, lRouter, auth);
  router.use("/login", lRouter);

  var logoutRoutes = require("../base/logout");
  var loRouter = new Router();
  loRouter = logoutRoutes.buildStatic(db, loRouter, auth);
  loRouter = logoutRoutes.buildDynamic(db, loRouter, auth);
  router.use("/logout", loRouter);

  const basicCrud = require("../base/basicCrud");
  var rRouter = new Router();
  rRouter = basicCrud.buildDynamic(db, rRouter, auth, "Role", [
    "name",
    "archived",
  ]);
  router.use("/role", rRouter);

  var projectRoutes = require("../base/project");
  var pRouter = new Router();
  pRouter = projectRoutes.buildStatic(db, pRouter);
  pRouter = projectRoutes.buildDynamic(db, pRouter, auth);
  router.use("/project", pRouter);

  var ivRouter = new Router();
  ivRouter = basicCrud.buildDynamic(db, ivRouter, auth, "IndustryVertical", [
    "name",
    "archived",
  ], ['admin'], [
    {dbName: 'documents', as: 'documentCount', where: 'industry_vertical.id = ANY(documents."industryVertical")'},
    {dbName: 'companies', as: 'companyCount', where: 'industry_vertical.id = ANY(companies."industryVertical")'}
  ]);
  router.use("/industry_vertical", ivRouter);

  var ucRouter = new Router();
  ucRouter = basicCrud.buildDynamic(db, ucRouter, auth, "UseCase", [
    "name",
    "archived",
  ], ['admin'], 
  [
    {dbName: 'documents', as: 'documentCount', where: 'use_case.id = ANY(documents."useCase")'},
    {dbName: 'projects', as: 'projectCount', where: 'use_case.id = ANY(projects."useCases")'}
  ]
  );
  router.use("/use_case", ucRouter);

  var poiRoutes = require("../base/poi");
  var poiRouter = new Router();
  poiRouter = poiRoutes.buildDynamic(db, poiRouter, auth);
  router.use("/poi", poiRouter);

  var iconRoutes = require("../base/icon");
  var iconRouter = new Router();
  iconRouter = iconRoutes.buildStatic(db, iconRouter, auth);
  iconRouter = iconRoutes.buildDynamic(db, iconRouter, auth, logger);
  router.use("/icon", iconRouter);

  var mdocRoutes = require("../base/marketingDoc");
  var mdocRouter = new Router();
  mdocRouter = mdocRoutes.buildStatic(db, mdocRouter, auth);
  mdocRouter = mdocRoutes.buildDynamic(db, mdocRouter, auth);
  router.use("/marketingdocument", mdocRouter);

  var rdocRoutes = require("../base/referenceDoc");
  var rdocRouter = new Router();
  rdocRouter = rdocRoutes.buildStatic(db, rdocRouter, auth);
  rdocRouter = rdocRoutes.buildDynamic(db, rdocRouter, auth);
  router.use("/referencedocument", rdocRouter);

  var cdocRoutes = require("../base/customerDoc");
  var cdocRouter = new Router();
  cdocRouter = cdocRoutes.buildStatic(db, cdocRouter, auth);
  cdocRouter = cdocRoutes.buildDynamic(db, cdocRouter, auth);
  router.use("/customerdocument", cdocRouter);

  var pbcRoutes = require("../base/projectBriefcase");
  var pbcRouter = new Router();
  pbcRouter = pbcRoutes.buildStatic(db, pbcRouter, auth);
  pbcRouter = pbcRoutes.buildDynamic(db, pbcRouter, auth);
  router.use("/project_briefcase", pbcRouter);

  var sbcRoutes = require("../base/solutionBriefcase");
  var sbcRouter = new Router();
  sbcRouter = sbcRoutes.buildStatic(db, sbcRouter, auth);
  sbcRouter = sbcRoutes.buildDynamic(db, sbcRouter, auth);
  router.use("/solution_briefcase", sbcRouter);

  var regionRoutes = require("../base/region");
  var rRouter = new Router();
  rRouter = regionRoutes.buildStatic(db, rRouter);
  rRouter = regionRoutes.buildDynamic(db, rRouter, auth);
  router.use("/region", rRouter);

  //BEGIN Icon type routes
  for (let i=0; i<db.Icon.TYPES.length; i++){
    var path = db.Icon.TYPES[i];
    if (path.substring(path.length-1) === 's'){
      path = path.substring(0, path.length-1);
    }

    if (db.Icon.TYPES[i] === 'generic'){
      path = "generic_icon"
    }

    var iconTypeRouter = new Router();
    iconTypeRouter = iconRoutes.buildStatic(db, iconTypeRouter);
    iconTypeRouter = iconRoutes.buildDynamic(db, iconTypeRouter, auth, logger, db.Icon.TYPES[i]);
    router.use(`/${path}`, iconTypeRouter);
  }
  //END Icon type routes

  var configRouter = require("../base/config");
  var cnfgRouter = new Router();
  cnfgRouter = configRouter.buildStatic(db, cnfgRouter, auth);
  cnfgRouter = configRouter.buildDynamic(db, cnfgRouter, auth);
  router.use("/config", cnfgRouter);

  var tagRouter = new Router();
  tagRouter = basicCrud.buildDynamic(db, tagRouter, auth, "Tag", [
    "name",
  ], ["solutions architect"]);
  router.use("/tag", tagRouter);

  return router;
};
