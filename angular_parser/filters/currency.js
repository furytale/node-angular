'use strict';

/**
 * native angular currency module
 */
var underscore = require('underscore');

/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/locale.js
 * @line 18
 */
var $locale = {
    NUMBER_FORMATS: {
        DECIMAL_SEP: '.',
        GROUP_SEP: ',',
        PATTERNS: [
            { // Decimal Pattern
                minInt: 1,
                minFrac: 0,
                maxFrac: 3,
                posPre: '',
                posSuf: '',
                negPre: '-',
                negSuf: '',
                gSize: 3,
                lgSize: 3
            },
            { //Currency Pattern
                minInt: 1,
                minFrac: 2,
                maxFrac: 2,
                posPre: '\u00A4',
                posSuf: '',
                negPre: '(\u00A4',
                negSuf: ')',
                gSize: 3,
                lgSize: 3
            }
        ],
        CURRENCY_SYM: '$'
    }
};

/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/filter/filters.j
 * @line 130
 */
function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
    var DECIMAL_SEP = '.';
    if (!isFinite(number) || underscore.isObject(number)) {
        return '';
    }

    var isNegative = number < 0;
    number = Math.abs(number);
    var numStr = number + '',
        formatedText = '',
        parts = [];

    var hasExponent = false;
    if (numStr.indexOf('e') !== -1) {
        var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
        if (match && match[2] === '-' && match[3] > fractionSize + 1) {
            numStr = '0';
            number = 0;
        } else {
            formatedText = numStr;
            hasExponent = true;
        }
    }

    if (!hasExponent) {
        var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;

        // determine fractionSize if it is not specified
        if (underscore.isUndefined(fractionSize)) {
            fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
        }

        // safely round numbers in JS without hitting imprecisions of floating-point arithmetics
        // inspired by:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
        number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);

        if (number === 0) {
            isNegative = false;
        }

        var fraction = ('' + number).split(DECIMAL_SEP);
        var whole = fraction[0];
        fraction = fraction[1] || '';

        var i, pos = 0,
            lgroup = pattern.lgSize,
        group      = pattern.gSize;

        if (whole.length >= (lgroup + group)) {
            pos = whole.length - lgroup;
            for (i = 0; i < pos; i++) {
                if ((pos - i) % group === 0 && i !== 0) {
                    formatedText += groupSep;
                }
                formatedText += whole.charAt(i);
            }
        }

        for (i = pos; i < whole.length; i++) {
            if ((whole.length - i) % lgroup === 0 && i !== 0) {
                formatedText += groupSep;
            }
            formatedText += whole.charAt(i);
        }

        // format fraction part.
        while (fraction.length < fractionSize) {
            fraction += '0';
        }

        if (fractionSize && fractionSize !== '0') {
            formatedText += decimalSep + fraction.substr(0, fractionSize);
        }
    } else {

        if (fractionSize > 0 && number > -1 && number < 1) {
            formatedText = number.toFixed(fractionSize);
        }
    }

    parts.push(isNegative ? pattern.negPre : pattern.posPre);
    parts.push(formatedText);
    parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
    return parts.join('');
}

/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/filter/filters.j
 * @line 51
 */
function currencyFilter($locale) {
    var formats = $locale.NUMBER_FORMATS;
    return function (amount, currencySymbol) {
        if (underscore.isUndefined(currencySymbol)) {
            currencySymbol = formats.CURRENCY_SYM;
        }
        // if null or undefined pass it through
        return (amount === null) ?
            amount :
            formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2)
            .replace(/\u00A4/g, currencySymbol);
    };
}

module.exports = currencyFilter($locale);