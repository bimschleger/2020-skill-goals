/* 

Submits the Skill form for a particular goal and the score for that goal.

@param {string} multipleChoiceText - The text for the desired multiple choice goal
@param {integer} score - The current score of a particular goal

*/

function submitForm(multipleChoiceText, score) {
  
  // Setup access to the form and responses
  var formId = "1sat4YF0pDNooZCLpegxvUFjcCByU5FrBebE4K10zuNU";
  var form = FormApp.openById(formId);
  var formResponse = form.createResponse();
  var items = form.getItems();
  
  // Set multiple choice response
  var multItem = items[0].asMultipleChoiceItem();
  var multResponse = multItem.createResponse(multipleChoiceText);
  formResponse.withItemResponse(multResponse);

  // Set score response
  var scoreItem = items[1].asTextItem();
  var scoreResponse = scoreItem.createResponse(score);
  formResponse.withItemResponse(scoreResponse);
  
  // Submit the Form
  formResponse.submit();
  Logger.log("Submitted the form: " + multipleChoiceText +", Score: " + score);
}