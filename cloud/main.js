/*
  SMSCode
*/
var smsCode = require('cloud/smsCode.js');
Parse.Cloud.afterSave("SMSCode", smsCode.afterSave);
Parse.Cloud.beforeSave("SMSCode", smsCode.beforeSave);
Parse.Cloud.define("verifyCode", function(request, response) {
  smsCode.verifyCode(request, response);
});

/*
  Twilio
*/
var twilio = require('cloud/twilio.js');
Parse.Cloud.define("sendSMSVerification", function(request, response) {
  twilio.sendSMSVerification(request, response);
});

/*
  Blurbs
*/
var blurbs = require('cloud/blurbs.js');
// AudioClip will be renamed to Blurb, eventually.
Parse.Cloud.afterSave("AudioClip", function(request, response) {
  blurbs.extractMentions(request, response);
});

/*
  Activities
*/
var notifications = require('cloud/notifications.js');
var audioClips = require('cloud/blurbs.js');
Parse.Cloud.afterSave("Activity", function(request, response) {
  notifications.notify(request, response);
  audioClips.incrementLikeCount(request, response);
});
Parse.Cloud.afterDelete("Activity", function(request, response) {
  audioClips.decrementLikeCount(request, response);
})
