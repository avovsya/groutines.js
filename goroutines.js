function Channel() {
    this.data = [];
    this.receiver;
}

Channel.prototype.send = function (data) {
    this.data.push(data);
}

Channel.prototype.receive = function () {
    return this.data.shift();
}

Channel.prototype.hasData = function () {
    return this.data.length > 0;
}

/*
 * Wait for channel to get data, and then - execute function
 */
function go(fn, channel, done) {
    function next () {
        var ret = false;
        setImmediate(function () {
            if(channel.hasData()) {
                var ret = fn(channel);
                if (done) {
                    if (ret) {
                        done(true);
                    } else {
                        done(false);
                    }
                }
            } else {
                next();
            }
        });
    }
    next();
}

/*
 * Execute function repeatedly, each time as channel receives data. If function
 * returned "true" - stop
 */
function gfor(fn, ch) {
    var done = false,
        doneStatus = false,
        immediateId;

    go(fn, ch, function (result) {
        done = true;
        doneStatus = result;
    });

    function next() {
        immediateId = setImmediate(function () {
            if (done && !doneStatus) {
                go(fn, ch, function (result) {
                    done = true;
                    doneStatus = result;
                });
                return next();
            }

            if (!done) {
                return next();
            }

            clearImmediate(immediateId);

        });
    }
    next();
}

module.exports = {
    Channel: Channel,
    go: go,
    gfor: gfor
};
