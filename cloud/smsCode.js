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
