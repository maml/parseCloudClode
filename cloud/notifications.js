var mentioner, mentionee, blurb;

exports.notify = function(request, response) {
  if (request.object.get("type") == "mention") {
    getActivity(request).then(function(activity){
      pushMention(activity, response);
    });
  }
}

function getActivity(request) {

  var promise = new Parse.Promise();
  var Activity = Parse.Object.extend("Activity");

  var query = new Parse.Query(Activity);
  query.include("fromUser");
  query.include("toUser");

  query.get(request.object.id).then(function(activity){
    promise.resolve(activity);
  });
  return promise;

}

function pushMention(activity, response) {

  mentioner = activity.get("fromUser");
  mentionee = activity.get("toUser");

  var message = "@" + mentioner.get("username") + " mentioned you in a blurb."

  var query = new Parse.Query(Parse.Installation);
  query.equalTo('user', mentionee);

  Parse.Push.send({
    where: query,
    data: {
      alert: message,
      badge: "Increment",
      sound: "push-notification.aiff"
    }
  }, function(error) {
    console.log("there was an error sending the push: " + error.code + " " + error.message);
  });
}
