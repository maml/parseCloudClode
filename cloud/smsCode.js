/*
  After save we want to check and see if verified is true. If it is it means
  the code's been sent back by a phone and we no longer need the instance around.
  These objects are not associated with any other objects so we just blast'em
  away.
*/

exports.afterSave = function(request) {
  query = new Parse.Query("SMSCode");
  query.get(request.object.get("smsCode").id, {
    success: function(smsCode) {
      if (smsCode.get("verified")) {
        smsCode.delete();
      }
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
}
