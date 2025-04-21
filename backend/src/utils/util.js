let seq = (min = 10000000, max = 99999999) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports.seq = seq;
