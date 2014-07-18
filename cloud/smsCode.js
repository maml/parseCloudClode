/*
  After save we want to check and see if verified is true. If it is it means
  the code's been sent back by a phone and we no longer need the instance around.
  These objects are not associated with any other objects so we just blast'em
  away.
*/

exports.afterSave = function(request) {

  var SMSCode = Parse.Object.extend("SMSCode");
  var query = new Parse.Query(SMSCode);

  query.get(request.object.id, {
      success: function(smsCode) {
        if (smsCode.get("verified")) {
          destroy(smsCode);
        }
      },
      error: function(smsCode, error) {
        console.error("Error finding " + smsCode + error.code + ": " + error.message);
      }
  });
}

/*
  Before save we want to check the soon-to-be-saved record's phone number and see if there's
  any smsCode instances that already exist with that number. If there are they should be deleted.
  There should only be one smsCode associated with a phone number at any given time.
*/
exports.beforeSave = function(request, response) {

  var SMSCode = Parse.Object.extend("SMSCode");
  var query = new Parse.Query(SMSCode);
  query.equalTo("phoneNumber", request.object.get("phoneNumber"));
  query.find({
    success: function(smsCodes) {
      if (smsCodes.length > 0) {
        smsCodes.forEach(function(smsCode) {
          destroy(smsCode);
        });
      }
      response.success();
    },
    error: function(error) {
      console.log("There was an error querying for smsCodes: " + error.code + " " + error.message);
    }
  });
}

exports.verifyCode = function(request, response) {

  var SMSCode = Parse.Object.extend("SMSCode");
  var query = new Parse.Query(SMSCode);

  query.equalTo("phoneNumber", request.params.phoneNumber);
  query.equalTo("verificationCode", request.params.verificationCode);

  query.find().then(function(smsCodes){

    /*
      Once the code's been verified it's no longer needed. It's up to the client application
      to hold a reference to the phone number, or any other data relating to this instance,
      if needed.
    */
    var promise = Parse.Promise.as();
    smsCodes.forEach(function(smsCode) {
      promise = promise.then(function() {
        return smsCode.destroy();
      });
    });
    return promise;

  }).then(function() {

    response.success("done");

  }, function(error){

    console.log("There was an error querying for the smsCodes: " + error.code + " " + error.message);
    response.error(error);

  });
}

/*
  Helpers
*/
function destroy(obj) {
  obj.destroy({
    success: function(obj) {
      console.log("deleted an object");
    },
    error: function(obj, error) {
      console.error("Error deleting " + obj + error.code + ": " + error.message);
    }
  });
}
