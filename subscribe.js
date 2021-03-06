var PubNub = require('pubnub')
require('dotenv').config();

pubnub = new PubNub({
    publishKey : process.env.PUBNUB_PUBLISH_KEY,
    subscribeKey : process.env.PUBNUB_SUBSCRIBE_KEY
})

function callback(msg){
  if(typeof msg.message.action !== undefined){

    switch (msg.message.action) {
      case "capture":
        var duration = msg.message.duration;
        const { spawn } = require('child_process');
        const pyProg = spawn('python', ['capture.py', duration]);

        pyProg.stdout.on('data', function(data) {

            console.log(data.toString());
            console.log('subscriber waiting . . .')
        });

        break;
      default:
        console.log("ERROR : Illegal action provided");
    }
  }
};

function subscribe() {

    pubnub.addListener({
        status: function(statusEvent) {
            if (statusEvent.category === "PNConnectedCategory") {
                console.log("Connected, Subscriber waiting . . .");
            }
        },
        message: function(msg) {
            console.log('Message Received');
            console.log(msg.message)
            callback(msg);
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })
    console.log("Connecting . . .");
    pubnub.subscribe({
        channels: [process.env.PUBNUB_CHANNEL]
    });

};

subscribe();
