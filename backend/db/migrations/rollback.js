(async () => {
  let rollbackTo = -1;
  if (process.argv && process.argv.length >= 3) {
    rollbackTo = parseInt(process.argv[2]);
  }

  var db = require("../db").init();

  await db.DBState.sync();
  let currState = await db.DBState.findAll();

  if (currState.length === 0) {
    db.DBState.create({ state: -1 });
  }

  if (rollbackTo <= 26) {
    await require("./027-addOnRampFieldsToConnection").rollback();
  }

  if (rollbackTo <= 25) {
    await require("./026-removeUniqueDocnameDocuments").rollback();
  }

  if (rollbackTo <= 24) {
    await require("./025-updateProjectBriefcase").rollback();
  }

  if (rollbackTo <= 23) {
    await require("./024-updateSolutionBriefcase").rollback();
  }

  if (rollbackTo <= 22) {
    await require("./023-modelEnumDetail").rollback();
  }

  if (rollbackTo <= 21) {
    await require("./022-updateDatacenterPropForApps").rollback();
  }

  if (rollbackTo <= 20) {
    await require("./021-addNoteToProject").rollback();
  }

  if (rollbackTo <= 19) {
    await require("./020-updateProjectDetailsColumn").rollback();
  }

  if (rollbackTo <= 18) {
    await require("./019-addNoteTypeToProjectDetail").rollback();
  }

  if (rollbackTo <= 17) {
    await require("./018-typedProjectD").rollback();
  }

  if (rollbackTo <= 16) {
    await require("./017-addressedDetails").rollback();
  }

  if (rollbackTo <= 15) {
    await require("./016-mvtRegions").rollback();
  }

  if (rollbackTo <= 14) {
    await require("./015-icons").rollback();
  }

  if (rollbackTo <= 13) {
    await require("./014-connections").rollback();
  }

  if (rollbackTo <= 12) {
    await require("./013-reference").rollback();
  }

  if (rollbackTo <= 11) {
    await require("./012-projectDetailsv2").rollback();
  }

  if (rollbackTo <= 10) {
    await require("./011-marketing").rollback();
  }

  if (rollbackTo <= 9) {
    await require("./010-region").rollback();
  }

  if (rollbackTo <= 8) {
    await require("./009-unique-emails").rollback();
  }

  if (rollbackTo <= 5) {
    await require("./008-iconv2").rollback();
  }

  if (rollbackTo <= 6) {
    await require("./007-compliance").rollback();
  }

  if (rollbackTo <= 5) {
    await require("./006-solutionBriefcase").rollback();
  }

  if (rollbackTo <= 4) {
    await require("./005-projectBriefcase").rollback();
  }

  if (rollbackTo <= 3) {
    await require("./004-projectDetail").rollback();
  }

  if (rollbackTo <= 2) {
    await require("./003-documents").rollback();
  }

  if (rollbackTo <= 1) {
    await require("./002-icon").rollback();
  }

  if (rollbackTo <= 0) {
    await require("./001-guids").rollback();
  }

  if (rollbackTo <= -1) {
    await require("./000-init").rollback();
  }

  process.exit();
})();
