exports.extractMentions = function(request, response) {

  // match mentions from blurb's title
  var blurbTitle = request.object.get("title");
  var mentionedUsers = blurbTitle.match(/@\w+/g);

  // remove the @ from each mentioned user
  mentionedUsers = mentionedUsers.map(function(user) {
    return user.replace("\@", "");
  });

  // query for the mentioned users
  var query = new Parse.Query(Parse.User);
  query.containedIn("username", mentionedUsers);

  query.find().then(function(users) {
    (users.length > 0) ? notify(users, response) : null;
  });

}

function notify(mentionedUsers) {

  // send push notification to each user letting them know they were mentioned in a blurb
  var query = new Parse.Query(Parse.Installation);
  query.containedIn('user', mentionedUsers);

  Parse.Push.send({
    where: query,
    data: {
      alert: "(test push) you were mentioned in a blurb",
      badge: "Increment",
      sound: "push-notification.aiff"
    }
  }).then(function() {
    console.log("push was successful");
  }, function(error) {
    console.log("there was an error sending the push: " + error.code + " " + error.message);
  });

}
