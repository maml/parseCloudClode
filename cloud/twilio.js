var code = [];
var message;
var twilio = require("twilio");
twilio.initialize("ACe7c2b91203350d82da8e09596e07959d","c77d656ed20c198c5e938a2f46b5037b");

exports.demoSMS = function(request, response) {
  generateCode();
  codeMessage();
  twilio.sendSMS({
    From: "+17082776170",
    To: request.params.number,
    Body: message
  }, {
    success: function(httpResponse) { response.success("SMS sent!"); },
    error: function(httpResponse) { response.error("Uh oh, something went wrong"); }
  });
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateCode() {
    for (var i = 0; i < 6; i++) {
        code[i] = randomIntFromInterval(1, 9);
    }
}

function codeMessage() {
    message = "Your code is " + code.join("");
}
