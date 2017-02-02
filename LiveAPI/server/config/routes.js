var magicbus = require('magicbus');
var broker = magicbus.createBroker('domainOne', 'API', 'amqp://guest:guest@localhost/');
var publisher = magicbus.createPublisher(broker);
console.log('Publisher created');
var stop;

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('health', function (req, res) {
        res.sendStatus(200)
    });

    app.get('/data', function (req, res) {
        processDataOne();
        processDataTwo();
        res.sendStatus(200);
    });
};

function processDataOne() {
    setInterval(function () {
        var rand = Math.random();
        publisher.publish('dataFlowOne', {num: (rand * 1000).toFixed(2)});
        console.log('dataOne sent')
    }, 5000);
}

function processDataTwo() {
    setInterval(function () {
        var rand = Math.random();
        publisher.publish('dataFlowTwo', {num: (rand * 1000).toFixed(2)});
        console.log('dataTwo sent')
    }, 3000);
}
