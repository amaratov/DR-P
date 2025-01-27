(async () => {
  var db = require("../db").init();

  await db.DBState.sync();
  let currState = await db.DBState.findAll();

  if (currState.length == 0) {
    await db.DBState.create({ state: -1 });
  }

  await require("./000-init").migrate();
  await require("./001-guids").migrate();
  await require("./002-icons").migrate();
  await require("./003-documents").migrate();
  await require("./004-projectDetail").migrate();
  await require("./005-projectBriefcase").migrate();
  await require("./006-solutionBriefcase").migrate();
  await require("./007-compliance").migrate();
  await require("./008-iconv2").migrate();
  await require("./009-unique-emails").migrate();
  await require("./010-region").migrate();
  await require("./011-marketing").migrate();
  await require("./012-projectDetailsv2").migrate();
  await require("./013-reference").migrate();
  await require("./014-connections").migrate();
  await require("./015-icons").migrate();
  await require("./016-mvtRegions").migrate();
  await require("./017-addressedDetails").migrate();
  await require("./018-typedProjectD").migrate();
  await require("./019-addNoteTypeToProjectDetail").migrate();
  await require("./020-updateProjectDetailsColumn").migrate();
  await require("./021-addNoteToProject").migrate();
  await require("./022-updateDatacenterPropForApps").migrate();
  await require("./023-modelEnumDetail").migrate();
  await require("./024-updateSolutionBriefcase").migrate();
  await require("./025-updateProjectBriefcase").migrate();
  await require("./026-removeUniqueDocnameDocuments").migrate();
  await require("./027-addOnRampFieldsToConnection").migrate();
  process.exit();
})();
