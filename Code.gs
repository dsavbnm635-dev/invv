function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var name = String(d.name || "").trim().substring(0, 60);
  var count = parseInt(d.count, 10);
  var id = String(d.id || "");
  if (!name || !(count >= 1 && count <= 3) || !id) return out({ ok: false });
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("RSVP") || ss.insertSheet("RSVP");
  if (sh.getLastRow() === 0) {
    sh.appendRow(["ID", "Name", "Guests", "Language", "Date"]);
    sh.getRange("G1").setValue("Total guests");
    sh.getRange("H1").setFormula("=SUM(C2:C)");
    sh.getRange("G2").setValue("Responses");
    sh.getRange("H2").setFormula("=COUNTA(B2:B)");
  }
  var last = sh.getLastRow();
  var ids = last > 1 ? sh.getRange(2, 1, last - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];
  var row = [id, name, count, d.lang === "en" ? "en" : "fa", new Date()];
  var i = ids.indexOf(id);
  if (i >= 0) sh.getRange(i + 2, 1, 1, 5).setValues([row]);
  else sh.appendRow(row);
  lock.releaseLock();
  return out({ ok: true });
}
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
