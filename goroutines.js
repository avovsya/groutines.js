var Fiber = require('fibers');

function go(fn) {
    var args = arguments;
    var fiber = Fiber(function () {
        fn.apply(fiber, Array.prototype.slice.call(args, 1));
    });
    fiber.yield = Fiber.yield;
    fiber.run();
}

go.run = function () {
    Fiber.current.run();
}

go.yield = function () {
    Fiber.yield();
}

function Channel() {
    this._data = [];
    this.hasData = false;
}

Channel.prototype.send = function (data) {
    this._data.push(data);
    this.hasData = true;
}

Channel.prototype.receive = function () {
    var _this = this,
        fiber = Fiber.current;

    if (!fiber) {
        throw new Error('Can\'t receive data not in goroutine');
    }

    function receiveData () {
        if (_this._data.length === 1) { _this.hasData = false; }
        return _this._data.shift();
    }

    function next () {
        setImmediate(function () {
            if (_this.hasData) {
                fiber.run();
            } else {
                next();
            }
        });
    }

    if (this.hasData) {
        return receiveData();
    } else {
        next();
        Fiber.yield();
        return receiveData();
    }
}

go.Channel = Channel;

module.exports = go;
