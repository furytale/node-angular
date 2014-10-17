'use strict';
var underscore    = require('underscore'),
    angularHelper = require('./lib/angularCore'),
    filterHelper  = require('./filterHelper');

var compilerHelper = {
    DirectiveErrors: {
        BAD_PARAM: 'bad params passed in directive',
        DIRECTORY_INIT: 'directory initialization error',
        REQUIRE_ERR: 'couldn\'t requre file',
        UNDEFINED_FOO: 'undefined'
    },
    BRACETS: {
        start: '{{',
        end: '}}'
    },

    lexer: function () {
        var lexer;
        if (!lexer) {
            try {
                lexer = new angularHelper.lexer({csp: true});
            } catch (err) {
                return err;
            }
        }
        return lexer;
    },

    parser: function () {
        var parser;
        if (!parser) {
            try {
                parser = new angularHelper.parser(compilerHelper.lexer(), filterHelper.init, {csp: true});
            } catch (err) {
                return err;
            }
        }
        return parser;
    },

    interpolate: function () {
        var interpolate;
        if (!interpolate) {
            try {
                interpolate = new angularHelper.interpolate();
            } catch (err) {
                return err;
            }
        }
        return interpolate;
    },

    interpolateInvoke: function () {
        var interpolateInst;
        if (!interpolateInst) {
            var interpolate = compilerHelper.interpolate();
            if (interpolate && interpolate.$get[3]) {
                interpolateInst = interpolate.$get[3];
            } else {
                return compilerHelper.throwException('UNDEFINED_FOO', 'interpolateInvoke');
            }
        }
        return interpolateInst;
    },

    /* !Be careful with the interpolation result, it cud be an Error instance */
    valueInterpolate: function (value, data) {
        try {
            var interpolate = compilerHelper.interpolateInvoke();
            if (interpolate instanceof Error) {
                return interpolate;
            }
            var res = interpolate(compilerHelper.parser())(value);
            return res(data, false, true);
        } catch (err) {
            return err;
        }
    },

    /* !Be careful with the interpolation result, it cud be an Error instance */
    wrapInterpolate: function (value, data) {
        try {
            var interpolate = compilerHelper.interpolateInvoke();
            if (interpolate instanceof Error) {
                return interpolate;
            }
            var res = interpolate(compilerHelper.parser())(
                    compilerHelper.BRACETS.start + value + compilerHelper.BRACETS.end
            );
            return res(data, false, true);
        } catch (err) {
            return err;
        }
    },

    /**
     *
     * @param attributes Html tag attributes
     * @param key Attribute key to remove
     * @returns {{}} Return filtered attributes
     */
    filterAttribs: function (attributes, key) {
        var newAttr = {};
        underscore.each(attributes, function (attrVal, attrKey) {
            if (attrKey !== key) {
                newAttr[attrKey] = attrVal;
            }
        });
        return newAttr;
    },

//    hashKey: function (obj, nextUidFn) {
//        var key = obj && obj.$$hashKey;
//
//        if (key) {
//            if (typeof key === 'function') {
//                key = obj.$$hashKey();
//            }
//            return key;
//        }
//
//        var objType = typeof obj;
//        if (objType === 'function' || (objType === 'object' && obj !== null)) {
//            key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
//        } else {
//            key = objType + ':' + obj;
//        }
//
//        return key;
//    },

    setDeepPath: function (count, DIR_SEP) {
        var i = 0, path = '';
        for (i = 0; i <= count; i++) {
            path += '..' + DIR_SEP;
        }
        return path;
    },

    throwException: function (code, msg) {
        var errMsg = compilerHelper.DirectiveErrors[code];
        if (msg) {
            errMsg += ' ' + msg;
        }
        return new Error(errMsg);
    },

    throwError: function (code, msg) {
        var errMsg = compilerHelper.DirectiveErrors[code];
        if (msg) {
            errMsg += ' ' + msg;
        }
        throw new Error(errMsg);
    },

    destructInstantData: function () {
        filterHelper.desctruct();
    }
};

module.exports = compilerHelper;