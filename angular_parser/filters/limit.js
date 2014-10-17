'use strict';
var compilerHelper = require('./../compilerHelper'),
    underscore     = require('underscore');

var limit = function (object, limitTo) {
    var counter = 0,
        limitArray = {};
    underscore.each(object, function (val, key) {
        if (counter < limitTo) {
            limitArray[key] = val;
        }
        counter ++;
    });
    return limitArray;
};

module.exports = limit;