var mentioner;

exports.extractMentions = function(request, response) {

  // blurb user's objectId
  var blurbAuthorUserId = request.object.get("user").id;

  // match mentions from blurb's title
  var blurbTitle = request.object.get("title");
  var mentionedUsers = blurbTitle.match(/@\w+/g);

  // remove the @ from each mentioned user
  mentionedUsersNames = mentionedUsers.map(function(user) {
    return user.replace("\@", "");
  });

  getBlurbAuthorUserName(blurbAuthorUserId).then(function(user){
    mentioner = user; // :-/
    return getMentionedUsers(mentionedUsersNames);
  }).then(function(users){
    (users.length > 0) ? notify(users) : null;
  }, function(error){
    console.log("there was an error: " + error.code + " " + error.message);
  });
}

// so we can have a message that goes like, "@so-and-so mentioned you . . ."
function getBlurbAuthorUserName(id) {
  var promise = new Parse.Promise();
  var query = new Parse.Query(Parse.User);
  query.get(id).then(function(user){
    promise.resolve(user);
  });
  return promise;
}

// returns the objectified users that were mentioned
function getMentionedUsers(mentionedUsersNames) {
  var promise = new Parse.Promise();
  var query = new Parse.Query(Parse.User);
  query.containedIn("username", mentionedUsersNames);
  query.find().then(function(users) {
    promise.resolve(users);
  });
  return promise;
}

// notifications should be broken out into their own module
function notify(users) {

  var message = "@" + mentioner.get("username") + " mentioned you in a blurb."

  var query = new Parse.Query(Parse.Installation);
  query.containedIn('user', users);

  Parse.Push.send({
    where: query,
    data: {
      alert: message,
      badge: "Increment",
      sound: "push-notification.aiff"
    }
  }).then(function() {
    console.log("push was successful");
  }, function(error) {
    console.log("there was an error sending the push: " + error.code + " " + error.message);
  });

}
