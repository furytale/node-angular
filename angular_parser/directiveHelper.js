'use strict';
var underscore      = require('underscore'),
    fs              = require('fs'),
    compilerHelper  = require('./compilerHelper');

var directiveHelper = {
    directives: {
        // info about existing directives
        repeat: {
            ref: ['ng-repeat', 'ngrepeat'],
            func: 'angularRepeat'
        },
        if: {
            ref: ['ng-if', 'ngif'],
            func: 'angularIf'
        }
    },
    dirInstances: {}, // for storing the directive objects
    DIRECTIVE_DIR: '/directives',

    checkDirective: function (value) {
        var direciveIndex, activeDirective, keys;
        if (underscore.size(value)) {
            if (keys = underscore.keys(value)) {
                underscore.each(keys, function (keyVal) {
                    underscore.each(directiveHelper.directives, function (arrayVal, key) {
                        direciveIndex = underscore.indexOf(arrayVal.ref, keyVal);
                        if (direciveIndex >= 0) {
                            activeDirective = {name: directiveHelper.directives[key].func, key: keyVal};
                        }
                    });
                });
            }
        }
        return activeDirective;
    },

    loadDirective: function (directiveInst, params, data) {
        if (!directiveHelper.dirInstances[directiveInst.name]) {
            var path        = __dirname + directiveHelper.DIRECTIVE_DIR + '/' + directiveInst.name + '.js',
                requirePath = '.' + directiveHelper.DIRECTIVE_DIR + '/' + directiveInst.name;
            if (fs.existsSync(path)) {
                try {
                    directiveHelper.dirInstances[directiveInst.name] = require(requirePath);
                } catch (err) {
                    return compilerHelper.throwException('REQUIRE_ERR', requirePath);
                }
                return directiveHelper.initDirectory(directiveInst.name, params, directiveInst, data);
            } else {
                return false;
            }
        } else {
            return directiveHelper.initDirectory(directiveInst.name, params, directiveInst, data);
        }
    },

    initDirectory: function (dirName, params, directiveInst, data) {
        try {
            return directiveHelper.dirInstances[dirName].init(params[directiveInst.key], data);
        } catch (err) {
            return compilerHelper.throwException('DIRECTORY_INIT', dirName);
        }
    },

    destruct: function () {
        directiveHelper.dirInstances = {};
    }
};

module.exports = directiveHelper;