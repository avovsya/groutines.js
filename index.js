var Channel = require('./lib/channel');
/*
 * Listen to one or more channels. When the channel or channels received some
 * data - execute function
 * @fn: function to execute
 * [@done]: callback to execute when function completes. Pass the return value
 * of function to @done callback
 */
function go (fn, done) {
    var channels = [],
        callback,
        stop = false;

    if (typeof done === 'function') {
        channels = Array.prototype.slice.call(arguments, 2);
        callback = done;
    } else {
        channels = Array.prototype.slice.call(arguments, 1);
    }

    function next () {
        var functionResult;
        setImmediate(function () {
            for (var i = 0; i < channels.length; i++) {
                if (channels[i].data) {
                    channels[i].resolved = true;
                    functionResult = fn.apply(this, channels);
                    channels[i].resolved = false;
                    stop = true;
                    callback && callback(functionResult);
                    break;
                }
            }
            if (!stop) next();
        });
    }
    next();
}

/*
 * The same as 'go', except it will execute function repeatadely until it
 * return "true" value
 */
function gfor (fn) {
    var done = false,
        doneStatus = false,
        channels = Array.prototype.slice.call(arguments, 1),
        goArgs = [fn];

    goArgs.push(function next (result) {
        if (!result) go.apply(null, goArgs);
    });

    goArgs = goArgs.concat(channels);

    console.log(goArgs);
    go.apply(null, goArgs);
}

module.exports = {
    wait: go,
    for: gfor,
    Channel: Channel
};
