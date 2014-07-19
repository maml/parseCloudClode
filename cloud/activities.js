/*
  The platform supports activity types for likes, follows, and mentions. Likes and follows are
  created explicitly whereas a mention is an artifact of having created a blurb. Currently it's
  up to the client app to handle creating likes and follows but we'll use CloudCode's afterSave
  hook (on AudioClips) to handle creating mentions. We could expose all activity creation here,
  if we wanted.
*/

exports.createMention = function(params) {
  var Activity = Parse.Object.extend("Activity");
  var activity = new Activity();
  activity.set("type", "mention");
  activity.set("fromUser", params["mentioner"]);
  activity.set("toUser", params["mentionee"]);
  activity.set("blurb", params["blurb"]);
  activity.save(null, {
    success: function(activity) {
      console.log("New activity created with objectId: " + activity.id);
    },
    error: function(activity, error) {
      console.log("Failed to create new activity, with error: " + error.message);
    }
  });
}

exports.createLike = function(params) {
  throw new Error("Creating activities for likes is not currently supported by the platform");
}

exports.createFollow = function(params) {
  throw new Error("Creating activities for follows is not currently supported by the platform");
}
