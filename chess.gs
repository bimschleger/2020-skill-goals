/* 

I'm logging my goals for 2020. One of my goals includes getting better at chess.

The chess.com API allows for read0only access of some stats. Previously, I manually added all stats via a Google Form.

I decided to automate the checking, validating, and submission of Daily and Blitz games.

*/

/*

Compare recent sheet scores and current chess.com scores.

*/

function determineIfChessUpdateNeeded() {
  
  // Game type and the name on the multiple choice form
  var gameTypes = {
    "lessons": "3.a) 900 puzzle rating on Chess.com.",
    "blitz": "3.b) 1100 Blitz rating on Chess.com",
    "daily": "3.c) 1100 Daily rating on Chess.com."
  }
  
  // Get current and recent scores
  var currentScores = getCurrentChessScoresFromDotCom();
  var recentScores = getRecentChessScoresFromSheet(gameTypes);
  
  // Get keys to iterate through
  var recentScoreKeys = Object.keys(recentScores);
  
  // If current is not equal to recent Sheet addition, submit form with new value.
  recentScoreKeys.forEach(function(key) {
    if (currentScores[key] !== recentScores[key]) {
      var score = currentScores[key];
      var operator = "different than";
      submitForm(gameTypes[key], score);  
    } 
    else {
      var operator = "the same as";
    }
    
    // Log a message whether the current and recent scores were the same or different
    var message = "Current " + key + " score (" + currentScores[key] +") is " + operator + " the recent " + key + " score (" + recentScores[key] + ").";
    Logger.log(message);
  });
}


/* 

Gets the current Daily and Blitz scores from chess.com

@return {object} currentScores - Object containing the current scores for Daily and Blitz games

*/

function getCurrentChessScoresFromDotCom() {
  
  // Get chess.com stats for a user as JSON
  var username = "bimschleger";
  var url = "https://api.chess.com/pub/player/" + username +"/stats";
  var currentData = UrlFetchApp.fetch(url);
  var currentJson = JSON.parse(currentData);
  
  // Get current scores for a user by game type
  var currentDaily = currentJson.chess_daily.last.rating;
  var currentBlitz = currentJson.chess_blitz.last.rating;
  
  var currentScores = {
    "daily": currentDaily,
    "blitz": currentBlitz
  };
  
  return currentScores
}


/* 

Gets the most recent Daily and Blitz scores added to the Skill spreadsheet

@param {object} gameTypes - An object with keys as the name of the game type (blitz, daily), and values that match the Google Form responses.
@return {object} recentScores - Object containing the current scores for Daily and Blitz games

*/

function getRecentChessScoresFromSheet(gameTypes) {
  
  // Access the spreadsheet
  var sheetId = "1Gn0umAg0aj153WXTdxdeIi0qKDTZRHUPIELn1FOBm2Y";
  var sheetName = "Data";
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(sheetName);
  
  // Get data range
  var lastRow = ss.getLastRow();
  var numberOfRows = lastRow -1;
  var data = ss.getDataRange().getValues();
  
  // Get most recently added scores by game type
  var recentDaily = getLastScore(data, gameTypes["daily"]);
  var recentBlitz = getLastScore(data, gameTypes["blitz"]);
  
  var recentScores = {
    "daily": recentDaily,
    "blitz": recentBlitz
  };
  
  return recentScores
}


/* 

Return the last score for a specific game type.
Filters the data range by the type of game, gets the last row, pulls the score from that row.

@param {array} dataRange - two dimensional array of dates, game types, and scores.
@param {string} gameTypeDescription - The Google Forms checkbox option that we want.
@return {integer} lastScore - The last score for a particular game type

*/

function getLastScore(data, gameTypeDescription) {
  
  var recentFilteredRange = [];
  for (i = 0; i < data.length; i++) {
    var row = data[i];
    
    // Filters out different gameTypes and null values.
    if (row[1] === gameTypeDescription && row[2]) {
      recentFilteredRange.push(row);
    }
  }
  
  // Get the last filtered row
  var lastEntry = recentFilteredRange[recentFilteredRange.length -1];
  var lastScore = lastEntry[2];
  
  return lastScore;
}