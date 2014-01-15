var go = require('./goroutines');

function main () {
    var channel = new go.Channel(),
        testCh = new go.Channel();

    // Cake packer
    go(function (ch, testCh) {
        var cakesPacked = 0,
            cake;
        while (true) {
            cake = ch.receive();
            if (++cakesPacked === 3) {
                testCh.send(cake);
            } else {
                console.log(" + + + Packing " + cake);
            }
        }
    }, channel, testCh);

    // Cake tester
    go(function (ch, testCh) {
        while (true) {
            var cake = testCh.receive();
            
            setTimeout(function () {
                console.log(cake + " is good! Pack it!");
                ch.send(cake);
            }, 2000);
        }
    }, channel, testCh);

    // Cake maker
    for(var i = 0; i < 5; i++) {
        (function (i) {
            setTimeout(function () {
                console.log("> Making apple cake # " + i);
                channel.send("Apple cake " + i);
            }, i * 1000);
        })(i);
    }

}

main();
