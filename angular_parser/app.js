'use strict';
var domParser = require('./compiler');
var underscore = require('underscore');
var dom = '<html>' +
    '<head></head>' +
    '<body>' +
        '<div class="container_div" ng-repeat="(key, val) in items | limit:3 as result track by item.visible">' +
            '<p class="space1" ng-if="val.visible">{{val.name + val.name.length | currencyUAH:"33"}} testing html parser<hr></p>' +
            '<b>{{result[0].container.length}} - result length</b>' +
            '<p class="space2"><br>testing anguler parser {{val.name}}</p>' +
            '<p class="space3" ng-if="val.visible">{{$index}} {{foo($index)}}</p>' +
            '<div class="container2_div" ng-repeat="value in val.container">' +
                '<p class="space4">{{value.valItem}}</p>' +
            '</div>' +
        '</div>' +
    '</body>' +
    '</html>';
var scope = {
    items: [
        {name: 'test1', visible: true, container: [{keyItem: '1', valItem: 'val1'}, {keyItem: '2', valItem: 'val2'}]},
        {name: 'test2', visible: true, container: []},
        {name: 'test3', visible: true, container: []},
        {name: 3333, visible: true, container: []},
        {name: 'test5', visible: false, container: []},
        {name: '22', visible: true, container: []}
    ],
    foo: function (num) {
        return num + 1;
    }
};
var res = domParser.compile(dom, scope).outputSafe();

console.log(res);