function onOpen(e) {
  //checkSheetNamesAreCorrect();
}

function onEdit(e) {
  var teamListName = "🤼 Team List";
  var addRemoveCol = 9;
  var sheet = e.range.getSheet();
  var col = e.range.columnStart;
  var row = e.range.rowStart;

  if(row <2) {
    return;
  }

  if(sheet.getSheetName() == teamListName && col == addRemoveCol) {
    switch(e.value) {
      case "➕ Add Team":
      AddTeam(row);
      break;
      case "🔗 Reconnect Sheet":
      ReconnectSheet(row);
      break;
      case "❌ Delete Team":
      RemoveTeam(row);
      break;
      default:
      break;
    }
    e.range.setValue("✏️ Menu");
  }
}

function ReconnectSheet(row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var teamlistSheet = ss.getSheetByName('🤼 Team List');
  
  teamlistSheet.getRange("L" + row).setValue("pending");
  teamlistSheet.getRange("I" + row).setValue("⌛ Pending");

  var id = teamlistSheet.getRange('K' + row).getValue();

  if(id !== "") {    
      var reqName = ss.getSheetById(id).getName();
      var nameCell = teamlistSheet.getRange('J' + row);
      if(nameCell.getValue() !== reqName) {
        nameCell.setValue(reqName);
      }

      teamlistSheet.getRange("L" + row).setValue("active");       
    }
}

function AddTeam(row) {
  var ui = SpreadsheetApp.getUi(); 

  var result = ui.prompt(
    'Add New Team',
     'Enter your Team name',
    ui.ButtonSet.OK_CANCEL,
  );

  // Process the user's response.
  var button = result.getSelectedButton();
  if (button !== ui.Button.OK) {
    return;
  } 

  var teamName = result.getResponseText();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var teamlistSheet = ss.getSheetByName('🤼 Team List');

  teamlistSheet.getRange("L" + row).setValue("pending");
  teamlistSheet.getRange("I" + row).setValue("⌛ Pending");

  var sheetId = AddTeamRoster(teamName);
  teamlistSheet.getRange("K" + row).setValue(sheetId);
  teamlistSheet.getRange("J" + row).setValue("🤼 " + teamName);
  teamlistSheet.getRange("L" + row).setValue("active");
}

function RemoveTeam(row) {
  
  var ui = SpreadsheetApp.getUi(); 

  var result = ui.prompt(
    "Are you sure you want to delete this team?",
    "Type DELETE below to confirm",
    ui.ButtonSet.OK_CANCEL,
  );

  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button !== ui.Button.OK || text !== "DELETE") {
    return;
  } 
  
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var teamlistSheet = ss.getSheetByName('🤼 Team List');

  teamlistSheet.getRange("L" + row).setValue("pending");
  teamlistSheet.getRange("I" + row).setValue("⌛ Pending");

  var sheetName = teamlistSheet.getRange("J" + row).getValue();
  var teamSheet = ss.getSheetByName(sheetName);

  ss.deleteSheet(teamSheet);
  teamlistSheet.getRange("J" + row).clearContent();
  teamlistSheet.getRange("K" + row).clearContent();
  teamlistSheet.getRange("L" + row).setValue("inactive");
}

// Adds the team to the correct locations on the spreadsheet
// Note: does not clear the Form Response sheet so there is a record of submissions
function AddTeamRoster(teamName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Duplicate the Roster sheet
  var teamsheetTemplate = ss.getSheetByName('🤼 Team Roster Template');
  var newTeamSheet = teamsheetTemplate.copyTo(ss);

  // Hide it on creation, as it will not inherit the hidden status from the template
  newTeamSheet.hideSheet();

  // Assign the new team to the Roster sheet and unhide it
  newTeamSheet.setName("🤼 " + teamName);
  newTeamSheet.getRange('A2').setValue(teamName);
  newTeamSheet.showSheet();

  return newTeamSheet.getSheetId();
}

// Finds the first empty row within a sheet
function getFirstEmptyRowByColumnArray(column) {
  var values = column.getValues(); // get all data in one call
  var ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  return (ct+1);
}

// Gets the the name of a sheet based on it's ID
function getSheetNameById(sheetId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetById(sheetId);

  return sheet.getName();
}
