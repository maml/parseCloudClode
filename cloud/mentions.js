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
    (users.length > 0) ? notify(users) : null;
  });

}

function notify(users) {
  // send push notification to each user letting them know they were mentioned in a blurb
  console.log("send push to users");
}
