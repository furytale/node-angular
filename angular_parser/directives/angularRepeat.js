'use strict';
var compilerHelper = require('./../compilerHelper'),
    underscore     = require('underscore');

var angularRepeat = {
    runCommand: '',
    runCommandParams: {},
    /**
     * WARNING - 'init' is 'must have' function and is called from directive helper
     * @param text
     * @returns {*}
     */
    init: function (text, dataScope) {
        var evalData;
        if (underscore.size(dataScope)) {
            /* source: https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js */
            var match       = text.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            if (!match) {
                return compilerHelper.throwException(
                    'IEXP', '[angularRepeat] Expected expression in form of "_item_ in _collection_[ track by _id_]" but got "{0}".'
                );
            }
            var lhs         = match[1],
                rhs         = match[2],
                aliasAs     = match[3],
                trackByExp  = match[4];
            if (evalData = compilerHelper.wrapInterpolate(rhs, dataScope)) {
                try {
                    evalData = JSON.parse(evalData);
                } catch (err) {
                    return err;
                }
                if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) ||
                    /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent)$/.test(aliasAs))) {
                    return compilerHelper.throwException(
                        'IEXP', "[angularRepeat] alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name."
                    );
                }
                match           = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
                if (!match) {
                    return compilerHelper.throwException(
                        'IEXP', "[angularRepeat] '_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'."
                    );
                }
                var valueIdentifier = match[3] || match[1],
                    keyIdentifier   = match[2];
                if (aliasAs) {
                    dataScope[aliasAs] = evalData;
                }
                if (trackByExp) {
                    // TODO $id(item) angular element hash function
                    evalData = angularRepeat.trackBy(trackByExp, evalData, dataScope, valueIdentifier);
                }
                angularRepeat.runCommand = 'ngRepeatKeyVal';
                angularRepeat.runCommandParams = {scope: dataScope, data: evalData, valIndent: valueIdentifier, keyIdent: keyIdentifier};
                return angularRepeat;
            } else {
                return compilerHelper.throwException('BAD_PARAM', "[angularRepeat] empty interpolate result");
            }
        } else {
            return compilerHelper.throwException('BAD_PARAM', "[angularRepeat] empty scope data");
        }
    },

    /**
     * WARNING - 'apply' is 'must have' function and is called from compiler
     * @returns {*}
     */
    apply: function () {
        if (angularRepeat.hasOwnProperty(angularRepeat.runCommand)) {
            return angularRepeat[angularRepeat.runCommand](arguments);
        }
    },

    trackBy: function (expresion, data, dataScope, loopKey) {
        var evalRes;
        var res = underscore.sortBy(data, function (val) {
            dataScope[loopKey] = val;
            evalRes = compilerHelper.wrapInterpolate(expresion, dataScope);
            return (evalRes instanceof Error) ?
                compilerHelper.throwError('BAD_PARAM', "[angularRepeat] empty interpolate result") :
                evalRes;
        });
        return res;
    },

    ngRepeatKeyVal: function () {
        var htmlString   = '',
            tmpResult    = null,
            args         = (arguments[0]) ? arguments[0] : null,
            dataChildDom = args[1] ? args[1] : null,
            callback     = args[2] ? args[2] : null,
            dataScope    = angularRepeat.runCommandParams.scope,
            data         = angularRepeat.runCommandParams.data,
            loopInd      = angularRepeat.runCommandParams.valIndent,
            loopKey      = angularRepeat.runCommandParams.keyIdent,
            index        = 0,
            dataSize     = underscore.size(data);
        if (!dataScope && !dataChildDom && !data && (!callback || typeof callback !== 'function')) {
            return compilerHelper.throwException('BAD_PARAM', '[angularRepeat]');
        }
        underscore.each(data, function (value, key) {
            dataScope[loopInd] = value;
            if (loopKey) {
                dataScope[loopKey] = key;
            }
            dataScope['$index']  = index;
            dataScope['$first']  = (index === 0) ? true : false;
            dataScope['$last']   = (dataSize === (index + 1)) ? true : false;
            dataScope['$middle'] = (!dataScope['$first'] && !dataScope['$last']) ? true : false;
            tmpResult            = callback(dataChildDom, dataScope, '');
            if (tmpResult instanceof Error) {
                return tmpResult;
            } else {
                htmlString += tmpResult;
            }
            index++;
        });
        return htmlString;
    }
};

module.exports = angularRepeat;