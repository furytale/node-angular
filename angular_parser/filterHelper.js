'use strict';
var compilerHelper = require('./compilerHelper'),
    fs             = require('fs'),
    filter         = null;

var filterHelper = {
    filterInstances : {}, // for storing the filter objects

    init: function (filterName, pathLevel) {
        var FILTER_DIR = 'filters';
        var DIR_SEP = '/';

        var checkFilter = function (filterName, pathLevel) {
            var name = filterName.toLowerCase(), level = '';
            if (!filterHelper.filterInstances[name]) {
                if (pathLevel) {
                    level = compilerHelper.setDeepPath(pathLevel, DIR_SEP);
                }
                var path = __dirname + DIR_SEP + FILTER_DIR + DIR_SEP + name + '.js',
                    requirePath = (level) ? level + FILTER_DIR + DIR_SEP + name : '.' + DIR_SEP + FILTER_DIR + DIR_SEP + name;
                if (fs.existsSync(path)) {
                    try {
                        filterHelper.filterInstances[name] = require(requirePath);
                    } catch (err) {
                        return (filterHelper.filterInstances[name] = compilerHelper.throwException('REQUIRE_ERR', requirePath));
                    }
                    return filterHelper.filterInstances[name];
                } else {
                    return false;
                }
            } else {
                return filterHelper.filterInstances[name];
            }
        };

        return checkFilter(filterName, pathLevel);
    },

    desctruct: function () {
        filterHelper.filterInstances = {};
    }

};

module.exports = filterHelper;