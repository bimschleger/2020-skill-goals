/*

This finds emails from Grammarly that contain the accuracy score, then submits the score to the 2020 Goals form.

Note: This function works because of an auto-add Label filter that I created within Gmail itself.
If an email arrive in my inbox from "Grammarly Insights", it applies the tag "Grammarly", which this script uses.

A Label is applied to Threads. Threads contain Messages.

*/

function findEmailsByLabel() {
  
  // Multiple choice response on the Google Form
  var multipleChoiceText = "2.c) 90% accuracy on Grammarly.";
  
  // Setup to get all the Threads that have a specific Label
  var labelName = "Grammarly";
  var label = GmailApp.getUserLabelByName(labelName);
  var threads = label.getThreads(); // Gets all threads that contain the Label.
  
  for (var i = 0; i < threads.length; i++) {
    
    
    try {
      // Get the first message in the thread. Grammarly only sends one message per thread
      var message = threads[i].getMessages()[0].getPlainBody(); 
      
      // Since there are multiple stats in the email, this gets the accuracy stat
      
      /* Sovles for...
        MASTERY

        You were more accurate than
        40% of Grammarly users.
        
        No activity to report! You were 100% accurate last week.
      */
      
      var regexAccuracy = /MASTERY\s[A-Za-z\s!]+([\d]{2,3})%/g;
      var regexScore = /\d+/g;
      
      var phrase = message.match(regexAccuracy)[0];
      var score = phrase.match(regexScore)[0];
      
      // Submit the form via Google Forms
      submitForm(multipleChoiceText, score);
      
      // Remove the label from the email thread.
      threads[i].removeLabel(label); 
      
    } catch (e) {
      // If there is an error, log it
      // Basically, trying to solve for this error: TypeError: Cannot read property '0' of null
      
      Logger.log("An error occured: " + e);
    };
    
  }
}