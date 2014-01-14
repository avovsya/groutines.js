var Channel = require('./goroutines').Channel,
    go = require('./goroutines').go,
    gfor = require('./goroutines').gfor,

    cakes = 0,
    cakesPacked = 0;

function main() {
    var ch = new Channel();

    gfor(receiveCakeAndPack, ch);
    for (var i = 0; i < 5; i++) {
        makeCakeAndSend(ch);
    }
    setTimeout(function () { makeCakeAndSend(ch) }, 1000);
    setTimeout(function () { makeCakeAndSend(ch) }, 2000);
    setTimeout(function () { makeCakeAndSend(ch) }, 3000);
}

function makeCakeAndSend(ch) {
    cakes++;
    var cakeName = "Strawberry Cake " + cakes;
    console.log("Making a cake and sending... " + cakeName);
    ch.send(cakeName);
}

function receiveCakeAndPack(ch) {
    var cake = ch.receive();
    cakesPacked++;
    console.log("Packing received cake: " + cake);
    if (cakesPacked >= 6) return true;
}

main();
