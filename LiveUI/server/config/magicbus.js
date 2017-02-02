var magicbus = require('magicbus');

var broker = magicbus.createBroker('domainTwo', 'UI', 'amqp://guest:guest@localhost/');
var subscriber = magicbus.createSubscriber(broker);


module.exports = function (server) {
    var io = require('socket.io')(3029);

    io.on('connection', function (socket) {
        console.log("io connected");

        subscriber.on('dataFlowOne', function (eventName, data, rawMessage) {
            console.log('Data One Collected!');
            socket.emit('freshDataOne', data);
        });

        subscriber.on('dataFlowTwo', function (eventName, data, rawMessage) {
            console.log('Data Two Collected!');
            socket.emit('freshDataTwo', data);
        });

        subscriber.startSubscription();
        console.log("Subscriber started")
    });

};