/*
  This method is called on afterSave of an Activity. We first get the activity that was just saved.
  Then, we look to see if there's a notification in the database for this activity. If there is that
  means a notification has already been pushed for this activity and we do nothing. If there is not
  that means we haven not yet sent a push notification so we create a notification for the activity. If
  the notification successfully saves, then a push notification is sent.

  The Notification class exists as a way to determine wether or not a particular activity has had a push
  notification sent out for it and to send a push notification for a given activity, if needed.
*/

exports.notify = function(request, response) {

  var returnedActivity;

  getActivity(request).then(function(activity){
    returnedActivity = activity;
    return getNotification(activity);
  }).then(function(notification){
    if (notification === undefined) {
      recordNotificationForActivity(returnedActivity);
    }
  }, function(error){
    console.log(error.code + " " + error.message);
  });

}

/*
  A promise that gets an instance of an Activity from a request object
*/

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

/*
  A promise that gets the first notification for a given activity.
*/

function getNotification(activity)
{
  var promise = new Parse.Promise();
  var Notification = Parse.Object.extend("Notification");

  var query = new Parse.Query(Notification);
  query.equalTo("fromUser", activity.get("fromUser"));
  query.equalTo("toUser", activity.get("toUser"));
  query.equalTo("blurb", activity.get("blurb"))
  query.equalTo("type", activity.get("type"));

  query.first().then(function(notification){
    promise.resolve(notification);
  });
  return promise;
}

/*
  Creates an instance of a Notification for a given activity. If successfull it will make
  a call to send a push notification.
*/

function recordNotificationForActivity(activity) {
  var Notification = Parse.Object.extend("Notification");
  var notification = new Notification();
  notification.set("type", activity.get("type"));
  notification.set("fromUser", activity.get("fromUser"));
  notification.set("toUser", activity.get("toUser"));
  notification.set("blurb", activity.get("blurb"));
  notification.save(null, {
    success: function(activity) {
      console.log("Notification has been created with objectId: " + notification.id);
      (activity.get("type") == "like") ? pushLike(activity) : null;
      (activity.get("type") == "follow") ? pushFollow(activity) : null;
      (activity.get("type") == "mention") ? pushMention(activity) : null;
    },
    error: function(activity, error) {
      console.log("Failed to create new activity, with error: " + error.message);
    }
  });
}

/*
  Push methods
*/

function push(query, message) {
  Parse.Push.send({
    where: query,
    data: {
      alert: message,
      badge: "Increment",
      sound: "push-notification.aiff"
    }
  });
}

function pushFollow(activity) {
  var message = messageForFollow(activity);
  var query = queryForPush(activity);
  push(query, message);
}

function pushLike(activity) {
  var message = messageForLike(activity);
  var query = queryForPush(activity);
  push(query, message);
}

function pushMention(activity) {
  var message = messageForMention(activity);
  var query = queryForPush(activity);
  push(query, message);
}

/*
  Query for Push Notification
*/

function queryForPush(activity) {
  var query = new Parse.Query(Parse.Installation);
  query.equalTo("user", activity.get("toUser"));
  return query;
}

/*
  Messages for Push Notification
*/

function messageForFollow(activity) {
  var message = "@" + activity.get("fromUser").get("username") + " started following you.";
  return message;
}

function messageForLike(activity) {
  var message = "@" + activity.get("fromUser").get("username") + " liked your blurb, " + activity.get("blurb").get("title");
  return message;
}

function messageForMention(activity) {
  var message = "@" + activity.get("fromUser").get("username") + " mentioned you in a blurb.";
  return message;
}
