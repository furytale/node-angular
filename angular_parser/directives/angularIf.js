'use strict';
var compilerHelper = require('./../compilerHelper');

var angularIf = {
    runCommand: '',
    runCommandParams: {},
    /**
     * WARNING - 'init' is 'must have' function and is called from directive helper
     * @param text
     * @returns {*}
     */
    init: function (text) {
        if (text && text.length) {
            angularIf.runCommandParams = text;
            return angularIf;
        }
        return false;
    },

    setCondition: function (value) {
        if (value instanceof Error) return value;
        var intCondition = parseInt(value, 10);
        if (!isNaN(intCondition)) {
            return intCondition;
        }
        if (value === 'true') return 1;
        if (value === 'false') return 0;
        if (value.length) return value;
    },
    /**
     * WARNING - 'apply' is 'must have' function and is called from compiler
     * @returns {*}
     */
    apply: function () {
        var dataArgs     = arguments[0] ? arguments[0] : null;
        var dataChildDom = arguments[1] ? arguments[1] : null;
        var callback     = arguments[2] ? arguments[2] : null;
        if (!dataArgs && !dataChildDom && (!callback || typeof callback !== 'function')) {
            return compilerHelper.throwException('BAD_PARAM', '[angularIf]');
        }
        var condition = angularIf.setCondition(
            compilerHelper.wrapInterpolate(angularIf.runCommandParams, dataArgs.data)
        );
        return condition ?
            ((condition instanceof Error) ?
                condition : callback(dataChildDom, dataArgs.data, '')) :
                '';
    }
};

module.exports = angularIf;