'use strict';
 
var https = require ('https');
const functions = require('firebase-functions');
const DialogFlowApp = require('actions-on-google').DialogFlowApp;

console.log('set me');
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Inside Main function.....yessssssss');
  console.log('Request Headers: ' + JSON.stringify(request.headers));
  console.log('Request Body: ' + JSON.stringify(request.body));
  
  let action = request.body.queryResult.action;
  //const agent = new WebhookClient({ request, response });
  var chat = "here is a sample response:";
  console.log('Inside Main function2');
  console.log(action);
  response.setHeader('Content-Type','application/json');
  
  if (action!= 'input.getRecipe'){
      console.log('Inside input function');
  	response.send(buildChatResponse("I'm sorry, I don't know this"));
  	return;
  }

const parameters = request.body.queryResult.parameters;

var foodSearch = parameters.food;

getRecipe (foodSearch,response);

});

function getRecipe (foodSearch, CloudFnResponse) {

	console.log('In Function Get Recipe');

	console.log("recipe: " + foodSearch);

	var pathString = `/recipes/complexSearch?apiKey=3132a54596b442539d8184004fd42bfd&query=${foodSearch}&instructionsRequired=true&addRecipeInformation=true&number=3`;


	var request = https.get({
		host: "api.spoonacular.com",
		path: pathString,
	}, function (response) {
		var json = "";
		response.on('data', function(chunk) {
			console.log("received JSON response: " + chunk);
			json += chunk;

			
		});

		response.on('end', function(){
          	var jsonData = JSON.parse(json);
			var recipeResult = jsonData; 

			
            const firstResults = recipeResult.results[0];
            const secondResults = recipeResult.results[1];
            const thirdResults = recipeResult.results[2];
            

            const {title:firstReply,summary:firstSummary} = firstResults;
            const {title:secondReply,summary:secondSummary} = secondResults;
            const {title:thirdReply,summary:thirdSummary} = thirdResults;
          	

			console.log ("The recipes received are: " + recipeResult);

			var chat = `The recipes available for  ${foodSearch} are: \n ${firstReply} : ${firstSummary} \n \n ${secondReply}: ${secondSummary} \n \n ${thirdReply}: ${thirdSummary}` ;

			CloudFnResponse.send(buildChatResponse(chat));

		});

});

}

function buildChatResponse(chat) {
	return JSON.stringify({"fulfillmentText": chat});
}