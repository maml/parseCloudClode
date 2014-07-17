var code = [];
var message;
var phoneNumber;
var SMSCode = Parse.Object.extend("SMSCode");

var twilio = require("twilio");
twilio.initialize("ACe7c2b91203350d82da8e09596e07959d","c77d656ed20c198c5e938a2f46b5037b");

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateCode() {
    for (var i = 0; i < 6; i++) {
        code[i] = randomIntFromInterval(1, 9);
    }
    code = code.join("");
}

function codeMessage() {
    message = "Your code is " + code;
}

exports.sendSMSVerification = function(request, response) {
  phoneNumber = request.params.number;
  generateCode();
  codeMessage();
  twilio.sendSMS({
    From: "+17082776170",
    To: phoneNumber,
    Body: message
  }, {
    success: function(httpResponse) {
      response.success("SMS sent!");
      var smsCode = new SMSCode();
      smsCode.set("code", code);
      smsCode.set("phoneNumber", phoneNumber);
      smsCode.set("verified", false);
      smsCode.save(null, {
        success: function(smsCode) {
          // we saved it
        },
        error: function(smsCode, error) {
          // nope
        }
      });
    },
    error: function(httpResponse) { response.error("Uh oh, something went wrong"); }
  });
}
