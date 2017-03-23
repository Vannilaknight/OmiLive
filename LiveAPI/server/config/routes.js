var magicbus = require('magicbus'),
    request = require('request');

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

    app.get('/start', function (req, res) {
        processData();
        res.sendStatus(200);
    });

    app.get('/stop', function (req, res) {
        stopData();
        res.sendStatus(200);
    });
};

function processData() {
    stop = setInterval(function () {
        request("http://slc-ne:3002/metrics/metrics", function (err, response, body) {
            var data = JSON.parse(body);
            var metrics = {
                version: data.version,
                gauges: {
                    buffers: {
                        direct: {
                            capacity: data.gauges["buffers.direct.capacity"].value,
                            count: data.gauges["buffers.direct.count"].value,
                            used: data.gauges["buffers.direct.used"].value
                        },
                        mapped: {
                            capacity: data.gauges["buffers.mapped.capacity"].value,
                            count: data.gauges["buffers.mapped.count"].value,
                            used: data.gauges["buffers.mapped.used"].value
                        }
                    },
                    gc: {
                        PSMarkSweep: {
                            time: data.gauges["gc.PS-MarkSweep.time"].value,
                            count: data.gauges["gc.PS-MarkSweep.count"].value
                        },
                        PSScavenge: {
                            time: data.gauges["gc.PS-Scavenge.time"].value,
                            count: data.gauges["gc.PS-Scavenge.count"].value
                        }
                    },
                    memory: {
                        heap: {
                            committed: data.gauges["memory.heap.committed"].value,
                            init: data.gauges["memory.heap.init"].value,
                            max: data.gauges["memory.heap.max"].value,
                            usage: data.gauges["memory.heap.usage"].value,
                            used: data.gauges["memory.heap.used"].value
                        },
                        nonHeap: {
                            committed: data.gauges["memory.non-heap.committed"].value,
                            init: data.gauges["memory.non-heap.init"].value,
                            max: data.gauges["memory.non-heap.max"].value,
                            usage: data.gauges["memory.non-heap.usage"].value,
                            used: data.gauges["memory.non-heap.used"].value
                        },
                        pools: {
                            codeCache: {
                                committed: data.gauges["memory.pools.Code-Cache.committed"].value,
                                init: data.gauges["memory.pools.Code-Cache.init"].value,
                                max: data.gauges["memory.pools.Code-Cache.max"].value,
                                usage: data.gauges["memory.pools.Code-Cache.usage"].value,
                                used: data.gauges["memory.pools.Code-Cache.used"].value
                            },
                            compressedClassSpace: {
                                committed: data.gauges["memory.pools.Compressed-Class-Space.committed"].value,
                                init: data.gauges["memory.pools.Compressed-Class-Space.init"].value,
                                max: data.gauges["memory.pools.Compressed-Class-Space.max"].value,
                                usage: data.gauges["memory.pools.Compressed-Class-Space.usage"].value,
                                used: data.gauges["memory.pools.Compressed-Class-Space.used"].value
                            },
                            metaSpace: {
                                committed: data.gauges["memory.pools.Metaspace.committed"].value,
                                init: data.gauges["memory.pools.Metaspace.init"].value,
                                max: data.gauges["memory.pools.Metaspace.max"].value,
                                usage: data.gauges["memory.pools.Metaspace.usage"].value,
                                used: data.gauges["memory.pools.Metaspace.used"].value
                            },
                            PSEdenSpace: {
                                committed: data.gauges["memory.pools.PS-Eden-Space.committed"].value,
                                init: data.gauges["memory.pools.PS-Eden-Space.init"].value,
                                max: data.gauges["memory.pools.PS-Eden-Space.max"].value,
                                usage: data.gauges["memory.pools.PS-Eden-Space.usage"].value,
                                used: data.gauges["memory.pools.PS-Eden-Space.used"].value
                            },
                            PSOldGen: {
                                committed: data.gauges["memory.pools.PS-Old-Gen.committed"].value,
                                init: data.gauges["memory.pools.PS-Old-Gen.committed"].value,
                                max: data.gauges["memory.pools.PS-Old-Gen.committed"].value,
                                usage: data.gauges["memory.pools.PS-Old-Gen.committed"].value,
                                used: data.gauges["memory.pools.PS-Old-Gen.committed"].value
                            },
                            PSSurvivorSpace: {
                                committed: data.gauges["memory.pools.PS-Survivor-Space.committed"].value,
                                init: data.gauges["memory.pools.PS-Survivor-Space.init"].value,
                                max: data.gauges["memory.pools.PS-Survivor-Space.max"].value,
                                usage: data.gauges["memory.pools.PS-Survivor-Space.usage"].value,
                                used: data.gauges["memory.pools.PS-Survivor-Space.used"].value
                            }
                        },
                        total: {
                            committed: data.gauges["memory.total.committed"].value,
                            init: data.gauges["memory.total.init"].value,
                            max: data.gauges["memory.total.max"].value,
                            used: data.gauges["memory.total.used"].value
                        }
                    },
                    threads: {
                        blockedCount: data.gauges["threads.blocked.count"].value,
                        count: data.gauges["threads.count"].value,
                        deadlockCount: data.gauges["threads.deadlock.count"].value,
                        deadlocks: data.gauges["threads.deadlocks"].value,
                        newCount: data.gauges["threads.new.count"].value,
                        runnableCount: data.gauges["threads.runnable.count"].value,
                        terminatedCount: data.gauges["threads.terminated.count"].value,
                        timedWaitingCount: data.gauges["threads.timed_waiting.count"].value,
                        waitingCount: data.gauges["threads.waiting.count"].value
                    }
                },
                counters: data.counters,
                histogram: data.histogram,
                meters: data.meters,
                timers: {}
            };

            for (var key in data.timers) {
                createObject(metrics.timers, key, data.timers[key]);
            }
            publisher.publish('metrics', {data: metrics});
            console.log('Metrics sent')
        })
    }, 5000);
}

function stopData() {
    clearInterval(stop);
}

function createObject(model, name, value) {
    var nameParts = name.split("."),
        currentObject = model;
    for (var i in nameParts) {
        var part = nameParts[i];
        if (i == nameParts.length-1) {
            currentObject[part] = value;
            break;
        }
        if (typeof currentObject[part] == "undefined") {
            currentObject[part] = {};
        }
        currentObject = currentObject[part];
    }
};