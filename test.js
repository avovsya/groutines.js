var go = require('./index');

    acakes = 0,
    scakes = 0,
    cakesPacked = 0;

function main() {
    var ch1 = new go.Channel(),
        ch2 = new go.Channel();

    go.for(receiveCakeAndPack, ch1, ch2);

    for (var i = 0; i < 3; i++) {
        makeStrawberryCakeAndSend(ch1);
    }
    makeAppleCakeAndSend(ch2);
    setTimeout(function () { makeStrawberryCakeAndSend(ch1) }, 1000);
    setTimeout(function () { makeAppleCakeAndSend(ch2) }, 1000);
}

function makeStrawberryCakeAndSend(ch) {
    scakes++;
    var cakeName = "Strawberry Cake " + scakes;
    console.log("Making a cake and sending... " + cakeName);
    ch.send(cakeName);
}

function makeAppleCakeAndSend(ch) {
    acakes++;
    var cakeName = "Apple Cake " + acakes;
    console.log("Making a cake and sending... " + cakeName);
    ch.send(cakeName);
}

function receiveCakeAndPack(ch1, ch2) {
    var cake;

    ch1.resolved && (cake = ch1.receive());
    ch2.resolved && (cake = ch2.receive());

    cakesPacked++;
    console.log("Packing received cake: " + cake);
    if (cakesPacked >= 2) return true;
}

main();
