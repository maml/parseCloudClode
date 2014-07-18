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
  Mentions
*/
var mentions = require('cloud/mentions.js');
// AudioClip will be renamed to Blurb, eventually.
Parse.Cloud.afterSave("AudioClip", function(request, response) {
  mentions.extractMentions(request, response);
});
