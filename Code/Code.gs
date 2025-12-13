// Called whenever the attached form is submitted
function SubmitForm(e) {
  AddTeam(e.namedValues);  
}

// Adds the team to the correct locations on the spreadsheet
// Note: does not clear the Form Response sheet so there is a record of submissions
function AddTeam(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Collect and format form responses
  var teamName = data['Team Name'];
  var coachName = data['Coach Name'];
  var teamType = data['Team'];
  var league = data['League'];
  var redrafted = data['Has this team been redrafted?'] == 'Yes' ? "TRUE" : "FALSE";


  // Get the first empty row in the Team List sheet
  var teamlistSheet = ss.getSheetByName('🤼 Team List');
  var nextEmptyRow = getFirstEmptyRowByColumnArray(teamlistSheet.getRange('A:A'));

  // Add the responses to the Team Sheet
  teamlistSheet.getRange('A' + nextEmptyRow).setValue(teamName);
  teamlistSheet.getRange('B' + nextEmptyRow).setValue(teamType);
  teamlistSheet.getRange('C' + nextEmptyRow).setValue(coachName);
  teamlistSheet.getRange('D' + nextEmptyRow).setValue(league);
  teamlistSheet.getRange('E' + nextEmptyRow).setValue(redrafted);

  // Duplicate the Roster sheet
  var teamsheetTemplate = ss.getSheetByName('🤼 Team Roster Template');
  var newTeamSheet = teamsheetTemplate.copyTo(ss);

  // Assign the new team to the Roster sheet and unhide it
  newTeamSheet.setName('🤼 '+ teamName);
  newTeamSheet.getRange('B2').setValue(teamName);
  newTeamSheet.showSheet();
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
