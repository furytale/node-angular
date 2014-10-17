'use strict';
var compilerHelper = require('./../compilerHelper');

var currencyUAH = function (string) {
    try {
        var currencyFilter = require('./currency');
    } catch (err) {
        return compilerHelper.throwException('REQUIRE_ERR', './currency');
    }
    var numberArray = [],
        number = (string || string === 0) ? string.toString().replace(/,/g, '.') : '';
    numberArray =  number.toString().split('.');
    number = numberArray[0] + (numberArray[1] ? '.' + numberArray[1].slice(0, 2) : '');
    number = parseFloat(number);
    if (isNaN(number) || !isFinite(number)) {
        number = 0;
    }
    number = (number < 0 ? '-' : '') +
        currencyFilter(Math.abs(number), '').replace(/,/g, ' ').replace(/\./, ',');
    return number;
};

module.exports = currencyUAH;
