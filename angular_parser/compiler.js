'use strict';
var htmlParser      = require('htmlparser2'),
    underscore      = require('underscore'),
    compilerHelper  = require('./compilerHelper'),
    directiveHelper = require('./directiveHelper');

var compiler = {
    stringObj: '',
    selfClosingTags: ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
    ErrorStack: [],

    compile: function (domString, dataObj) {
        compiler.initParser(domString, dataObj);
        return compiler;
    },

    outputSafe: function () {
        if (compiler.ErrorStack.length) {
            return new Error(compiler.ErrorStack.join('\n'));
        }
        var stringOb = compiler.stringObj;
        compiler.desctruct();
        return stringOb;
    },

    outputForce: function () {
        return compiler.stringObj;
    },

    initParser: function (domString, dataObj) {
        var handler = new htmlParser.DomHandler(function (err, dom) {
            if (err) {
                compiler.ErrorStack.push(err);
            } else {
                compiler.stringObj = compiler.recurDom(dom, dataObj, '');
            }
        });
        return new htmlParser.Parser(handler).parseComplete(domString);
    },

    recurDom: function (domObj, dataObj, htmlString) {
        var activeDirective = null,
            directoryObj    = null;
        underscore.each(domObj, function (val) {
            if (val.type === 'tag') {
                if (activeDirective = directiveHelper.checkDirective(val.attribs)) {
                    directoryObj = directiveHelper.loadDirective(activeDirective, val.attribs, dataObj);
                    if (directoryObj instanceof Error) {
                        compiler.ErrorStack.push(directoryObj.toString());
                    } else if (directoryObj) {
                        htmlString += compiler.tagWrap(
                            val,
                            compilerHelper.filterAttribs(val.attribs, activeDirective.key),
                            function () {
                                return compiler.directiveProccessor(directoryObj, {dom: val, data: dataObj}, val.children, compiler.recurDom);
                            }
                        );
                    }
                }
                if (!activeDirective && val.children && underscore.size(val.children)) {
                    htmlString += compiler.tagWrap(val, val.attribs, function () {
                        return compiler.recurDom(val.children, dataObj, '');
                    });
                } else if (!activeDirective) {
                    htmlString += compiler.tagProccess(val.name, true, {});
                    htmlString += compiler.tagProccess(val.name, false, {});
                }

            } else if (val.type === 'text') {
                htmlString += compiler.textWrap(
                    compilerHelper.valueInterpolate(val.data, dataObj)
                );
            }
        });
        return htmlString;
    },

    directiveProccessor: function (directoryObj, data, children, callback) {
        if (underscore.size(children)) {
            return directoryObj.apply(data, children, callback);
        } else {
            return directoryObj.apply(data, null, callback);
        }
    },

    tagWrap: function (val, params, callback) {
        var htmlString = '';
        var result     = callback();
        if (result) {
            if (result instanceof Error) {
                compiler.ErrorStack.push(result);
                return '';
            }
            htmlString += compiler.tagProccess(val.name, true, params);
            htmlString += result;
            htmlString += compiler.tagProccess(val.name, false, params);
        }
        return htmlString;
    },

    textWrap: function (callback) {
        var htmlString = '';
        var result     = callback;
        if (result) {
            if (result instanceof Error) {
                compiler.ErrorStack.push(result);
                return '';
            }
            htmlString += result;
        }
        return htmlString;
    },

    /**
     *
     * @param tagname Tag name
     * @param toOpen Whether the tag is open or closed
     * @param params Attributes
     * @returns {*} Tag operation function for opening\closing tags
     */
    tagProccess: function (tagname, toOpen, params) {
        if (underscore.indexOf(compiler.selfClosingTags, tagname) === -1) {
            return toOpen ? compiler.createOpenTag(tagname, params) : compiler.createCloseTag(tagname);
        } else {
            return toOpen ? compiler.createSelfOpenTag(tagname, params) : '';
        }
    },

    createOpenTag: function (tagname, params) {
        var openTag = '',
            attribs = '';
        if (tagname) {
            if (underscore.size(params)) {
                underscore.each(params, function (value, key) {
                    if (value && value.length) {
                        attribs += ' ' + key + '="' + value + '"';
                    }
                });
            }
            openTag += '<' + tagname + attribs + '>';
        }
        return openTag;
    },

    createSelfOpenTag: function (tagname, params) {
        var openTag = '',
            attribs = '';
        if (tagname) {
            if (underscore.size(params)) {
                underscore.each(params, function (value, key) {
                    attribs += ' ' + key + '="' + value + '"';
                });
            }
            openTag += '<' + tagname + attribs + '/>';
        }
        return openTag;
    },

    createCloseTag: function (tagname) {
        return '</' + tagname + '>';
    },

    desctruct: function () {
        compiler.ErrorStack = [];
        compiler.stringObj  = '';
        directiveHelper.dirInstances = {};
        compilerHelper.destructInstantData();
    }
};

module.exports = compiler;