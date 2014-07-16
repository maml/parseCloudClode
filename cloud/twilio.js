var twilio = require("twilio");
twilio.initialize("ACe7c2b91203350d82da8e09596e07959d","c77d656ed20c198c5e938a2f46b5037b");

exports.demoSMS = function(request, response) {
  twilio.sendSMS({
    From: "+17082776170",
    To: request.params.number,
    Body: "tincan sms test parse+twilio"
  }, {
    success: function(httpResponse) { response.success("SMS sent!"); },
    error: function(httpResponse) { response.error("Uh oh, something went wrong"); }
  });
}
