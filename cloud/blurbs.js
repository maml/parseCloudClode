var mentioner;
var activities = require('cloud/activities.js');

exports.extractMentions = function(request, response) {

  blurb = request.object;

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
    mentioner = user;
    return getMentionedUsers(mentionedUsersNames);
  }).then(function(users){
    createActivityForMentionsForUsers(users);
  }, function(error){
    console.log("there was an error: " + error.code + " " + error.message);
  });
}

function createActivityForMentionsForUsers(users)
{
  users.forEach(function(user){
    var params = {"mentioner" : mentioner, "mentionee" : user, "blurb" : blurb};
    activities.createMention(params);
  });
}

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
