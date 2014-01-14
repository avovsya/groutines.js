function Channel() {
    this._data = [];
    this.data = false;
}

Channel.prototype.send = function (data) {
    this._data.push(data);
    this.data = true;
}

Channel.prototype.receive = function () {
    var result = this._data.shift();
    if (this._data.length === 0) this.data = false;
    return result;
}

module.exports = Channel;
