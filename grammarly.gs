/*

This finds emails from Grammarly that contain the accuracy score, then submits the score to the 2020 Goals form.

Note: This function works because of an auto-add Label filter that I created within Gmail itself.
If an email arrive in my inbox from "Grammarly Insights", it applies the tag "Grammarly", which this script uses.

A Label is applied to Threads. Threads contain Messages.

*/

function findEmailsByLabel() {
  
  // Multiple choice response on the Google Form
  var multipleChoiceText = "2.c) 90% accuracy on Grammarly.";
  var label = "Grammarly";
  
  var threads = getEmailThreadsWithLabel(label);
  
  for (var i = 0; i < threads.length; i++) {
    try {
      // Get the first message in the thread. Grammarly only sends one message per thread
      var message = threads[i].getMessages()[0].getPlainBody();
      var score = getMasteryScore(message);
      
      if (score) {
        submitForm(multipleChoiceText, score);
      }
      
      threads[i].removeLabel(label); // Remove the label from the email thread. Results in 0 emaisl with label.
      
    } catch (error) {
      Logger.log("An error occured: " + error);
    };
    
  }
}


/*

Gets the mastery score from email body content.

@param {string} The plaintext body content of an email.
@return {string} The Mastery score within the email.

*/

function getMasteryScore(emailBodyContent) {
  
  var masteryPhraseRegex = /Mastery\s+[A-Za-z\s!]+[\d]{2,3}%/g;
  var masteryScoreRegex = /\d+/g;
  var masteryScore;
  
  try {
    var masteryPhrase = emailBodyContent.match(masteryPhraseRegex);
  
    if (masteryPhrase) {
      masteryScore = masteryPhrase[0].match(masteryScoreRegex);
      if (masteryScore) {
        Logger.log("Mastery score found: " + masteryScore);
      } else {
        Logger.log("No mastery score found");
      }
    };
  } catch (error) {
    Logger.log("An error occured: " + error);
  };
  
  return masteryScore;
}


/*

Gets all Gmail message threads that are tagged with a specific label.

@param {string} label - The string of the label to search for.
@return {array} threads - An array of emails threads that contain messages.

*/

function getEmailThreadsWithLabel(label) {
  
  var label = GmailApp.getUserLabelByName(label);
  var threads = label.getThreads(); // Gets all threads that contain the Label.
  
  return threads;
  
}