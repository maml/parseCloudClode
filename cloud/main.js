/*
  SMSCode
*/
var smsCode = require('cloud/smsCode.js');
Parse.Cloud.afterSave("SMSCode", smsCode.afterSave);
Parse.Cloud.beforeSave("SMSCode", smsCode.beforeSave);
Parse.Cloud.define("verifyCode", function(request, response) {
  smsCode.verifyCode(request, response);
});

/*
  Twilio
*/
var twilio = require('cloud/twilio.js');
Parse.Cloud.define("sendSMSVerification", function(request, response) {
  twilio.sendSMSVerification(request, response);
});

/*
  Mentions
*/

// Extract the user mentions
Parse.Cloud.define("extractMentions", function(request, response) {

    var blurbText = request.params.blurbText;
    var users = blurbText.match(/@\w+/g);
    var realUsers = 0;

    function queryComplete(){
        response.success(realUsers);
    }

    for (userIndex = 0; userIndex < users.length; userIndex++){
        users[userIndex] = users[userIndex].substr(1);

        var mentioned = Parse.Object.extend("User");
      var query = new Parse.Query(mentioned);
      query.equalTo("username",users[userIndex]);
      query.find({
        success: function(results){
         // Notify this user of the mention
             realUsers++;
        },
        error: function(error) {
         // This mention doesn't correspond to a username
        }
      });

        if(userIndex == users.length-1){
            queryComplete();
        }

    }

});
