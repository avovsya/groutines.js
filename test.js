var Channel = require('./goroutines').Channel,
    go = require('./goroutines').go,
    gfor = require('./goroutines').gfor,

    cakes = 0;

function main() {
    var ch = new Channel();

    gfor(receiveCakeAndPack, ch);
    for (var i = 0; i < 5; i++) {
        makeCakeAndSend(ch);
    }
}

function makeCakeAndSend(ch) {
    cakes++;
    var cakeName = "Strawberry Cake " + cakes;
    console.log("Making a cake and sending... " + cakeName);
    ch.send(cakeName);
}

function receiveCakeAndPack(ch) {
    var cake = ch.receive();
    console.log("Packing received cake: " + cake);
}

main();
