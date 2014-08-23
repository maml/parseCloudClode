var mentioner, mentionee, blurb;

exports.notify = function(request, response) {
  if (request.object.get("type") == "mention") {
    getActivity(request).then(function(activity){
      pushMention(activity, response);
    });
  }

  if (request.object.get("type") == "like") {
    getActivity(request).then(function(activity){
      pushLike(activity, response);
    });
  }

  if (request.object.get("type") == "follow") {
    getActivity(request).then(function(activity){
      pushFollow(activity, response);
    });
  }
}

function getActivity(request) {

  var promise = new Parse.Promise();
  var Activity = Parse.Object.extend("Activity");

  var query = new Parse.Query(Activity);
  query.include("fromUser");
  query.include("toUser");
  (request.object.get("type") == "like") ? query.include("blurb") : null;

  query.get(request.object.id).then(function(activity){
    promise.resolve(activity);
  });
  return promise;

}

function pushFollow(activity, response) {

  follower = activity.get("fromUser");
  followee = activity.get("toUser");

  var message = "@" + follower.get("username") + " started following you."

  var query = new Parse.Query(Parse.Installation);
  query.equalTo('user', followee);

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


function pushLike(activity, response) {

  liker = activity.get("fromUser");
  likee = activity.get("toUser");
  blurb = activity.get("blurb");

  var message = "@" + liker.get("username") + " liked your blurb, " + blurb.get("title");

  var query = new Parse.Query(Parse.Installation);
  query.equalTo("user", likee);

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
