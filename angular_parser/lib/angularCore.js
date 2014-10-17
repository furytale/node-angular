'use strict';
var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 425
 */
function isUndefined(value) {return typeof value === 'undefined'; }
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 535
 */
function isFunction(value){return typeof value == 'function';}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 562
 */
function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 557
 */
function isWindow(obj) {
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 440
 */
function isDefined(value){return typeof value !== 'undefined';}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 474
 */
function isString(value){return typeof value === 'string';}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 127
 */
var lowercase = function(string){return isString(string) ? string.toLowerCase() : string;};
/**
 * @source https://github.com/angular/angular.js/blob/master/src/ngAria/aria.js
 * @line 84
 */
function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    });
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 318
 */
function setHashKey(obj, h) {
    if (h) {
        obj.$$hashKey = h;
    }
    else {
        delete obj.$$hashKey;
    }
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 587
 */
var trim = (function () {
    // native trim is way faster: http://jsperf.com/angular-trim-test
    // but IE doesn't have it... :-(
    // TODO: we should move this into IE/ES5 polyfill
    if (!String.prototype.trim) {
        return function (value) {
            return isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
        };
    }
    return function(value) {
        return isString(value) ? value.trim() : value;
    };
})();
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 1465
 */
var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
    });
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 367
 */
function inherit(a, b) {
    for (var i in b) {
        a[i] = b[i];
    }
    return a;
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/ng/compile.js
 *  @line 1448
 */
function directiveNormalize(name) {
    return camelCase(name.replace(PREFIX_REGEXP, ''));
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 1617
 */
function createMap() {
    return Object.create(null);
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 411
 */
function valueFn(value) {return function () { return value; }; }
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 1005
 */
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 974
 */
function toJsonReplacer(key, value) {
    var val = value;

    if (typeof key === 'string' && key.charAt(0) === '$') {
        val = undefined;
    } else if (isWindow(value)) {
        val = '$WINDOW';
    } else if (typeof document !== 'undefined' && value && document === value) {
        val = '$DOCUMENT';
    } else if (isScope(value)) {
        val = '$SCOPE';
    }

    return val;
}
function toJson(obj, pretty) {
    if (typeof obj === 'undefined') return undefined;
    return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 */
function isArray(value) {
    return toString.apply(value) == '[object Array]';
}

/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 194
 */
function isArrayLike(obj) {
    if (obj == null || isWindow(obj)) {
        return false;
    }

    var length = obj.length;

    if (obj.nodeType === 1 && length) {
        return true;
    }

    return isArray(obj) || !isFunction(obj) && (
        length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj
        );
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 239
 */
function forEach(obj, iterator, context) {
    var key;
    if (obj) {
        if (isFunction(obj)){
            for (key in obj) {
                if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context);
        } else if (isArrayLike(obj)) {
            for (key = 0; key < obj.length; key++)
                iterator.call(context, obj[key], key);
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        }
    }
    return obj;
}
/**
 *  @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 *  @line 344
 */
function extend(dst) {
    var h = dst.$$hashKey;
    forEach(arguments, function(obj){
        if (obj !== dst) {
            forEach(obj, function(value, key){
                dst[key] = value;
            });
        }
    });

    setHashKey(dst,h);
    return dst;
}
/**
 * @source https://github.com/angular/angular.js/blob/master/src/Angular.j
 * @line 407
 * @param $
 * @returns {*|jQuery|HTMLElement}
 */
function identity($) {return $;}
var urlParsingNode = true;
var originUrl = '';
/**
 * @source https://github.com/angular/angular.js/blob/master/src/Angular.js
 * @line 545
 * @param value
 * @returns {boolean}
 */
function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
}
/**
 * @source https://github.com/angular/angular.js/blob/master/src/Angular.j
 * @line 813
 * @returns {*|{}}
 */
function shallowCopy(src, dst) {
    dst = dst || {};

    for(var key in src) {
        // shallowCopy is only ever called by $compile nodeLinkFn, which has control over src
        // so we don't need to worry about using our custom hasOwnProperty here
        if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
            dst[key] = src[key];
        }
    }

    return dst;
}
/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/urlUtils.js
 * @line 65
 * @param url
 * @param base
 * @returns {{href: string, protocol: string, host: string, search: string, hash: string, hostname: string, port: string, pathname: string}}
 */
function urlResolve(url, base) {
    // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
    return {
        href: 'test.com',
        protocol: 'http',
        host: '',
        search: '',
        hash: '',
        hostname: 'localhost',
        port: '80',
        pathname: '/'
    };
}
/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/urlUtils.js
 * @line 99
 * @param requestUrl
 * @returns {boolean}
 */
function urlIsSameOrigin(requestUrl) {
    var parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
    return (parsed.protocol === originUrl.protocol &&
        parsed.host === originUrl.host);
}


/**
 *  @source https://github.com/angular/angular.js/blob/master/src/minErr.js
 *  @line 33
 */
function minErr(module, ErrorConstructor) {
    ErrorConstructor = ErrorConstructor || Error;
    return function () {
        var code = arguments[0],
            prefix = '[' + (module ? module + ':' : '') + code + '] ',
            template = arguments[1],
            templateArgs = arguments,
            stringify = function (obj) {
                if (typeof obj === 'function') {
                    return obj.toString().replace(/ \{[\s\S]*$/, '');
                } else if (typeof obj === 'undefined') {
                    return 'undefined';
                } else if (typeof obj !== 'string') {
                    return JSON.stringify(obj);
                }
                return obj;
            },
            message, i;

        message = prefix + template.replace(/\{\d+\}/g, function (match) {
            var index = +match.slice(1, -1), arg;

            if (index + 2 < templateArgs.length) {
                arg = templateArgs[index + 2];
                if (typeof arg === 'function') {
                    return arg.toString().replace(/ ?\{[\s\S]*$/, '');
                } else if (typeof arg === 'undefined') {
                    return 'undefined';
                } else if (typeof arg !== 'string') {
                    return toJson(arg);
                }
                return arg;
            }
            return match;
        });

        message = message + '\nhttp://errors.angularjs.org/"NG_VERSION_FULL"/' +
            (module ? module + '/' : '') + code;
        for (i = 2; i < arguments.length; i++) {
            message = message + (i === 2 ? '?' : '&') + 'p' + (i - 2) + '=' +
                encodeURIComponent(stringify(arguments[i]));
        }
        return new ErrorConstructor(message);
    };
}

/* Parser source: https://github.com/angular/angular.js/blob/master/src/ng/parse.js */

var $parseMinErr = minErr('$parse');

/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/parse.js
  * @returns {*}
 */
function ensureSafeMemberName(name, fullExpression) {
    if (name === "__defineGetter__" || name === "__defineSetter__"
        || name === "__lookupGetter__" || name === "__lookupSetter__"
        || name === "__proto__") {
        throw $parseMinErr('isecfld',
                'Attempting to access a disallowed field in Angular expressions! '
                +'Expression: {0}', fullExpression);
    }
    return name;
}

function ensureSafeObject(obj, fullExpression) {
    // nifty check if obj is Function that is fast and works across iframes and other contexts
    if (obj) {
        if (obj.constructor === obj) {
            throw $parseMinErr('isecfn',
                'Referencing Function in Angular expressions is disallowed! Expression: {0}',
                fullExpression);
        } else if (// isWindow(obj)
            obj.window === obj) {
            throw $parseMinErr('isecwindow',
                'Referencing the Window in Angular expressions is disallowed! Expression: {0}',
                fullExpression);
        } else if (// isElement(obj)
            obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find))) {
            throw $parseMinErr('isecdom',
                'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}',
                fullExpression);
        } else if (// block Object so that we can't get hold of dangerous Object.* methods
            obj === Object) {
            throw $parseMinErr('isecobj',
                'Referencing Object in Angular expressions is disallowed! Expression: {0}',
                fullExpression);
        }
    }
    return obj;
}

var CALL = Function.prototype.call;
var APPLY = Function.prototype.apply;
var BIND = Function.prototype.bind;

function ensureSafeFunction(obj, fullExpression) {
    if (obj) {
        if (obj.constructor === obj) {
            throw $parseMinErr('isecfn',
                'Referencing Function in Angular expressions is disallowed! Expression: {0}',
                fullExpression);
        } else if (obj === CALL || obj === APPLY || obj === BIND) {
            throw $parseMinErr('isecff',
                'Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}',
                fullExpression);
        }
    }
}

//Keyword constants
var CONSTANTS = createMap();
forEach({
    'null': function() { return null; },
    'true': function() { return true; },
    'false': function() { return false; },
    'undefined': function() {}
}, function(constantGetter, name) {
    constantGetter.constant = constantGetter.literal = constantGetter.sharedGetter = true;
    CONSTANTS[name] = constantGetter;
});

//Operators - will be wrapped by binaryFn/unaryFn/assignment/filter
var OPERATORS = extend(createMap(), {
    /* jshint bitwise : false */
    '+':function(self, locals, a,b){
        a=a(self, locals); b=b(self, locals);
        if (isDefined(a)) {
            if (isDefined(b)) {
                return a + b;
            }
            return a;
        }
        return isDefined(b)?b:undefined;},
    '-':function(self, locals, a,b){
        a=a(self, locals); b=b(self, locals);
        return (isDefined(a)?a:0)-(isDefined(b)?b:0);
    },
    '*':function(self, locals, a,b){return a(self, locals)*b(self, locals);},
    '/':function(self, locals, a,b){return a(self, locals)/b(self, locals);},
    '%':function(self, locals, a,b){return a(self, locals)%b(self, locals);},
    '^':function(self, locals, a,b){return a(self, locals)^b(self, locals);},
    '===':function(self, locals, a, b){return a(self, locals)===b(self, locals);},
    '!==':function(self, locals, a, b){return a(self, locals)!==b(self, locals);},
    '==':function(self, locals, a,b){return a(self, locals)==b(self, locals);},
    '!=':function(self, locals, a,b){return a(self, locals)!=b(self, locals);},
    '<':function(self, locals, a,b){return a(self, locals)<b(self, locals);},
    '>':function(self, locals, a,b){return a(self, locals)>b(self, locals);},
    '<=':function(self, locals, a,b){return a(self, locals)<=b(self, locals);},
    '>=':function(self, locals, a,b){return a(self, locals)>=b(self, locals);},
    '&&':function(self, locals, a,b){return a(self, locals)&&b(self, locals);},
    '||':function(self, locals, a,b){return a(self, locals)||b(self, locals);},
    '&':function(self, locals, a,b){return a(self, locals)&b(self, locals);},
    '!':function(self, locals, a){return !a(self, locals);},

    //Tokenized as operators but parsed as assignment/filters
    '=':true,
    '|':true
});
/* jshint bitwise: true */
var ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};


/////////////////////////////////////////


/**
 * a part of the parse functionality
 * @source https://github.com/angular/angular.js/blob/master/src/ng/parse.js
 * @line 143
 * @constructor
 */
var Lexer = function (options) {
    this.options = options;
};

Lexer.prototype = {
    constructor: Lexer,

    lex: function (text) {
        this.text = text;
        this.index = 0;
        this.ch = undefined;
        this.tokens = [];

        while (this.index < this.text.length) {
            this.ch = this.text.charAt(this.index);
            if (this.is('"\'')) {
                this.readString(this.ch);
            } else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
                this.readNumber();
            } else if (this.isIdent(this.ch)) {
                this.readIdent();
            } else if (this.is('(){}[].,;:?')) {
                this.tokens.push({
                    index: this.index,
                    text: this.ch
                });
                this.index++;
            } else if (this.isWhitespace(this.ch)) {
                this.index++;
            } else {
                var ch2 = this.ch + this.peek();
                var ch3 = ch2 + this.peek(2);
                var fn = OPERATORS[this.ch];
                var fn2 = OPERATORS[ch2];
                var fn3 = OPERATORS[ch3];
                if (fn3) {
                    this.tokens.push({index: this.index, text: ch3, fn: fn3});
                    this.index += 3;
                } else if (fn2) {
                    this.tokens.push({index: this.index, text: ch2, fn: fn2});
                    this.index += 2;
                } else if (fn) {
                    this.tokens.push({
                        index: this.index,
                        text: this.ch,
                        fn: fn
                    });
                    this.index += 1;
                } else {
                    this.throwError('Unexpected next character ', this.index, this.index + 1);
                }
            }
        }
        return this.tokens;
    },

    is: function(chars) {
        return chars.indexOf(this.ch) !== -1;
    },

    peek: function(i) {
        var num = i || 1;
        return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
    },

    isNumber: function(ch) {
        return ('0' <= ch && ch <= '9');
    },

    isWhitespace: function(ch) {
        // IE treats non-breaking space as \u00A0
        return (ch === ' ' || ch === '\r' || ch === '\t' ||
            ch === '\n' || ch === '\v' || ch === '\u00A0');
    },

    isIdent: function(ch) {
        return ('a' <= ch && ch <= 'z' ||
            'A' <= ch && ch <= 'Z' ||
            '_' === ch || ch === '$');
    },

    isExpOperator: function(ch) {
        return (ch === '-' || ch === '+' || this.isNumber(ch));
    },

    throwError: function(error, start, end) {
        end = end || this.index;
        var colStr = (isDefined(start)
            ? 's ' + start +  '-' + this.index + ' [' + this.text.substring(start, end) + ']'
            : ' ' + end);
        throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].',
            error, colStr, this.text);
    },

    readNumber: function() {
        var number = '';
        var start = this.index;
        while (this.index < this.text.length) {
            var ch = lowercase(this.text.charAt(this.index));
            if (ch == '.' || this.isNumber(ch)) {
                number += ch;
            } else {
                var peekCh = this.peek();
                if (ch == 'e' && this.isExpOperator(peekCh)) {
                    number += ch;
                } else if (this.isExpOperator(ch) &&
                    peekCh && this.isNumber(peekCh) &&
                    number.charAt(number.length - 1) == 'e') {
                    number += ch;
                } else if (this.isExpOperator(ch) &&
                    (!peekCh || !this.isNumber(peekCh)) &&
                    number.charAt(number.length - 1) == 'e') {
                    this.throwError('Invalid exponent');
                } else {
                    break;
                }
            }
            this.index++;
        }
        number = 1 * number;
        this.tokens.push({
            index: start,
            text: number,
            constant: true,
            fn: function() { return number; }
        });
    },

    readIdent: function() {
        var expression = this.text;

        var ident = '';
        var start = this.index;

        var lastDot, peekIndex, methodName, ch;

        while (this.index < this.text.length) {
            ch = this.text.charAt(this.index);
            if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
                if (ch === '.') lastDot = this.index;
                ident += ch;
            } else {
                break;
            }
            this.index++;
        }

        //check if the identifier ends with . and if so move back one char
        if (lastDot && ident[ident.length - 1] === '.') {
            this.index--;
            ident = ident.slice(0, -1);
            lastDot = ident.lastIndexOf('.');
            if (lastDot === -1) {
                lastDot = undefined;
            }
        }

        //check if this is not a method invocation and if it is back out to last dot
        if (lastDot) {
            peekIndex = this.index;
            while (peekIndex < this.text.length) {
                ch = this.text.charAt(peekIndex);
                if (ch === '(') {
                    methodName = ident.substr(lastDot - start + 1);
                    ident = ident.substr(0, lastDot - start);
                    this.index = peekIndex;
                    break;
                }
                if (this.isWhitespace(ch)) {
                    peekIndex++;
                } else {
                    break;
                }
            }
        }

        this.tokens.push({
            index: start,
            text: ident,
            fn: CONSTANTS[ident] || getterFn(ident, this.options, expression)
        });

        if (methodName) {
            this.tokens.push({
                index: lastDot,
                text: '.'
            });
            this.tokens.push({
                index: lastDot + 1,
                text: methodName
            });
        }
    },

    readString: function(quote) {
        var start = this.index;
        this.index++;
        var string = '';
        var rawString = quote;
        var escape = false;
        while (this.index < this.text.length) {
            var ch = this.text.charAt(this.index);
            rawString += ch;
            if (escape) {
                if (ch === 'u') {
                    var hex = this.text.substring(this.index + 1, this.index + 5);
                    if (!hex.match(/[\da-f]{4}/i))
                        this.throwError('Invalid unicode escape [\\u' + hex + ']');
                    this.index += 4;
                    string += String.fromCharCode(parseInt(hex, 16));
                } else {
                    var rep = ESCAPE[ch];
                    string = string + (rep || ch);
                }
                escape = false;
            } else if (ch === '\\') {
                escape = true;
            } else if (ch === quote) {
                this.index++;
                this.tokens.push({
                    index: start,
                    text: rawString,
                    string: string,
                    constant: true,
                    fn: function() { return string; }
                });
                return;
            } else {
                string += ch;
            }
            this.index++;
        }
        this.throwError('Unterminated quote', start);
    }
};


function isConstant(exp) {
    return exp.constant;
}

/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/parse.js
 * @line 387
 * @constructor
 */
var Parser = function (lexer, $filter, options) {
    this.lexer = lexer;
    this.$filter = $filter;
    this.options = options;
};

Parser.ZERO = extend(function () {
    return 0;
}, {
    sharedGetter: true,
    constant: true
});

Parser.prototype = {
    constructor: Parser,

    parse: function (text) {
        this.text = text;
        this.tokens = this.lexer.lex(text);
        var value = this.statements();

        if (this.tokens.length !== 0) {
            this.throwError('is an unexpected token', this.tokens[0]);
        }

        value.literal = !!value.literal;
        value.constant = !!value.constant;
        return value;

    },

    primary: function () {
        var primary;
        if (this.expect('(')) {
            primary = this.filterChain();
            this.consume(')');
        } else if (this.expect('[')) {
            primary = this.arrayDeclaration();
        } else if (this.expect('{')) {
            primary = this.object();
        } else {
            var token = this.expect();
            primary = token.fn;
            if (!primary) {
                this.throwError('not a primary expression', token);
            }
            if (token.constant) {
                primary.constant = true;
                primary.literal = true;
            }
        }

        var next, context;
        while ((next = this.expect('(', '[', '.'))) {
            if (next.text === '(') {
                primary = this.functionCall(primary, context);
                context = null;
            } else if (next.text === '[') {
                context = primary;
                primary = this.objectIndex(primary);
            } else if (next.text === '.') {
                context = primary;
                primary = this.fieldAccess(primary);
            } else {
                this.throwError('IMPOSSIBLE');
            }
        }
        return primary;
    },

    throwError: function(msg, token) {
        throw $parseMinErr('syntax',
            'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].',
            token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
    },

    peekToken: function() {
        if (this.tokens.length === 0)
            throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
        return this.tokens[0];
    },

    peek: function(e1, e2, e3, e4) {
        if (this.tokens.length > 0) {
            var token = this.tokens[0];
            var t = token.text;
            if (t === e1 || t === e2 || t === e3 || t === e4 ||
                (!e1 && !e2 && !e3 && !e4)) {
                return token;
            }
        }
        return false;
    },

    expect: function(e1, e2, e3, e4){
        var token = this.peek(e1, e2, e3, e4);
        if (token) {
            this.tokens.shift();
            return token;
        }
        return false;
    },

    consume: function(e1){
        if (!this.expect(e1)) {
            this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
        }
    },

    unaryFn: function(fn, right) {
        return extend(function $parseUnaryFn(self, locals) {
            return fn(self, locals, right);
        }, {
            constant:right.constant,
            inputs: [right]
        });
    },

    binaryFn: function(left, fn, right, isBranching) {
        return extend(function $parseBinaryFn(self, locals) {
            return fn(self, locals, left, right);
        }, {
            constant: left.constant && right.constant,
            inputs: !isBranching && [left, right]
        });
    },

    statements: function() {
        var statements = [];
        while (true) {
            if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
                statements.push(this.filterChain());
            if (!this.expect(';')) {
                // optimize for the common case where there is only one statement.
                // TODO(size): maybe we should not support multiple statements?
                return (statements.length === 1)
                    ? statements[0]
                    : function $parseStatements(self, locals) {
                    var value;
                    for (var i = 0, ii = statements.length; i < ii; i++) {
                        value = statements[i](self, locals);
                    }
                    return value;
                };
            }
        }
    },

    filterChain: function() {
        var left = this.expression();
        var token;
        while ((token = this.expect('|'))) {
            left = this.filter(left);
        }
        return left;
    },

    filter: function(inputFn) {
        var token = this.expect();
        var fn = this.$filter(token.text);
        var argsFn;
        var args;

        if (this.peek(':')) {
            argsFn = [];
            args = []; // we can safely reuse the array
            while (this.expect(':')) {
                argsFn.push(this.expression());
            }
        }

        var inputs = [inputFn].concat(argsFn || []);
        return extend(function $parseFilter(self, locals) {
            var input = inputFn(self, locals);
            if (args) {
                args[0] = input;

                var i = argsFn.length;
                while (i--) {
                    args[i + 1] = argsFn[i](self, locals);
                }
                return fn.apply(undefined, args);
            }
            return fn(input);
        }, {
            constant: !fn.$stateful && inputs.every(isConstant),
            inputs: !fn.$stateful && inputs
        });
    },

    expression: function() {
        return this.assignment();
    },

    assignment: function() {
        var left = this.ternary();
        var right;
        var token;
        if ((token = this.expect('='))) {
            if (!left.assign) {
                this.throwError('implies assignment but [' +
                    this.text.substring(0, token.index) + '] can not be assigned to', token);
            }
            right = this.ternary();
            return extend(function $parseAssignment(scope, locals) {
                return left.assign(scope, right(scope, locals), locals);
            }, {
                inputs: [left, right]
            });
        }
        return left;
    },

    ternary: function() {
        var left = this.logicalOR();
        var middle;
        var token;
        if ((token = this.expect('?'))) {
            middle = this.assignment();
            if ((token = this.expect(':'))) {
                var right = this.assignment();

                return extend(function $parseTernary(self, locals){
                    return left(self, locals) ? middle(self, locals) : right(self, locals);
                }, {
                    constant: left.constant && middle.constant && right.constant
                });

            } else {
                this.throwError('expected :', token);
            }
        }

        return left;
    },

    logicalOR: function() {
        var left = this.logicalAND();
        var token;
        while ((token = this.expect('||'))) {
            left = this.binaryFn(left, token.fn, this.logicalAND(), true);
        }
        return left;
    },

    logicalAND: function() {
        var left = this.equality();
        var token;
        if ((token = this.expect('&&'))) {
            left = this.binaryFn(left, token.fn, this.logicalAND(), true);
        }
        return left;
    },

    equality: function() {
        var left = this.relational();
        var token;
        if ((token = this.expect('==','!=','===','!=='))) {
            left = this.binaryFn(left, token.fn, this.equality());
        }
        return left;
    },

    relational: function() {
        var left = this.additive();
        var token;
        if ((token = this.expect('<', '>', '<=', '>='))) {
            left = this.binaryFn(left, token.fn, this.relational());
        }
        return left;
    },

    additive: function() {
        var left = this.multiplicative();
        var token;
        while ((token = this.expect('+','-'))) {
            left = this.binaryFn(left, token.fn, this.multiplicative());
        }
        return left;
    },

    multiplicative: function() {
        var left = this.unary();
        var token;
        while ((token = this.expect('*','/','%'))) {
            left = this.binaryFn(left, token.fn, this.unary());
        }
        return left;
    },

    unary: function() {
        var token;
        if (this.expect('+')) {
            return this.primary();
        } else if ((token = this.expect('-'))) {
            return this.binaryFn(Parser.ZERO, token.fn, this.unary());
        } else if ((token = this.expect('!'))) {
            return this.unaryFn(token.fn, this.unary());
        } else {
            return this.primary();
        }
    },

    fieldAccess: function(object) {
        var expression = this.text;
        var field = this.expect().text;
        var getter = getterFn(field, this.options, expression);

        return extend(function $parseFieldAccess(scope, locals, self) {
            return getter(self || object(scope, locals));
        }, {
            assign: function(scope, value, locals) {
                var o = object(scope, locals);
                if (!o) object.assign(scope, o = {});
                return setter(o, field, value, expression);
            }
        });
    },

    objectIndex: function(obj) {
        var expression = this.text;

        var indexFn = this.expression();
        this.consume(']');

        return extend(function $parseObjectIndex(self, locals) {
            var o = obj(self, locals),
                i = indexFn(self, locals),
                v;

            ensureSafeMemberName(i, expression);
            if (!o) return undefined;
            v = ensureSafeObject(o[i], expression);
            return v;
        }, {
            assign: function(self, value, locals) {
                var key = ensureSafeMemberName(indexFn(self, locals), expression);
                // prevent overwriting of Function.constructor which would break ensureSafeObject check
                var o = ensureSafeObject(obj(self, locals), expression);
                if (!o) obj.assign(self, o = {});
                return o[key] = value;
            }
        });
    },

    functionCall: function(fnGetter, contextGetter) {
        var argsFn = [];
        if (this.peekToken().text !== ')') {
            do {
                argsFn.push(this.expression());
            } while (this.expect(','));
        }
        this.consume(')');

        var expressionText = this.text;
        // we can safely reuse the array across invocations
        var args = argsFn.length ? [] : null;

        return function $parseFunctionCall(scope, locals) {
            var context = contextGetter ? contextGetter(scope, locals) : scope;
            var fn = fnGetter(scope, locals, context) || noop;

            if (args) {
                var i = argsFn.length;
                while (i--) {
                    args[i] = ensureSafeObject(argsFn[i](scope, locals), expressionText);
                }
            }

            ensureSafeObject(context, expressionText);
            ensureSafeFunction(fn, expressionText);

            // IE stupidity! (IE doesn't have apply for some native functions)
            var v = fn.apply
                ? fn.apply(context, args)
                : fn(args[0], args[1], args[2], args[3], args[4]);

            return ensureSafeObject(v, expressionText);
        };
    },

    // This is used with json array declaration
    arrayDeclaration: function () {
        var elementFns = [];
        if (this.peekToken().text !== ']') {
            do {
                if (this.peek(']')) {
                    // Support trailing commas per ES5.1.
                    break;
                }
                var elementFn = this.expression();
                elementFns.push(elementFn);
            } while (this.expect(','));
        }
        this.consume(']');

        return extend(function $parseArrayLiteral(self, locals) {
            var array = [];
            for (var i = 0, ii = elementFns.length; i < ii; i++) {
                array.push(elementFns[i](self, locals));
            }
            return array;
        }, {
            literal: true,
            constant: elementFns.every(isConstant),
            inputs: elementFns
        });
    },

    object: function () {
        var keys = [], valueFns = [];
        if (this.peekToken().text !== '}') {
            do {
                if (this.peek('}')) {
                    // Support trailing commas per ES5.1.
                    break;
                }
                var token = this.expect();
                keys.push(token.string || token.text);
                this.consume(':');
                var value = this.expression();
                valueFns.push(value);
            } while (this.expect(','));
        }
        this.consume('}');

        return extend(function $parseObjectLiteral(self, locals) {
            var object = {};
            for (var i = 0, ii = valueFns.length; i < ii; i++) {
                object[keys[i]] = valueFns[i](self, locals);
            }
            return object;
        }, {
            literal: true,
            constant: valueFns.every(isConstant),
            inputs: valueFns
        });
    }
};


//////////////////////////////////////////////////
// Parser helper functions
//////////////////////////////////////////////////
/**
 *
 * @source https://github.com/angular/angular.js/blob/master/src/ng/parse.js
 * @line 836
  * @returns {*}
 */
function setter(obj, path, setValue, fullExp) {
    ensureSafeObject(obj, fullExp);

    var element = path.split('.'), key;
    for (var i = 0; element.length > 1; i++) {
        key = ensureSafeMemberName(element.shift(), fullExp);
        var propertyObj = ensureSafeObject(obj[key], fullExp);
        if (!propertyObj) {
            propertyObj = {};
            obj[key] = propertyObj;
        }
        obj = propertyObj;
    }
    key = ensureSafeMemberName(element.shift(), fullExp);
    ensureSafeObject(obj[key], fullExp);
    obj[key] = setValue;
    return setValue;
}

var getterFnCache = createMap();

/**
 * Implementation of the "Black Hole" variant from:
 * - http://jsperf.com/angularjs-parse-getter/4
 * - http://jsperf.com/path-evaluation-simplified/7
 */
function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp) {
    ensureSafeMemberName(key0, fullExp);
    ensureSafeMemberName(key1, fullExp);
    ensureSafeMemberName(key2, fullExp);
    ensureSafeMemberName(key3, fullExp);
    ensureSafeMemberName(key4, fullExp);

    return function cspSafeGetter(scope, locals) {
        var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;

        if (pathVal == null) return pathVal;
        pathVal = pathVal[key0];

        if (!key1) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key1];

        if (!key2) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key2];

        if (!key3) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key3];

        if (!key4) return pathVal;
        if (pathVal == null) return undefined;
        pathVal = pathVal[key4];

        return pathVal;
    };
}

function getterFn(path, options, fullExp) {
    var fn = getterFnCache[path];

    if (fn) return fn;

    var pathKeys = path.split('.'),
        pathKeysLength = pathKeys.length;

    // http://jsperf.com/angularjs-parse-getter/6
    if (options.csp) {
        if (pathKeysLength < 6) {
            fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp);
        } else {
            fn = function cspSafeGetter(scope, locals) {
                var i = 0, val;
                do {
                    val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++],
                        pathKeys[i++], fullExp)(scope, locals);

                    locals = undefined; // clear after first iteration
                    scope = val;
                } while (i < pathKeysLength);
                return val;
            };
        }
    } else {
        var code = '';
        forEach(pathKeys, function(key, index) {
            ensureSafeMemberName(key, fullExp);
            code += 'if(s == null) return undefined;\n' +
                's='+ (index
                // we simply dereference 's' on any .dot notation
                ? 's'
                // but if we are first then we check locals first, and if so read it first
                : '((l&&l.hasOwnProperty("' + key + '"))?l:s)') + '.' + key + ';\n';
        });
        code += 'return s;';

        /* jshint -W054 */
        var evaledFnGetter = new Function('s', 'l', code); // s=scope, l=locals
        /* jshint +W054 */
        evaledFnGetter.toString = valueFn(code);

        fn = evaledFnGetter;
    }

    fn.sharedGetter = true;
    fn.assign = function(self, value) {
        return setter(self, path, value, path);
    };
    getterFnCache[path] = fn;
    return fn;
}

///////////////////////////////////

/**
 * @ngdoc service
 * @name $parse
 * @kind function
 *
 * @description
 *
 * Converts Angular {@link guide/expression expression} into a function.
 *
 * ```js
 *   var getter = $parse('user.name');
 *   var setter = getter.assign;
 *   var context = {user:{name:'angular'}};
 *   var locals = {user:{name:'local'}};
 *
 *   expect(getter(context)).toEqual('angular');
 *   setter(context, 'newValue');
 *   expect(context.user.name).toEqual('newValue');
 *   expect(getter(context, locals)).toEqual('local');
 * ```
 *
 *
 * @param {string} expression String expression to compile.
 * @returns {function(context, locals)} a function which represents the compiled expression:
 *
 *    * `context` – `{object}` – an object against which any expressions embedded in the strings
 *      are evaluated against (typically a scope object).
 *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
 *      `context`.
 *
 *    The returned function also has the following properties:
 *      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
 *        literal.
 *      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
 *        constant literals.
 *      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
 *        set to a function to change its value on the given context.
 *
 */


/**
 * @ngdoc provider
 * @name $parseProvider
 *
 * @description
 * `$parseProvider` can be used for configuring the default behavior of the {@link ng.$parse $parse}
 *  service.
 */
function $ParseProvider() {
    var cache = createMap();

    var $parseOptions = {
        csp: false
    };


    this.$get = ['$filter', '$sniffer', function($filter, $sniffer) {
        $parseOptions.csp = $sniffer.csp;

        function wrapSharedExpression(exp) {
            var wrapped = exp;

            if (exp.sharedGetter) {
                wrapped = function $parseWrapper(self, locals) {
                    return exp(self, locals);
                };
                wrapped.literal = exp.literal;
                wrapped.constant = exp.constant;
                wrapped.assign = exp.assign;
            }

            return wrapped;
        }

        return function $parse(exp, interceptorFn) {
            var parsedExpression, oneTime, cacheKey;

            switch (typeof exp) {
                case 'string':
                    cacheKey = exp = exp.trim();

                    parsedExpression = cache[cacheKey];

                    if (!parsedExpression) {
                        if (exp.charAt(0) === ':' && exp.charAt(1) === ':') {
                            oneTime = true;
                            exp = exp.substring(2);
                        }

                        var lexer = new Lexer($parseOptions);
                        var parser = new Parser(lexer, $filter, $parseOptions);
                        parsedExpression = parser.parse(exp);

                        if (parsedExpression.constant) {
                            parsedExpression.$$watchDelegate = constantWatchDelegate;
                        } else if (oneTime) {
                            //oneTime is not part of the exp passed to the Parser so we may have to
                            //wrap the parsedExpression before adding a $$watchDelegate
                            parsedExpression = wrapSharedExpression(parsedExpression);
                            parsedExpression.$$watchDelegate = parsedExpression.literal ?
                                oneTimeLiteralWatchDelegate : oneTimeWatchDelegate;
                        } else if (parsedExpression.inputs) {
                            parsedExpression.$$watchDelegate = inputsWatchDelegate;
                        }

                        cache[cacheKey] = parsedExpression;
                    }
                    return addInterceptor(parsedExpression, interceptorFn);

                case 'function':
                    return addInterceptor(exp, interceptorFn);

                default:
                    return addInterceptor(noop, interceptorFn);
            }
        };

        function collectExpressionInputs(inputs, list) {
            for (var i = 0, ii = inputs.length; i < ii; i++) {
                var input = inputs[i];
                if (!input.constant) {
                    if (input.inputs) {
                        collectExpressionInputs(input.inputs, list);
                    } else if (list.indexOf(input) === -1) { // TODO(perf) can we do better?
                        list.push(input);
                    }
                }
            }

            return list;
        }

        function expressionInputDirtyCheck(newValue, oldValueOfValue) {

            if (newValue == null || oldValueOfValue == null) { // null/undefined
                return newValue === oldValueOfValue;
            }

            if (typeof newValue === 'object') {

                // attempt to convert the value to a primitive type
                // TODO(docs): add a note to docs that by implementing valueOf even objects and arrays can
                //             be cheaply dirty-checked
                newValue = newValue.valueOf();

                if (typeof newValue === 'object') {
                    // objects/arrays are not supported - deep-watching them would be too expensive
                    return false;
                }

                // fall-through to the primitive equality check
            }

            //Primitive or NaN
            return newValue === oldValueOfValue || (newValue !== newValue && oldValueOfValue !== oldValueOfValue);
        }

        function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression) {
            var inputExpressions = parsedExpression.$$inputs ||
                (parsedExpression.$$inputs = collectExpressionInputs(parsedExpression.inputs, []));

            var lastResult;

            if (inputExpressions.length === 1) {
                var oldInputValue = expressionInputDirtyCheck; // init to something unique so that equals check fails
                inputExpressions = inputExpressions[0];
                return scope.$watch(function expressionInputWatch(scope) {
                    var newInputValue = inputExpressions(scope);
                    if (!expressionInputDirtyCheck(newInputValue, oldInputValue)) {
                        lastResult = parsedExpression(scope);
                        oldInputValue = newInputValue && newInputValue.valueOf();
                    }
                    return lastResult;
                }, listener, objectEquality);
            }

            var oldInputValueOfValues = [];
            for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
                oldInputValueOfValues[i] = expressionInputDirtyCheck; // init to something unique so that equals check fails
            }

            return scope.$watch(function expressionInputsWatch(scope) {
                var changed = false;

                for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
                    var newInputValue = inputExpressions[i](scope);
                    if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) {
                        oldInputValueOfValues[i] = newInputValue && newInputValue.valueOf();
                    }
                }

                if (changed) {
                    lastResult = parsedExpression(scope);
                }

                return lastResult;
            }, listener, objectEquality);
        }

        function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
            var unwatch, lastValue;
            return unwatch = scope.$watch(function oneTimeWatch(scope) {
                return parsedExpression(scope);
            }, function oneTimeListener(value, old, scope) {
                lastValue = value;
                if (isFunction(listener)) {
                    listener.apply(this, arguments);
                }
                if (isDefined(value)) {
                    scope.$$postDigest(function () {
                        if (isDefined(lastValue)) {
                            unwatch();
                        }
                    });
                }
            }, objectEquality);
        }

        function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
            var unwatch;
            return unwatch = scope.$watch(function oneTimeWatch(scope) {
                return parsedExpression(scope);
            }, function oneTimeListener(value, old, scope) {
                if (isFunction(listener)) {
                    listener.call(this, value, old, scope);
                }
                if (isAllDefined(value)) {
                    scope.$$postDigest(function () {
                        if(isAllDefined(value)) unwatch();
                    });
                }
            }, objectEquality);

            function isAllDefined(value) {
                var allDefined = true;
                forEach(value, function (val) {
                    if (!isDefined(val)) allDefined = false;
                });
                return allDefined;
            }
        }

        function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
            var unwatch;
            return unwatch = scope.$watch(function constantWatch(scope) {
                return parsedExpression(scope);
            }, function constantListener(value, old, scope) {
                if (isFunction(listener)) {
                    listener.apply(this, arguments);
                }
                unwatch();
            }, objectEquality);
        }

        function addInterceptor(parsedExpression, interceptorFn) {
            if (!interceptorFn) return parsedExpression;

            var fn = function interceptedExpression(scope, locals) {
                var value = parsedExpression(scope, locals);
                var result = interceptorFn(value, scope, locals);
                // we only return the interceptor's result if the
                // initial value is defined (for bind-once)
                return isDefined(value) ? result : value;
            };

            // Propagate $$watchDelegates other then inputsWatchDelegate
            if (parsedExpression.$$watchDelegate &&
                parsedExpression.$$watchDelegate !== inputsWatchDelegate) {
                fn.$$watchDelegate = parsedExpression.$$watchDelegate;
            } else if (!interceptorFn.$stateful) {
                // If there is an interceptor, but no watchDelegate then treat the interceptor like
                // we treat filters - it is assumed to be a pure function unless flagged with $stateful
                fn.$$watchDelegate = inputsWatchDelegate;
                fn.inputs = [parsedExpression];
            }

            return fn;
        }
    }];
}

/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/interpolate.js
 * @line 40
 */
function $InterpolateProvider() {
    var startSymbol = '{{';
    var endSymbol = '}}';

    /**
     * @ngdoc method
     * @name $interpolateProvider#startSymbol
     * @description
     * Symbol to denote start of expression in the interpolated string. Defaults to `{{`.
   *
   * @param {string=} value new value to set the starting symbol to.
     * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
     */
    this.startSymbol = function(value){
        if (value) {
            startSymbol = value;
            return this;
        } else {
            return startSymbol;
        }
    };

    /**
     * @ngdoc method
     * @name $interpolateProvider#endSymbol
     * @description
     * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
     *
     * @param {string=} value new value to set the ending symbol to.
     * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
     */
    this.endSymbol = function(value){
        if (value) {
            endSymbol = value;
            return this;
        } else {
            return endSymbol;
        }
    };


    this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
        var startSymbolLength = startSymbol.length,
            endSymbolLength = endSymbol.length;

        /**
         * @ngdoc service
         * @name $interpolate
         * @function
         *
         * @requires $parse
         * @requires $sce
         *
         * @description
         *
         * Compiles a string with markup into an interpolation function. This service is used by the
         * HTML {@link ng.$compile $compile} service for data binding. See
         * {@link ng.$interpolateProvider $interpolateProvider} for configuring the
         * interpolation markup.
         *
         *
         * ```js
         *   var $interpolate = ...; // injected
         *   var exp = $interpolate('Hello {{name | uppercase}}!');
         *   expect(exp({name:'Angular'}).toEqual('Hello ANGULAR!');
         * ```
         *
         *
         * @param {string} text The text with markup to interpolate.
         * @param {boolean=} mustHaveExpression if set to true then the interpolation string must have
         *    embedded expression in order to return an interpolation function. Strings with no
         *    embedded expression will return null for the interpolation function.
         * @param {string=} trustedContext when provided, the returned function passes the interpolated
         *    result through {@link ng.$sce#getTrusted $sce.getTrusted(interpolatedResult,
     *    trustedContext)} before returning it.  Refer to the {@link ng.$sce $sce} service that
         *    provides Strict Contextual Escaping for details.
         * @returns {function(context)} an interpolation function which is used to compute the
         *    interpolated string. The function has these parameters:
         *
         *    * `context`: an object against which any expressions embedded in the strings are evaluated
         *      against.
         *
         */
        function $interpolate(text, mustHaveExpression, trustedContext) {
            var startIndex,
                endIndex,
                index = 0,
                parts = [],
                length = text.length,
                hasInterpolation = false,
                fn,
                exp,
                concat = [];
            while(index < length) {
                if ( ((startIndex = text.indexOf(startSymbol, index)) != -1) &&
                    ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) ) {
                    (index != startIndex) && parts.push(text.substring(index, startIndex));
                    parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex)));
                    fn.exp = exp;
                    index = endIndex + endSymbolLength;
                    hasInterpolation = true;
                } else {
                    // we did not find anything, so we have to add the remainder to the parts array
                    (index != length) && parts.push(text.substring(index));
                    index = length;
                }
            }

            if (!(length = parts.length)) {
                // we added, nothing, must have been an empty string.
                parts.push('');
                length = 1;
            }

            // Concatenating expressions makes it hard to reason about whether some combination of
            // concatenated values are unsafe to use and could easily lead to XSS.  By requiring that a
            // single expression be used for iframe[src], object[src], etc., we ensure that the value
            // that's used is assigned or constructed by some JS code somewhere that is more testable or
            // make it obvious that you bound the value to some user controlled value.  This helps reduce
            // the load when auditing for XSS issues.
            if (trustedContext && parts.length > 1) {
                throw $interpolateMinErr('noconcat',
                        "Error while interpolating: {0}\nStrict Contextual Escaping disallows " +
                        "interpolations that concatenate multiple expressions when a trusted value is " +
                        "required.  See http://docs.angularjs.org/api/ng.$sce", text);
            }

            if (!mustHaveExpression  || hasInterpolation) {
                concat.length = length;
                fn = function(context) {
                    try {
                        for(var i = 0, ii = length, part; i<ii; i++) {
                            if (typeof (part = parts[i]) == 'function') {
                                part = part(context);
                                if (trustedContext) {
                                    part = $sce.getTrusted(trustedContext, part);
                                } else {
                                    part = $sce.valueOf(part);
                                }
                                if (part === null || isUndefined(part)) {
                                    part = '';
                                } else if (typeof part != 'string') {
                                    part = toJson(part);
                                }
                            }
                            concat[i] = part;
                        }
                        return concat.join('');
                    }
                    catch(err) {
                        var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text,
                            err.toString());
                        $exceptionHandler(newErr);
                    }
                };
                fn.exp = text;
                fn.parts = parts;
                return fn;
            }
        }


        /**
         * @ngdoc method
         * @name $interpolate#startSymbol
         * @description
         * Symbol to denote the start of expression in the interpolated string. Defaults to `{{`.
     *
     * Use {@link ng.$interpolateProvider#startSymbol $interpolateProvider#startSymbol} to change
         * the symbol.
         *
         * @returns {string} start symbol.
         */
        $interpolate.startSymbol = function() {
            return startSymbol;
        };


        /**
         * @ngdoc method
         * @name $interpolate#endSymbol
         * @description
         * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
         *
         * Use {@link ng.$interpolateProvider#endSymbol $interpolateProvider#endSymbol} to change
         * the symbol.
         *
         * @returns {string} end symbol.
         */
        $interpolate.endSymbol = function() {
            return endSymbol;
        };

        return $interpolate;
    }];
}

/* Angular compiler */
/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/compile.js
 * @line 679
 * @param $provide
 * @param $$sanitizeUriProvider
 */
function $CompileProvider($provide, $$sanitizeUriProvider) {
    var hasDirectives = {},
        Suffix = 'Directive',
        COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,
        CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/;

    // Ref: http://developers.whatwg.org/webappapis.html#event-handler-idl-attributes
    // The assumption is that future DOM event attribute names will begin with
    // 'on' and be composed of only English letters.
    var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;

    /**
     * @ngdoc method
     * @name $compileProvider#directive
     * @function
     *
     * @description
     * Register a new directive with the compiler.
     *
     * @param {string|Object} name Name of the directive in camel-case (i.e. <code>ngBind</code> which
     *    will match as <code>ng-bind</code>), or an object map of directives where the keys are the
     *    names and the values are the factories.
     * @param {Function|Array} directiveFactory An injectable directive factory function. See
     *    {@link guide/directive} for more info.
     * @returns {ng.$compileProvider} Self for chaining.
     */
    this.directive = function registerDirective(name, directiveFactory) {
        assertNotHasOwnProperty(name, 'directive');
        if (isString(name)) {
            assertArg(directiveFactory, 'directiveFactory');
            if (!hasDirectives.hasOwnProperty(name)) {
                hasDirectives[name] = [];
                $provide.factory(name + Suffix, ['$injector', '$exceptionHandler',
                    function ($injector, $exceptionHandler) {
                        var directives = [];
                        forEach(hasDirectives[name], function (directiveFactory, index) {
                            try {
                                var directive = $injector.invoke(directiveFactory);
                                if (isFunction(directive)) {
                                    directive = { compile: valueFn(directive) };
                                } else if (!directive.compile && directive.link) {
                                    directive.compile = valueFn(directive.link);
                                }
                                directive.priority = directive.priority || 0;
                                directive.index = index;
                                directive.name = directive.name || name;
                                directive.require = directive.require || (directive.controller && directive.name);
                                directive.restrict = directive.restrict || 'A';
                                directives.push(directive);
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                        });
                        return directives;
                    }]);
            }
            hasDirectives[name].push(directiveFactory);
        } else {
            forEach(name, reverseParams(registerDirective));
        }
        return this;
    };


    /**
     * @ngdoc method
     * @name $compileProvider#aHrefSanitizationWhitelist
     * @function
     *
     * @description
     * Retrieves or overrides the default regular expression that is used for whitelisting of safe
     * urls during a[href] sanitization.
     *
     * The sanitization is a security measure aimed at prevent XSS attacks via html links.
     *
     * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
     * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
     * regular expression. If a match is found, the original url is written into the dom. Otherwise,
     * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
     *
     * @param {RegExp=} regexp New regexp to whitelist urls with.
     * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
     *    chaining otherwise.
     */
    this.aHrefSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
            $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
            return this;
        } else {
            return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
        }
    };


    /**
     * @ngdoc method
     * @name $compileProvider#imgSrcSanitizationWhitelist
     * @function
     *
     * @description
     * Retrieves or overrides the default regular expression that is used for whitelisting of safe
     * urls during img[src] sanitization.
     *
     * The sanitization is a security measure aimed at prevent XSS attacks via html links.
     *
     * Any url about to be assigned to img[src] via data-binding is first normalized and turned into
     * an absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist`
     * regular expression. If a match is found, the original url is written into the dom. Otherwise,
     * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
     *
     * @param {RegExp=} regexp New regexp to whitelist urls with.
     * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
     *    chaining otherwise.
     */
    this.imgSrcSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
            $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
            return this;
        } else {
            return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
        }
    };

    this.$get = [
        '$injector', '$interpolate', '$exceptionHandler', '$http', '$templateCache', '$parse',
        '$controller', '$rootScope', '$document', '$sce', '$animate', '$$sanitizeUri',
        function($injector,   $interpolate,   $exceptionHandler,   $http,   $templateCache,   $parse,
                 $controller,   $rootScope,   $document,   $sce,   $animate,   $$sanitizeUri) {

            var Attributes = function(element, attr) {
                this.$$element = element;
                this.$attr = attr || {};
            };

            Attributes.prototype = {
                $normalize: directiveNormalize,


                /**
                 * @ngdoc method
                 * @name $compile.directive.Attributes#$addClass
                 * @function
                 *
                 * @description
                 * Adds the CSS class value specified by the classVal parameter to the element. If animations
                 * are enabled then an animation will be triggered for the class addition.
                 *
                 * @param {string} classVal The className value that will be added to the element
                 */
                $addClass : function(classVal) {
                    if(classVal && classVal.length > 0) {
                        $animate.addClass(this.$$element, classVal);
                    }
                },

                /**
                 * @ngdoc method
                 * @name $compile.directive.Attributes#$removeClass
                 * @function
                 *
                 * @description
                 * Removes the CSS class value specified by the classVal parameter from the element. If
                 * animations are enabled then an animation will be triggered for the class removal.
                 *
                 * @param {string} classVal The className value that will be removed from the element
                 */
                $removeClass : function(classVal) {
                    if(classVal && classVal.length > 0) {
                        $animate.removeClass(this.$$element, classVal);
                    }
                },

                /**
                 * @ngdoc method
                 * @name $compile.directive.Attributes#$updateClass
                 * @function
                 *
                 * @description
                 * Adds and removes the appropriate CSS class values to the element based on the difference
                 * between the new and old CSS class values (specified as newClasses and oldClasses).
                 *
                 * @param {string} newClasses The current CSS className value
                 * @param {string} oldClasses The former CSS className value
                 */
                $updateClass : function(newClasses, oldClasses) {
                    var toAdd = tokenDifference(newClasses, oldClasses);
                    var toRemove = tokenDifference(oldClasses, newClasses);

                    if(toAdd.length === 0) {
                        $animate.removeClass(this.$$element, toRemove);
                    } else if(toRemove.length === 0) {
                        $animate.addClass(this.$$element, toAdd);
                    } else {
                        $animate.setClass(this.$$element, toAdd, toRemove);
                    }
                },

                /**
                 * Set a normalized attribute on the element in a way such that all directives
                 * can share the attribute. This function properly handles boolean attributes.
                 * @param {string} key Normalized key. (ie ngAttribute)
                 * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
                 * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.
                 *     Defaults to true.
                 * @param {string=} attrName Optional none normalized name. Defaults to key.
                 */
                $set: function(key, value, writeAttr, attrName) {
                    // TODO: decide whether or not to throw an error if "class"
                    //is set through this function since it may cause $updateClass to
                    //become unstable.

                    var booleanKey = getBooleanAttrName(this.$$element[0], key),
                        normalizedVal,
                        nodeName;

                    if (booleanKey) {
                        this.$$element.prop(key, value);
                        attrName = booleanKey;
                    }

                    this[key] = value;

                    // translate normalized key to actual key
                    if (attrName) {
                        this.$attr[key] = attrName;
                    } else {
                        attrName = this.$attr[key];
                        if (!attrName) {
                            this.$attr[key] = attrName = snake_case(key, '-');
                        }
                    }

                    nodeName = nodeName_(this.$$element);

                    // sanitize a[href] and img[src] values
                    if ((nodeName === 'A' && key === 'href') ||
                        (nodeName === 'IMG' && key === 'src')) {
                        this[key] = value = $$sanitizeUri(value, key === 'src');
                    }

                    if (writeAttr !== false) {
                        if (value === null || value === undefined) {
                            this.$$element.removeAttr(attrName);
                        } else {
                            this.$$element.attr(attrName, value);
                        }
                    }

                    // fire observers
                    var $$observers = this.$$observers;
                    $$observers && forEach($$observers[key], function(fn) {
                        try {
                            fn(value);
                        } catch (e) {
                            $exceptionHandler(e);
                        }
                    });
                },


                /**
                 * @ngdoc method
                 * @name $compile.directive.Attributes#$observe
                 * @function
                 *
                 * @description
                 * Observes an interpolated attribute.
                 *
                 * The observer function will be invoked once during the next `$digest` following
                 * compilation. The observer is then invoked whenever the interpolated value
                 * changes.
                 *
                 * @param {string} key Normalized key. (ie ngAttribute) .
                 * @param {function(interpolatedValue)} fn Function that will be called whenever
                 the interpolated value of the attribute changes.
                 *        See the {@link guide/directive#Attributes Directives} guide for more info.
                 * @returns {function()} the `fn` parameter.
                 */
                $observe: function(key, fn) {
                    var attrs = this,
                        $$observers = (attrs.$$observers || (attrs.$$observers = {})),
                        listeners = ($$observers[key] || ($$observers[key] = []));

                    listeners.push(fn);
                    $rootScope.$evalAsync(function() {
                        if (!listeners.$$inter) {
                            // no one registered attribute interpolation function, so lets call it manually
                            fn(attrs[key]);
                        }
                    });
                    return fn;
                }
            };

            var startSymbol = $interpolate.startSymbol(),
                endSymbol = $interpolate.endSymbol(),
                denormalizeTemplate = (startSymbol == '{{' || endSymbol  == '}}')
                    ? identity
                    : function denormalizeTemplate(template) {
                    return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
                },
                NG_ATTR_BINDING = /^ngAttr[A-Z]/;


            return compile;

            //================================

            function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective,
                             previousCompileContext) {
                if (!($compileNodes instanceof jqLite)) {
                    // jquery always rewraps, whereas we need to preserve the original selector so that we can
                    // modify it.
                    $compileNodes = jqLite($compileNodes);
                }
                // We can not compile top level text elements since text nodes can be merged and we will
                // not be able to attach scope data to them, so we will wrap them in <span>
                forEach($compileNodes, function(node, index){
                    if (node.nodeType == 3 /* text node */ && node.nodeValue.match(/\S+/) /* non-empty */ ) {
                        $compileNodes[index] = node = jqLite(node).wrap('<span></span>').parent()[0];
                    }
                });
                var compositeLinkFn =
                    compileNodes($compileNodes, transcludeFn, $compileNodes,
                        maxPriority, ignoreDirective, previousCompileContext);
                safeAddClass($compileNodes, 'ng-scope');
                return function publicLinkFn(scope, cloneConnectFn, transcludeControllers){
                    assertArg(scope, 'scope');
                    // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart
                    // and sometimes changes the structure of the DOM.
                    var $linkNode = cloneConnectFn
                        ? JQLitePrototype.clone.call($compileNodes) // IMPORTANT!!!
                        : $compileNodes;

                    forEach(transcludeControllers, function(instance, name) {
                        $linkNode.data('$' + name + 'Controller', instance);
                    });

                    // Attach scope only to non-text nodes.
                    for(var i = 0, ii = $linkNode.length; i<ii; i++) {
                        var node = $linkNode[i],
                            nodeType = node.nodeType;
                        if (nodeType === 1 /* element */ || nodeType === 9 /* document */) {
                            $linkNode.eq(i).data('$scope', scope);
                        }
                    }

                    if (cloneConnectFn) cloneConnectFn($linkNode, scope);
                    if (compositeLinkFn) compositeLinkFn(scope, $linkNode, $linkNode);
                    return $linkNode;
                };
            }

            function safeAddClass($element, className) {
                try {
                    $element.addClass(className);
                } catch(e) {
                    // ignore, since it means that we are trying to set class on
                    // SVG element, where class name is read-only.
                }
            }

            /**
             * Compile function matches each node in nodeList against the directives. Once all directives
             * for a particular node are collected their compile functions are executed. The compile
             * functions return values - the linking functions - are combined into a composite linking
             * function, which is the a linking function for the node.
             *
             * @param {NodeList} nodeList an array of nodes or NodeList to compile
             * @param {function(angular.Scope, cloneAttachFn=)} transcludeFn A linking function, where the
             *        scope argument is auto-generated to the new child of the transcluded parent scope.
             * @param {DOMElement=} $rootElement If the nodeList is the root of the compilation tree then
             *        the rootElement must be set the jqLite collection of the compile root. This is
             *        needed so that the jqLite collection items can be replaced with widgets.
             * @param {number=} maxPriority Max directive priority.
             * @returns {Function} A composite linking function of all of the matched directives or null.
             */
            function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective,
                                  previousCompileContext) {
                var linkFns = [],
                    attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound;

                for (var i = 0; i < nodeList.length; i++) {
                    attrs = new Attributes();

                    // we must always refer to nodeList[i] since the nodes can be replaced underneath us.
                    directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined,
                        ignoreDirective);

                    nodeLinkFn = (directives.length)
                        ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement,
                        null, [], [], previousCompileContext)
                        : null;

                    if (nodeLinkFn && nodeLinkFn.scope) {
                        safeAddClass(jqLite(nodeList[i]), 'ng-scope');
                    }

                    childLinkFn = (nodeLinkFn && nodeLinkFn.terminal ||
                        !(childNodes = nodeList[i].childNodes) ||
                        !childNodes.length)
                        ? null
                        : compileNodes(childNodes,
                        nodeLinkFn ? nodeLinkFn.transclude : transcludeFn);

                    linkFns.push(nodeLinkFn, childLinkFn);
                    linkFnFound = linkFnFound || nodeLinkFn || childLinkFn;
                    //use the previous context only for the first element in the virtual group
                    previousCompileContext = null;
                }

                // return a linking function if we have found anything, null otherwise
                return linkFnFound ? compositeLinkFn : null;

                function compositeLinkFn(scope, nodeList, $rootElement, boundTranscludeFn) {
                    var nodeLinkFn, childLinkFn, node, $node, childScope, childTranscludeFn, i, ii, n;

                    // copy nodeList so that linking doesn't break due to live list updates.
                    var nodeListLength = nodeList.length,
                        stableNodeList = new Array(nodeListLength);
                    for (i = 0; i < nodeListLength; i++) {
                        stableNodeList[i] = nodeList[i];
                    }

                    for(i = 0, n = 0, ii = linkFns.length; i < ii; n++) {
                        node = stableNodeList[n];
                        nodeLinkFn = linkFns[i++];
                        childLinkFn = linkFns[i++];
                        $node = jqLite(node);

                        if (nodeLinkFn) {
                            if (nodeLinkFn.scope) {
                                childScope = scope.$new();
                                $node.data('$scope', childScope);
                            } else {
                                childScope = scope;
                            }
                            childTranscludeFn = nodeLinkFn.transclude;
                            if (childTranscludeFn || (!boundTranscludeFn && transcludeFn)) {
                                nodeLinkFn(childLinkFn, childScope, node, $rootElement,
                                    createBoundTranscludeFn(scope, childTranscludeFn || transcludeFn)
                                );
                            } else {
                                nodeLinkFn(childLinkFn, childScope, node, $rootElement, boundTranscludeFn);
                            }
                        } else if (childLinkFn) {
                            childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);
                        }
                    }
                }
            }

            function createBoundTranscludeFn(scope, transcludeFn) {
                return function boundTranscludeFn(transcludedScope, cloneFn, controllers) {
                    var scopeCreated = false;

                    if (!transcludedScope) {
                        transcludedScope = scope.$new();
                        transcludedScope.$$transcluded = true;
                        scopeCreated = true;
                    }

                    var clone = transcludeFn(transcludedScope, cloneFn, controllers);
                    if (scopeCreated) {
                        clone.on('$destroy', bind(transcludedScope, transcludedScope.$destroy));
                    }
                    return clone;
                };
            }

            /**
             * Looks for directives on the given node and adds them to the directive collection which is
             * sorted.
             *
             * @param node Node to search.
             * @param directives An array to which the directives are added to. This array is sorted before
             *        the function returns.
             * @param attrs The shared attrs object which is used to populate the normalized attributes.
             * @param {number=} maxPriority Max directive priority.
             */
            function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
                var nodeType = node.nodeType,
                    attrsMap = attrs.$attr,
                    match,
                    className;

                switch(nodeType) {
                    case 1: /* Element */
                        // use the node name: <directive>
                        addDirective(directives,
                            directiveNormalize(nodeName_(node).toLowerCase()), 'E', maxPriority, ignoreDirective);

                        // iterate over the attributes
                        for (var attr, name, nName, ngAttrName, value, nAttrs = node.attributes,
                                 j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
                            var attrStartName = false;
                            var attrEndName = false;

                            attr = nAttrs[j];
                            if (!msie || msie >= 8 || attr.specified) {
                                name = attr.name;
                                // support ngAttr attribute binding
                                ngAttrName = directiveNormalize(name);
                                if (NG_ATTR_BINDING.test(ngAttrName)) {
                                    name = snake_case(ngAttrName.substr(6), '-');
                                }

                                var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
                                if (ngAttrName === directiveNName + 'Start') {
                                    attrStartName = name;
                                    attrEndName = name.substr(0, name.length - 5) + 'end';
                                    name = name.substr(0, name.length - 6);
                                }

                                nName = directiveNormalize(name.toLowerCase());
                                attrsMap[nName] = name;
                                attrs[nName] = value = trim(attr.value);
                                if (getBooleanAttrName(node, nName)) {
                                    attrs[nName] = true; // presence means true
                                }
                                addAttrInterpolateDirective(node, directives, value, nName);
                                addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName,
                                    attrEndName);
                            }
                        }

                        // use class as directive
                        className = node.className;
                        if (isString(className) && className !== '') {
                            while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                                nName = directiveNormalize(match[2]);
                                if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                                    attrs[nName] = trim(match[3]);
                                }
                                className = className.substr(match.index + match[0].length);
                            }
                        }
                        break;
                    case 3: /* Text Node */
                        addTextInterpolateDirective(directives, node.nodeValue);
                        break;
                    case 8: /* Comment */
                        try {
                            match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
                            if (match) {
                                nName = directiveNormalize(match[1]);
                                if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                                    attrs[nName] = trim(match[2]);
                                }
                            }
                        } catch (e) {
                            // turns out that under some circumstances IE9 throws errors when one attempts to read
                            // comment's node value.
                            // Just ignore it and continue. (Can't seem to reproduce in test case.)
                        }
                        break;
                }

                directives.sort(byPriority);
                return directives;
            }

            /**
             * Given a node with an directive-start it collects all of the siblings until it finds
             * directive-end.
             * @param node
             * @param attrStart
             * @param attrEnd
             * @returns {*}
             */
            function groupScan(node, attrStart, attrEnd) {
                var nodes = [];
                var depth = 0;
                if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
                    var startNode = node;
                    do {
                        if (!node) {
                            throw $compileMinErr('uterdir',
                                "Unterminated attribute, found '{0}' but no matching '{1}' found.",
                                attrStart, attrEnd);
                        }
                        if (node.nodeType == 1 /** Element **/) {
                            if (node.hasAttribute(attrStart)) depth++;
                            if (node.hasAttribute(attrEnd)) depth--;
                        }
                        nodes.push(node);
                        node = node.nextSibling;
                    } while (depth > 0);
                } else {
                    nodes.push(node);
                }

                return jqLite(nodes);
            }

            /**
             * Wrapper for linking function which converts normal linking function into a grouped
             * linking function.
             * @param linkFn
             * @param attrStart
             * @param attrEnd
             * @returns {Function}
             */
            function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                return function(scope, element, attrs, controllers, transcludeFn) {
                    element = groupScan(element[0], attrStart, attrEnd);
                    return linkFn(scope, element, attrs, controllers, transcludeFn);
                };
            }

            /**
             * Once the directives have been collected, their compile functions are executed. This method
             * is responsible for inlining directive templates as well as terminating the application
             * of the directives if the terminal directive has been reached.
             *
             * @param {Array} directives Array of collected directives to execute their compile function.
             *        this needs to be pre-sorted by priority order.
             * @param {Node} compileNode The raw DOM node to apply the compile functions to
             * @param {Object} templateAttrs The shared attribute function
             * @param {function(angular.Scope, cloneAttachFn=)} transcludeFn A linking function, where the
             *                                                  scope argument is auto-generated to the new
             *                                                  child of the transcluded parent scope.
             * @param {JQLite} jqCollection If we are working on the root of the compile tree then this
             *                              argument has the root jqLite array so that we can replace nodes
             *                              on it.
             * @param {Object=} originalReplaceDirective An optional directive that will be ignored when
             *                                           compiling the transclusion.
             * @param {Array.<Function>} preLinkFns
             * @param {Array.<Function>} postLinkFns
             * @param {Object} previousCompileContext Context used for previous compilation of the current
             *                                        node
             * @returns {Function} linkFn
             */
            function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn,
                                           jqCollection, originalReplaceDirective, preLinkFns, postLinkFns,
                                           previousCompileContext) {
                previousCompileContext = previousCompileContext || {};

                var terminalPriority = -Number.MAX_VALUE,
                    newScopeDirective,
                    controllerDirectives = previousCompileContext.controllerDirectives,
                    newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective,
                    templateDirective = previousCompileContext.templateDirective,
                    nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective,
                    hasTranscludeDirective = false,
                    hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective,
                    $compileNode = templateAttrs.$$element = jqLite(compileNode),
                    directive,
                    directiveName,
                    $template,
                    replaceDirective = originalReplaceDirective,
                    childTranscludeFn = transcludeFn,
                    linkFn,
                    directiveValue;

                // executes all directives on the current element
                for(var i = 0, ii = directives.length; i < ii; i++) {
                    directive = directives[i];
                    var attrStart = directive.$$start;
                    var attrEnd = directive.$$end;

                    // collect multiblock sections
                    if (attrStart) {
                        $compileNode = groupScan(compileNode, attrStart, attrEnd);
                    }
                    $template = undefined;

                    if (terminalPriority > directive.priority) {
                        break; // prevent further processing of directives
                    }

                    if (directiveValue = directive.scope) {
                        newScopeDirective = newScopeDirective || directive;

                        // skip the check for directives with async templates, we'll check the derived sync
                        // directive when the template arrives
                        if (!directive.templateUrl) {
                            assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive,
                                $compileNode);
                            if (isObject(directiveValue)) {
                                newIsolateScopeDirective = directive;
                            }
                        }
                    }

                    directiveName = directive.name;

                    if (!directive.templateUrl && directive.controller) {
                        directiveValue = directive.controller;
                        controllerDirectives = controllerDirectives || {};
                        assertNoDuplicate("'" + directiveName + "' controller",
                            controllerDirectives[directiveName], directive, $compileNode);
                        controllerDirectives[directiveName] = directive;
                    }

                    if (directiveValue = directive.transclude) {
                        hasTranscludeDirective = true;

                        // Special case ngIf and ngRepeat so that we don't complain about duplicate transclusion.
                        // This option should only be used by directives that know how to safely handle element transclusion,
                        // where the transcluded nodes are added or replaced after linking.
                        if (!directive.$$tlb) {
                            assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
                            nonTlbTranscludeDirective = directive;
                        }

                        if (directiveValue == 'element') {
                            hasElementTranscludeDirective = true;
                            terminalPriority = directive.priority;
                            $template = groupScan(compileNode, attrStart, attrEnd);
                            $compileNode = templateAttrs.$$element =
                                jqLite(document.createComment(' ' + directiveName + ': ' +
                                    templateAttrs[directiveName] + ' '));
                            compileNode = $compileNode[0];
                            replaceWith(jqCollection, jqLite(sliceArgs($template)), compileNode);

                            childTranscludeFn = compile($template, transcludeFn, terminalPriority,
                                    replaceDirective && replaceDirective.name, {
                                    // Don't pass in:
                                    // - controllerDirectives - otherwise we'll create duplicates controllers
                                    // - newIsolateScopeDirective or templateDirective - combining templates with
                                    //   element transclusion doesn't make sense.
                                    //
                                    // We need only nonTlbTranscludeDirective so that we prevent putting transclusion
                                    // on the same element more than once.
                                    nonTlbTranscludeDirective: nonTlbTranscludeDirective
                                });
                        } else {
                            $template = jqLite(jqLiteClone(compileNode)).contents();
                            $compileNode.empty(); // clear contents
                            childTranscludeFn = compile($template, transcludeFn);
                        }
                    }

                    if (directive.template) {
                        assertNoDuplicate('template', templateDirective, directive, $compileNode);
                        templateDirective = directive;

                        directiveValue = (isFunction(directive.template))
                            ? directive.template($compileNode, templateAttrs)
                            : directive.template;

                        directiveValue = denormalizeTemplate(directiveValue);

                        if (directive.replace) {
                            replaceDirective = directive;
                            if (jqLiteIsTextNode(directiveValue)) {
                                $template = [];
                            } else {
                                $template = jqLite(directiveValue);
                            }
                            compileNode = $template[0];

                            if ($template.length != 1 || compileNode.nodeType !== 1) {
                                throw $compileMinErr('tplrt',
                                    "Template for directive '{0}' must have exactly one root element. {1}",
                                    directiveName, '');
                            }

                            replaceWith(jqCollection, $compileNode, compileNode);

                            var newTemplateAttrs = {$attr: {}};

                            // combine directives from the original node and from the template:
                            // - take the array of directives for this element
                            // - split it into two parts, those that already applied (processed) and those that weren't (unprocessed)
                            // - collect directives from the template and sort them by priority
                            // - combine directives as: processed + template + unprocessed
                            var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                            var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));

                            if (newIsolateScopeDirective) {
                                markDirectivesAsIsolate(templateDirectives);
                            }
                            directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                            mergeTemplateAttributes(templateAttrs, newTemplateAttrs);

                            ii = directives.length;
                        } else {
                            $compileNode.html(directiveValue);
                        }
                    }

                    if (directive.templateUrl) {
                        assertNoDuplicate('template', templateDirective, directive, $compileNode);
                        templateDirective = directive;

                        if (directive.replace) {
                            replaceDirective = directive;
                        }

                        nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode,
                            templateAttrs, jqCollection, childTranscludeFn, preLinkFns, postLinkFns, {
                                controllerDirectives: controllerDirectives,
                                newIsolateScopeDirective: newIsolateScopeDirective,
                                templateDirective: templateDirective,
                                nonTlbTranscludeDirective: nonTlbTranscludeDirective
                            });
                        ii = directives.length;
                    } else if (directive.compile) {
                        try {
                            linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                            if (isFunction(linkFn)) {
                                addLinkFns(null, linkFn, attrStart, attrEnd);
                            } else if (linkFn) {
                                addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                            }
                        } catch (e) {
                            $exceptionHandler(e, startingTag($compileNode));
                        }
                    }

                    if (directive.terminal) {
                        nodeLinkFn.terminal = true;
                        terminalPriority = Math.max(terminalPriority, directive.priority);
                    }

                }

                nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
                nodeLinkFn.transclude = hasTranscludeDirective && childTranscludeFn;
                previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;

                // might be normal or delayed nodeLinkFn depending on if templateUrl is present
                return nodeLinkFn;

                ////////////////////

                function addLinkFns(pre, post, attrStart, attrEnd) {
                    if (pre) {
                        if (attrStart) pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
                        pre.require = directive.require;
                        if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                            pre = cloneAndAnnotateFn(pre, {isolateScope: true});
                        }
                        preLinkFns.push(pre);
                    }
                    if (post) {
                        if (attrStart) post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
                        post.require = directive.require;
                        if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                            post = cloneAndAnnotateFn(post, {isolateScope: true});
                        }
                        postLinkFns.push(post);
                    }
                }


                function getControllers(require, $element, elementControllers) {
                    var value, retrievalMethod = 'data', optional = false;
                    if (isString(require)) {
                        while((value = require.charAt(0)) == '^' || value == '?') {
                            require = require.substr(1);
                            if (value == '^') {
                                retrievalMethod = 'inheritedData';
                            }
                            optional = optional || value == '?';
                        }
                        value = null;

                        if (elementControllers && retrievalMethod === 'data') {
                            value = elementControllers[require];
                        }
                        value = value || $element[retrievalMethod]('$' + require + 'Controller');

                        if (!value && !optional) {
                            throw $compileMinErr('ctreq',
                                "Controller '{0}', required by directive '{1}', can't be found!",
                                require, directiveName);
                        }
                        return value;
                    } else if (isArray(require)) {
                        value = [];
                        forEach(require, function(require) {
                            value.push(getControllers(require, $element, elementControllers));
                        });
                    }
                    return value;
                }


                function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
                    var attrs, $element, i, ii, linkFn, controller, isolateScope, elementControllers = {}, transcludeFn;

                    if (compileNode === linkNode) {
                        attrs = templateAttrs;
                    } else {
                        attrs = shallowCopy(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr));
                    }
                    $element = attrs.$$element;

                    if (newIsolateScopeDirective) {
                        var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
                        var $linkNode = jqLite(linkNode);

                        isolateScope = scope.$new(true);

                        if (templateDirective && (templateDirective === newIsolateScopeDirective.$$originalDirective)) {
                            $linkNode.data('$isolateScope', isolateScope) ;
                        } else {
                            $linkNode.data('$isolateScopeNoTemplate', isolateScope);
                        }



                        safeAddClass($linkNode, 'ng-isolate-scope');

                        forEach(newIsolateScopeDirective.scope, function(definition, scopeName) {
                            var match = definition.match(LOCAL_REGEXP) || [],
                                attrName = match[3] || scopeName,
                                optional = (match[2] == '?'),
                                mode = match[1], // @, =, or &
                                lastValue,
                                parentGet, parentSet, compare;

                            isolateScope.$$isolateBindings[scopeName] = mode + attrName;

                            switch (mode) {

                                case '@':
                                    attrs.$observe(attrName, function(value) {
                                        isolateScope[scopeName] = value;
                                    });
                                    attrs.$$observers[attrName].$$scope = scope;
                                    if( attrs[attrName] ) {
                                        // If the attribute has been provided then we trigger an interpolation to ensure
                                        // the value is there for use in the link fn
                                        isolateScope[scopeName] = $interpolate(attrs[attrName])(scope);
                                    }
                                    break;

                                case '=':
                                    if (optional && !attrs[attrName]) {
                                        return;
                                    }
                                    parentGet = $parse(attrs[attrName]);
                                    if (parentGet.literal) {
                                        compare = equals;
                                    } else {
                                        compare = function(a,b) { return a === b; };
                                    }
                                    parentSet = parentGet.assign || function() {
                                        // reset the change, or we will throw this exception on every $digest
                                        lastValue = isolateScope[scopeName] = parentGet(scope);
                                        throw $compileMinErr('nonassign',
                                            "Expression '{0}' used with directive '{1}' is non-assignable!",
                                            attrs[attrName], newIsolateScopeDirective.name);
                                    };
                                    lastValue = isolateScope[scopeName] = parentGet(scope);
                                    isolateScope.$watch(function parentValueWatch() {
                                        var parentValue = parentGet(scope);
                                        if (!compare(parentValue, isolateScope[scopeName])) {
                                            // we are out of sync and need to copy
                                            if (!compare(parentValue, lastValue)) {
                                                // parent changed and it has precedence
                                                isolateScope[scopeName] = parentValue;
                                            } else {
                                                // if the parent can be assigned then do so
                                                parentSet(scope, parentValue = isolateScope[scopeName]);
                                            }
                                        }
                                        return lastValue = parentValue;
                                    }, null, parentGet.literal);
                                    break;

                                case '&':
                                    parentGet = $parse(attrs[attrName]);
                                    isolateScope[scopeName] = function(locals) {
                                        return parentGet(scope, locals);
                                    };
                                    break;

                                default:
                                    throw $compileMinErr('iscp',
                                            "Invalid isolate scope definition for directive '{0}'." +
                                            " Definition: {... {1}: '{2}' ...}",
                                        newIsolateScopeDirective.name, scopeName, definition);
                            }
                        });
                    }
                    transcludeFn = boundTranscludeFn && controllersBoundTransclude;
                    if (controllerDirectives) {
                        forEach(controllerDirectives, function(directive) {
                            var locals = {
                                $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                                $element: $element,
                                $attrs: attrs,
                                $transclude: transcludeFn
                            }, controllerInstance;

                            controller = directive.controller;
                            if (controller == '@') {
                                controller = attrs[directive.name];
                            }

                            controllerInstance = $controller(controller, locals);
                            // For directives with element transclusion the element is a comment,
                            // but jQuery .data doesn't support attaching data to comment nodes as it's hard to
                            // clean up (http://bugs.jquery.com/ticket/8335).
                            // Instead, we save the controllers for the element in a local hash and attach to .data
                            // later, once we have the actual element.
                            elementControllers[directive.name] = controllerInstance;
                            if (!hasElementTranscludeDirective) {
                                $element.data('$' + directive.name + 'Controller', controllerInstance);
                            }

                            if (directive.controllerAs) {
                                locals.$scope[directive.controllerAs] = controllerInstance;
                            }
                        });
                    }

                    // PRELINKING
                    for(i = 0, ii = preLinkFns.length; i < ii; i++) {
                        try {
                            linkFn = preLinkFns[i];
                            linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs,
                                    linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
                        } catch (e) {
                            $exceptionHandler(e, startingTag($element));
                        }
                    }

                    // RECURSION
                    // We only pass the isolate scope, if the isolate directive has a template,
                    // otherwise the child elements do not belong to the isolate directive.
                    var scopeToChild = scope;
                    if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
                        scopeToChild = isolateScope;
                    }
                    childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);

                    // POSTLINKING
                    for(i = postLinkFns.length - 1; i >= 0; i--) {
                        try {
                            linkFn = postLinkFns[i];
                            linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs,
                                    linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
                        } catch (e) {
                            $exceptionHandler(e, startingTag($element));
                        }
                    }

                    // This is the function that is injected as `$transclude`.
                    function controllersBoundTransclude(scope, cloneAttachFn) {
                        var transcludeControllers;

                        // no scope passed
                        if (arguments.length < 2) {
                            cloneAttachFn = scope;
                            scope = undefined;
                        }

                        if (hasElementTranscludeDirective) {
                            transcludeControllers = elementControllers;
                        }

                        return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers);
                    }
                }
            }

            function markDirectivesAsIsolate(directives) {
                // mark all directives as needing isolate scope.
                for (var j = 0, jj = directives.length; j < jj; j++) {
                    directives[j] = inherit(directives[j], {$$isolateScope: true});
                }
            }

            /**
             * looks up the directive and decorates it with exception handling and proper parameters. We
             * call this the boundDirective.
             *
             * @param {string} name name of the directive to look up.
             * @param {string} location The directive must be found in specific format.
             *   String containing any of theses characters:
             *
             *   * `E`: element name
             *   * `A': attribute
             *   * `C`: class
             *   * `M`: comment
             * @returns {boolean} true if directive was added.
             */
            function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName,
                                  endAttrName) {
                if (name === ignoreDirective) return null;
                var match = null;
                if (hasDirectives.hasOwnProperty(name)) {
                    for(var directive, directives = $injector.get(name + Suffix),
                            i = 0, ii = directives.length; i<ii; i++) {
                        try {
                            directive = directives[i];
                            if ( (maxPriority === undefined || maxPriority > directive.priority) &&
                                directive.restrict.indexOf(location) != -1) {
                                if (startAttrName) {
                                    directive = inherit(directive, {$$start: startAttrName, $$end: endAttrName});
                                }
                                tDirectives.push(directive);
                                match = directive;
                            }
                        } catch(e) { $exceptionHandler(e); }
                    }
                }
                return match;
            }


            /**
             * When the element is replaced with HTML template then the new attributes
             * on the template need to be merged with the existing attributes in the DOM.
             * The desired effect is to have both of the attributes present.
             *
             * @param {object} dst destination attributes (original DOM)
             * @param {object} src source attributes (from the directive template)
             */
            function mergeTemplateAttributes(dst, src) {
                var srcAttr = src.$attr,
                    dstAttr = dst.$attr,
                    $element = dst.$$element;

                // reapply the old attributes to the new element
                forEach(dst, function(value, key) {
                    if (key.charAt(0) != '$') {
                        if (src[key]) {
                            value += (key === 'style' ? ';' : ' ') + src[key];
                        }
                        dst.$set(key, value, true, srcAttr[key]);
                    }
                });

                // copy the new attributes on the old attrs object
                forEach(src, function(value, key) {
                    if (key == 'class') {
                        safeAddClass($element, value);
                        dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
                    } else if (key == 'style') {
                        $element.attr('style', $element.attr('style') + ';' + value);
                        dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
                        // `dst` will never contain hasOwnProperty as DOM parser won't let it.
                        // You will get an "InvalidCharacterError: DOM Exception 5" error if you
                        // have an attribute like "has-own-property" or "data-has-own-property", etc.
                    } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
                        dst[key] = value;
                        dstAttr[key] = srcAttr[key];
                    }
                });
            }


            function compileTemplateUrl(directives, $compileNode, tAttrs,
                                        $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
                var linkQueue = [],
                    afterTemplateNodeLinkFn,
                    afterTemplateChildLinkFn,
                    beforeTemplateCompileNode = $compileNode[0],
                    origAsyncDirective = directives.shift(),
                // The fact that we have to copy and patch the directive seems wrong!
                    derivedSyncDirective = extend({}, origAsyncDirective, {
                        templateUrl: null, transclude: null, replace: null, $$originalDirective: origAsyncDirective
                    }),
                    templateUrl = (isFunction(origAsyncDirective.templateUrl))
                        ? origAsyncDirective.templateUrl($compileNode, tAttrs)
                        : origAsyncDirective.templateUrl;

                $compileNode.empty();

                $http.get($sce.getTrustedResourceUrl(templateUrl), {cache: $templateCache}).
                    success(function(content) {
                        var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;

                        content = denormalizeTemplate(content);

                        if (origAsyncDirective.replace) {
                            if (jqLiteIsTextNode(content)) {
                                $template = [];
                            } else {
                                $template = jqLite(content);
                            }
                            compileNode = $template[0];

                            if ($template.length != 1 || compileNode.nodeType !== 1) {
                                throw $compileMinErr('tplrt',
                                    "Template for directive '{0}' must have exactly one root element. {1}",
                                    origAsyncDirective.name, templateUrl);
                            }

                            tempTemplateAttrs = {$attr: {}};
                            replaceWith($rootElement, $compileNode, compileNode);
                            var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);

                            if (isObject(origAsyncDirective.scope)) {
                                markDirectivesAsIsolate(templateDirectives);
                            }
                            directives = templateDirectives.concat(directives);
                            mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
                        } else {
                            compileNode = beforeTemplateCompileNode;
                            $compileNode.html(content);
                        }

                        directives.unshift(derivedSyncDirective);

                        afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs,
                            childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns,
                            previousCompileContext);
                        forEach($rootElement, function(node, i) {
                            if (node == compileNode) {
                                $rootElement[i] = $compileNode[0];
                            }
                        });
                        afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);


                        while(linkQueue.length) {
                            var scope = linkQueue.shift(),
                                beforeTemplateLinkNode = linkQueue.shift(),
                                linkRootElement = linkQueue.shift(),
                                boundTranscludeFn = linkQueue.shift(),
                                linkNode = $compileNode[0];

                            if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                                var oldClasses = beforeTemplateLinkNode.className;

                                if (!(previousCompileContext.hasElementTranscludeDirective &&
                                    origAsyncDirective.replace)) {
                                    // it was cloned therefore we have to clone as well.
                                    linkNode = jqLiteClone(compileNode);
                                }

                                replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);

                                // Copy in CSS classes from original node
                                safeAddClass(jqLite(linkNode), oldClasses);
                            }
                            if (afterTemplateNodeLinkFn.transclude) {
                                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude);
                            } else {
                                childBoundTranscludeFn = boundTranscludeFn;
                            }
                            afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement,
                                childBoundTranscludeFn);
                        }
                        linkQueue = null;
                    }).
                    error(function(response, code, headers, config) {
                        throw $compileMinErr('tpload', 'Failed to load template: {0}', config.url);
                    });

                return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
                    if (linkQueue) {
                        linkQueue.push(scope);
                        linkQueue.push(node);
                        linkQueue.push(rootElement);
                        linkQueue.push(boundTranscludeFn);
                    } else {
                        afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, boundTranscludeFn);
                    }
                };
            }


            /**
             * Sorting function for bound directives.
             */
            function byPriority(a, b) {
                var diff = b.priority - a.priority;
                if (diff !== 0) return diff;
                if (a.name !== b.name) return (a.name < b.name) ? -1 : 1;
                return a.index - b.index;
            }


            function assertNoDuplicate(what, previousDirective, directive, element) {
                if (previousDirective) {
                    throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}',
                        previousDirective.name, directive.name, what, startingTag(element));
                }
            }


            function addTextInterpolateDirective(directives, text) {
                var interpolateFn = $interpolate(text, true);
                if (interpolateFn) {
                    directives.push({
                        priority: 0,
                        compile: valueFn(function textInterpolateLinkFn(scope, node) {
                            var parent = node.parent(),
                                bindings = parent.data('$binding') || [];
                            bindings.push(interpolateFn);
                            safeAddClass(parent.data('$binding', bindings), 'ng-binding');
                            scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                                node[0].nodeValue = value;
                            });
                        })
                    });
                }
            }


            function getTrustedContext(node, attrNormalizedName) {
                if (attrNormalizedName == "srcdoc") {
                    return $sce.HTML;
                }
                var tag = nodeName_(node);
                // maction[xlink:href] can source SVG.  It's not limited to <maction>.
                if (attrNormalizedName == "xlinkHref" ||
                    (tag == "FORM" && attrNormalizedName == "action") ||
                    (tag != "IMG" && (attrNormalizedName == "src" ||
                        attrNormalizedName == "ngSrc"))) {
                    return $sce.RESOURCE_URL;
                }
            }


            function addAttrInterpolateDirective(node, directives, value, name) {
                var interpolateFn = $interpolate(value, true);

                // no interpolation found -> ignore
                if (!interpolateFn) return;


                if (name === "multiple" && nodeName_(node) === "SELECT") {
                    throw $compileMinErr("selmulti",
                        "Binding to the 'multiple' attribute is not supported. Element: {0}",
                        startingTag(node));
                }

                directives.push({
                    priority: 100,
                    compile: function() {
                        return {
                            pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                                var $$observers = (attr.$$observers || (attr.$$observers = {}));

                                if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                                    throw $compileMinErr('nodomevents',
                                            "Interpolations for HTML DOM event attributes are disallowed.  Please use the " +
                                            "ng- versions (such as ng-click instead of onclick) instead.");
                                }

                                // we need to interpolate again, in case the attribute value has been updated
                                // (e.g. by another directive's compile function)
                                interpolateFn = $interpolate(attr[name], true, getTrustedContext(node, name));

                                // if attribute was updated so that there is no interpolation going on we don't want to
                                // register any observers
                                if (!interpolateFn) return;

                                // TODO(i): this should likely be attr.$set(name, iterpolateFn(scope) so that we reset the
                                // actual attr value
                                attr[name] = interpolateFn(scope);
                                ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                                (attr.$$observers && attr.$$observers[name].$$scope || scope).
                                    $watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                                        //special case for class attribute addition + removal
                                        //so that class changes can tap into the animation
                                        //hooks provided by the $animate service. Be sure to
                                        //skip animations when the first digest occurs (when
                                        //both the new and the old values are the same) since
                                        //the CSS classes are the non-interpolated values
                                        if(name === 'class' && newValue != oldValue) {
                                            attr.$updateClass(newValue, oldValue);
                                        } else {
                                            attr.$set(name, newValue);
                                        }
                                    });
                            }
                        };
                    }
                });
            }


            /**
             * This is a special jqLite.replaceWith, which can replace items which
             * have no parents, provided that the containing jqLite collection is provided.
             *
             * @param {JqLite=} $rootElement The root of the compile tree. Used so that we can replace nodes
             *                               in the root of the tree.
             * @param {JqLite} elementsToRemove The jqLite element which we are going to replace. We keep
             *                                  the shell, but replace its DOM node reference.
             * @param {Node} newNode The new DOM node.
             */
            function replaceWith($rootElement, elementsToRemove, newNode) {
                var firstElementToRemove = elementsToRemove[0],
                    removeCount = elementsToRemove.length,
                    parent = firstElementToRemove.parentNode,
                    i, ii;

                if ($rootElement) {
                    for(i = 0, ii = $rootElement.length; i < ii; i++) {
                        if ($rootElement[i] == firstElementToRemove) {
                            $rootElement[i++] = newNode;
                            for (var j = i, j2 = j + removeCount - 1,
                                     jj = $rootElement.length;
                                 j < jj; j++, j2++) {
                                if (j2 < jj) {
                                    $rootElement[j] = $rootElement[j2];
                                } else {
                                    delete $rootElement[j];
                                }
                            }
                            $rootElement.length -= removeCount - 1;
                            break;
                        }
                    }
                }

                if (parent) {
                    parent.replaceChild(newNode, firstElementToRemove);
                }
                var fragment = document.createDocumentFragment();
                fragment.appendChild(firstElementToRemove);
                newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
                for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
                    var element = elementsToRemove[k];
                    jqLite(element).remove(); // must do this way to clean up expando
                    fragment.appendChild(element);
                    delete elementsToRemove[k];
                }

                elementsToRemove[0] = newNode;
                elementsToRemove.length = 1;
            }


            function cloneAndAnnotateFn(fn, annotation) {
                return extend(function() { return fn.apply(null, arguments); }, fn, annotation);
            }
        }];
}





/* sce functionality source: https://github.com/angular/angular.js/blob/master/src/ng/sce.js */
var $sceMinErr = minErr('$sce');
var SCE_CONTEXTS = {
    HTML: 'html',
    CSS: 'css',
    URL: 'url',
    // RESOURCE_URL is a subtype of URL used in contexts where a privileged resource is sourced from a
    // url.  (e.g. ng-include, script src, templateUrl)
    RESOURCE_URL: 'resourceUrl',
    JS: 'js'
};

// Helper functions follow.

// Copied from:
// http://docs.closure-library.googlecode.com/git/closure_goog_string_string.js.source.html#line962
// Prereq: s is a string.
function escapeForRegexp(s) {
    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
}


function adjustMatcher(matcher) {
    if (matcher === 'self') {
        return matcher;
    } else if (isString(matcher)) {
        // Strings match exactly except for 2 wildcards - '*' and '**'.
        // '*' matches any character except those from the set ':/.?&'.
        // '**' matches any character (like .* in a RegExp).
        // More than 2 *'s raises an error as it's ill defined.
        if (matcher.indexOf('***') > -1) {
            throw $sceMinErr('iwcard',
                'Illegal sequence *** in string matcher.  String: {0}', matcher);
        }
        matcher = escapeForRegexp(matcher).
            replace('\\*\\*', '.*').
            replace('\\*', '[^:/.?&;]*');
        return new RegExp('^' + matcher + '$');
    } else if (isRegExp(matcher)) {
        // The only other type of matcher allowed is a Regexp.
        // Match entire URL / disallow partial matches.
        // Flags are reset (i.e. no global, ignoreCase or multiline)
        return new RegExp('^' + matcher.source + '$');
    } else {
        throw $sceMinErr('imatcher',
            'Matchers may only be "self", string patterns or RegExp objects');
    }
}


function adjustMatchers(matchers) {
    var adjustedMatchers = [];
    if (isDefined(matchers)) {
        forEach(matchers, function(matcher) {
            adjustedMatchers.push(adjustMatcher(matcher));
        });
    }
    return adjustedMatchers;
}

/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/sce.js
 * @line 132
 */
function $SceDelegateProvider() {
    this.SCE_CONTEXTS = SCE_CONTEXTS;

    // Resource URLs can also be trusted by policy.
    var resourceUrlWhitelist = ['self'],
        resourceUrlBlacklist = [];

    /**
     * @ngdoc method
     * @name $sceDelegateProvider#resourceUrlWhitelist
     * @kind function
     *
     * @param {Array=} whitelist When provided, replaces the resourceUrlWhitelist with the value
     *     provided.  This must be an array or null.  A snapshot of this array is used so further
     *     changes to the array are ignored.
     *
     *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
     *     allowed in this array.
     *
     *     Note: **an empty whitelist array will block all URLs**!
     *
     * @return {Array} the currently set whitelist array.
     *
     * The **default value** when no whitelist has been explicitly set is `['self']` allowing only
     * same origin resource requests.
     *
     * @description
     * Sets/Gets the whitelist of trusted resource URLs.
     */
    this.resourceUrlWhitelist = function (value) {
        if (arguments.length) {
            resourceUrlWhitelist = adjustMatchers(value);
        }
        return resourceUrlWhitelist;
    };

    /**
     * @ngdoc method
     * @name $sceDelegateProvider#resourceUrlBlacklist
     * @kind function
     *
     * @param {Array=} blacklist When provided, replaces the resourceUrlBlacklist with the value
     *     provided.  This must be an array or null.  A snapshot of this array is used so further
     *     changes to the array are ignored.
     *
     *     Follow {@link ng.$sce#resourceUrlPatternItem this link} for a description of the items
     *     allowed in this array.
     *
     *     The typical usage for the blacklist is to **block
     *     [open redirects](http://cwe.mitre.org/data/definitions/601.html)** served by your domain as
     *     these would otherwise be trusted but actually return content from the redirected domain.
     *
     *     Finally, **the blacklist overrides the whitelist** and has the final say.
     *
     * @return {Array} the currently set blacklist array.
     *
     * The **default value** when no whitelist has been explicitly set is the empty array (i.e. there
     * is no blacklist.)
     *
     * @description
     * Sets/Gets the blacklist of trusted resource URLs.
     */

    this.resourceUrlBlacklist = function (value) {
        if (arguments.length) {
            resourceUrlBlacklist = adjustMatchers(value);
        }
        return resourceUrlBlacklist;
    };

    this.$get = ['$injector', function ($injector) {

        var htmlSanitizer = function htmlSanitizer(html) {
            throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        };

        if ($injector.has('$sanitize')) {
            htmlSanitizer = $injector.get('$sanitize');
        }


        function matchUrl(matcher, parsedUrl) {
            if (matcher === 'self') {
                return urlIsSameOrigin(parsedUrl);
            } else {
                // definitely a regex.  See adjustMatchers()
                return !!matcher.exec(parsedUrl.href);
            }
        }

        function isResourceUrlAllowedByPolicy(url) {
            var parsedUrl = urlResolve(url.toString());
            var i, n, allowed = false;
            // Ensure that at least one item from the whitelist allows this url.
            for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
                if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                    allowed = true;
                    break;
                }
            }
            if (allowed) {
                // Ensure that no item from the blacklist blocked this url.
                for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
                    if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                        allowed = false;
                        break;
                    }
                }
            }
            return allowed;
        }

        function generateHolderType(Base) {
            var holderType = function TrustedValueHolderType(trustedValue) {
                this.$$unwrapTrustedValue = function () {
                    return trustedValue;
                };
            };
            if (Base) {
                holderType.prototype = new Base();
            }
            holderType.prototype.valueOf = function sceValueOf() {
                return this.$$unwrapTrustedValue();
            };
            holderType.prototype.toString = function sceToString() {
                return this.$$unwrapTrustedValue().toString();
            };
            return holderType;
        }

        var trustedValueHolderBase = generateHolderType(),
            byType = {};

        byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);

        /**
         * @ngdoc method
         * @name $sceDelegate#trustAs
         *
         * @description
         * Returns an object that is trusted by angular for use in specified strict
         * contextual escaping contexts (such as ng-bind-html, ng-include, any src
         * attribute interpolation, any dom event binding attribute interpolation
         * such as for onclick,  etc.) that uses the provided value.
         * See {@link ng.$sce $sce} for enabling strict contextual escaping.
         *
         * @param {string} type The kind of context in which this value is safe for use.  e.g. url,
         *   resourceUrl, html, js and css.
         * @param {*} value The value that that should be considered trusted/safe.
         * @returns {*} A value that can be used to stand in for the provided `value` in places
         * where Angular expects a $sce.trustAs() return value.
         */
        function trustAs(type, trustedValue) {
            var Constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
            if (!Constructor) {
                throw $sceMinErr('icontext',
                    'Attempted to trust a value in invalid context. Context: {0}; Value: {1}',
                    type, trustedValue);
            }
            if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
                return trustedValue;
            }
            // All the current contexts in SCE_CONTEXTS happen to be strings.  In order to avoid trusting
            // mutable objects, we ensure here that the value passed in is actually a string.
            if (typeof trustedValue !== 'string') {
                throw $sceMinErr('itype',
                    'Attempted to trust a non-string value in a content requiring a string: Context: {0}',
                    type);
            }
            return new Constructor(trustedValue);
        }

        /**
         * @ngdoc method
         * @name $sceDelegate#valueOf
         *
         * @description
         * If the passed parameter had been returned by a prior call to {@link ng.$sceDelegate#trustAs
     * `$sceDelegate.trustAs`}, returns the value that had been passed to {@link
            * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}.
         *
         * If the passed parameter is not a value that had been returned by {@link
            * ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}, returns it as-is.
         *
         * @param {*} value The result of a prior {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`}
         *      call or anything else.
         * @returns {*} The `value` that was originally provided to {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} if `value` is the result of such a call.  Otherwise, returns
         *     `value` unchanged.
         */
        function valueOf(maybeTrusted) {
            if (maybeTrusted instanceof trustedValueHolderBase) {
                return maybeTrusted.$$unwrapTrustedValue();
            } else {
                return maybeTrusted;
            }
        }

        /**
         * @ngdoc method
         * @name $sceDelegate#getTrusted
         *
         * @description
         * Takes the result of a {@link ng.$sceDelegate#trustAs `$sceDelegate.trustAs`} call and
         * returns the originally supplied value if the queried context type is a supertype of the
         * created type.  If this condition isn't satisfied, throws an exception.
         *
         * @param {string} type The kind of context in which this value is to be used.
         * @param {*} maybeTrusted The result of a prior {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} call.
         * @returns {*} The value the was originally provided to {@link ng.$sceDelegate#trustAs
     *     `$sceDelegate.trustAs`} if valid in this context.  Otherwise, throws an exception.
         */
        function getTrusted(type, maybeTrusted) {
            if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
                return maybeTrusted;
            }
            var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
            if (constructor && maybeTrusted instanceof constructor) {
                return maybeTrusted.$$unwrapTrustedValue();
            }
            // If we get here, then we may only take one of two actions.
            // 1. sanitize the value for the requested type, or
            // 2. throw an exception.
            if (type === SCE_CONTEXTS.RESOURCE_URL) {
                if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
                    return maybeTrusted;
                } else {
                    throw $sceMinErr('insecurl',
                        'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}',
                        maybeTrusted.toString());
                }
            } else if (type === SCE_CONTEXTS.HTML) {
                return htmlSanitizer(maybeTrusted);
            }
            throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        }

        return { trustAs: trustAs,
            getTrusted: getTrusted,
            valueOf: valueOf };
    }];
}

/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/sce.js
 * @line 662
 */
function $SceProvider() {
    var enabled = true;

    /**
     * @ngdoc method
     * @name $sceProvider#enabled
     * @kind function
     *
     * @param {boolean=} value If provided, then enables/disables SCE.
     * @return {boolean} true if SCE is enabled, false otherwise.
     *
     * @description
     * Enables/disables SCE and returns the current value.
     */
    this.enabled = function (value) {
        if (arguments.length) {
            enabled = !!value;
        }
        return enabled;
    };


    this.$get = ['$parse', '$sniffer', '$sceDelegate', function (
        $parse,   $sniffer,   $sceDelegate) {
        // Prereq: Ensure that we're not running in IE8 quirks mode.  In that mode, IE allows
        // the "expression(javascript expression)" syntax which is insecure.

        var sce = shallowCopy(SCE_CONTEXTS);

        /**
         * @ngdoc method
         * @name $sce#isEnabled
         * @kind function
         *
         * @return {Boolean} true if SCE is enabled, false otherwise.  If you want to set the value, you
         * have to do it at module config time on {@link ng.$sceProvider $sceProvider}.
         *
         * @description
         * Returns a boolean indicating if SCE is enabled.
         */
        sce.isEnabled = function () {
            return enabled;
        };
        sce.trustAs = $sceDelegate.trustAs;
        sce.getTrusted = $sceDelegate.getTrusted;
        sce.valueOf = $sceDelegate.valueOf;

        if (!enabled) {
            sce.trustAs = sce.getTrusted = function (type, value) { return value; };
            sce.valueOf = identity;
        }

        /**
         * @ngdoc method
         * @name $sce#parseAs
         *
         * @description
         * Converts Angular {@link guide/expression expression} into a function.  This is like {@link
            * ng.$parse $parse} and is identical when the expression is a literal constant.  Otherwise, it
         * wraps the expression in a call to {@link ng.$sce#getTrusted $sce.getTrusted(*type*,
     * *result*)}
         *
         * @param {string} type The kind of SCE context in which this result will be used.
         * @param {string} expression String expression to compile.
         * @returns {function(context, locals)} a function which represents the compiled expression:
         *
         *    * `context` – `{object}` – an object against which any expressions embedded in the strings
         *      are evaluated against (typically a scope object).
         *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
         *      `context`.
         */
        sce.parseAs = function sceParseAs(type, expr) {
            var parsed = $parse(expr);
            if (parsed.literal && parsed.constant) {
                return parsed;
            } else {
                return $parse(expr, function (value) {
                    return sce.getTrusted(type, value);
                });
            }
        };

        // Shorthand delegations.
        var parse = sce.parseAs,
            getTrusted = sce.getTrusted,
            trustAs = sce.trustAs;

        forEach(SCE_CONTEXTS, function (enumValue, name) {
            var lName = lowercase(name);
            sce[camelCase('parse_as_' + lName)] = function (expr) {
                return parse(enumValue, expr);
            };
            sce[camelCase('get_trusted_' + lName)] = function (value) {
                return getTrusted(enumValue, value);
            };
            sce[camelCase('trust_as_' + lName)] = function (value) {
                return trustAs(enumValue, value);
            };
        });

        return sce;
    }];
}

/* interpolate functionality source: https://github.com/angular/angular.js/blob/master/src/ng/interpolate.js */
/**
 * @ngdoc function
 * @name angular.toJson
 * @module ng
 * @function
 *
 * @description
 * Serializes input into a JSON-formatted string. Properties with leading $ characters will be
 * stripped since angular uses this notation internally.
 *
 * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.
 * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.
 * @returns {string|undefined} JSON-ified string representing `obj`.
 */
var $interpolateMinErr = minErr('$interpolate');
var document = {};
/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/sce.js
 * @line 244
 * @param Base
 * @returns {TrustedValueHolderType}
 */
function generateHolderType(Base) {
    var holderType = function TrustedValueHolderType(trustedValue) {
        this.$$unwrapTrustedValue = function () {
            return trustedValue;
        };
    };
    if (Base) {
        holderType.prototype = new Base();
    }
    holderType.prototype.valueOf = function sceValueOf() {
        return this.$$unwrapTrustedValue();
    };
    holderType.prototype.toString = function sceToString() {
        return this.$$unwrapTrustedValue().toString();
    };
    return holderType;
}
/**
 * @source https://github.com/angular/angular.js/blob/master/src/ng/sce.js
 * @line 262
 * @type {TrustedValueHolderType}
 */
var trustedValueHolderBase = generateHolderType();

function $InterpolateProvider() {
    var startSymbol = '{{';
    var endSymbol = '}}';

    /**
     * @ngdoc method
     * @name $interpolateProvider#startSymbol
     * @description
     * Symbol to denote start of expression in the interpolated string. Defaults to `{{`.
   *
   * @param {string=} value new value to set the starting symbol to.
     * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
     */
    this.startSymbol = function (value) {
        if (value) {
            startSymbol = value;
            return this;
        } else {
            return startSymbol;
        }
    };

    /**
     * @ngdoc method
     * @name $interpolateProvider#endSymbol
     * @description
     * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
     *
     * @param {string=} value new value to set the ending symbol to.
     * @returns {string|self} Returns the symbol when used as getter and self if used as setter.
     */

    this.endSymbol = function (value) {
        if (value) {
            endSymbol = value;
            return this;
        } else {
            return endSymbol;
        }
    };


    this.$get = ['$parse', '$exceptionHandler', '$sce', function ($parse, $exceptionHandler, $sce) {
        var startSymbolLength = startSymbol.length,
            endSymbolLength = endSymbol.length;


        /**
         * @source https://github.com/angular/angular.js/blob/master/src/ng/sce.js
         */
        var sceValueOf = function (maybeTrusted) {
            if (maybeTrusted instanceof trustedValueHolderBase) {
                return maybeTrusted.$$unwrapTrustedValue();
            } else {
                return maybeTrusted;
            }
        }

        /**
         * @ngdoc service
         * @name $interpolate
         * @function
         *
         * @requires $parse
         * @requires $sce
         *
         * @description
         *
         * Compiles a string with markup into an interpolation function. This service is used by the
         * HTML {@link ng.$compile $compile} service for data binding. See
         * {@link ng.$interpolateProvider $interpolateProvider} for configuring the
         * interpolation markup.
         *
         *
         * ```js
         *   var $interpolate = ...; // injected
         *   var exp = $interpolate('Hello {{name | uppercase}}!');
         *   expect(exp({name:'Angular'}).toEqual('Hello ANGULAR!');
         * ```
         *
         *
         * @param {string} text The text with markup to interpolate.
         * @param {boolean=} mustHaveExpression if set to true then the interpolation string must have
         *    embedded expression in order to return an interpolation function. Strings with no
         *    embedded expression will return null for the interpolation function.
         * @param {string=} trustedContext when provided, the returned function passes the interpolated
         *    result through {@link ng.$sce#getTrusted $sce.getTrusted(interpolatedResult,
     *    trustedContext)} before returning it.  Refer to the {@link ng.$sce $sce} service that
         *    provides Strict Contextual Escaping for details.
         * @returns {function(context)} an interpolation function which is used to compute the
         *    interpolated string. The function has these parameters:
         *
         *    * `context`: an object against which any expressions embedded in the strings are evaluated
         *      against.
         *
         */
        function $interpolate(text, mustHaveExpression, trustedContext) {
            var startIndex,
                endIndex,
                index = 0,
                parts = [],
                length = text.length,
                hasInterpolation = false,
                fn,
                exp,
                concat = [];

            while (index < length) {
                if (
                    ((startIndex = text.indexOf(startSymbol, index)) !== -1) &&
                    ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) !== -1)
                    ) {
                    (index !== startIndex) && parts.push(text.substring(index, startIndex));
                    parts.push(fn = $parse.parse(exp = text.substring(startIndex + startSymbolLength, endIndex)));
                    fn.exp = exp;
                    index = endIndex + endSymbolLength;
                    hasInterpolation = true;
                } else {
                    // we did not find anything, so we have to add the remainder to the parts array
                    (index !== length) && parts.push(text.substring(index));
                    index = length;
                }
            }

            if (!(length = parts.length)) {
                // we added, nothing, must have been an empty string.
                parts.push('');
                length = 1;
            }

            // Concatenating expressions makes it hard to reason about whether some combination of
            // concatenated values are unsafe to use and could easily lead to XSS.  By requiring that a
            // single expression be used for iframe[src], object[src], etc., we ensure that the value
            // that's used is assigned or constructed by some JS code somewhere that is more testable or
            // make it obvious that you bound the value to some user controlled value.  This helps reduce
            // the load when auditing for XSS issues.
            if (trustedContext && parts.length > 1) {
                throw $interpolateMinErr('noconcat',
                        'Error while interpolating: {0}\nStrict Contextual Escaping disallows ' +
                        'interpolations that concatenate multiple expressions when a trusted value is ' +
                        'required.  See http://docs.angularjs.org/api/ng.$sce', text);
            }

            if (!mustHaveExpression  || hasInterpolation) {
                concat.length = length;
                fn = function (context) {
                    try {
                        for (var i = 0, ii = length, part; i < ii; i++) {
                            if (typeof (part = parts[i]) === 'function') {
                                part = part(context);
                                if (trustedContext) {
                                    part = $sce.getTrusted(trustedContext, part);
                                } else {
//                                    part = $sce.valueOf(part);
                                    part = sceValueOf(part);
                                }
                                if (part === null || isUndefined(part)) {
                                    part = '';
                                } else if (typeof part !== 'string') {
                                    part = toJson(part);
                                }
                            }

                            concat[i] = part;
                        }
                        return concat.join('');
                    } catch (err) {
                        return $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text,
                            err.toString());
                    }
                };
                fn.exp = text;
                fn.parts = parts;
                return fn;
            }
        }


        /**
         * @ngdoc method
         * @name $interpolate#startSymbol
         * @description
         * Symbol to denote the start of expression in the interpolated string. Defaults to `{{`.
     *
     * Use {@link ng.$interpolateProvider#startSymbol $interpolateProvider#startSymbol} to change
         * the symbol.
         *
         * @returns {string} start symbol.
         */
        $interpolate.startSymbol = function () {
            return startSymbol;
        };


        /**
         * @ngdoc method
         * @name $interpolate#endSymbol
         * @description
         * Symbol to denote the end of expression in the interpolated string. Defaults to `}}`.
         *
         * Use {@link ng.$interpolateProvider#endSymbol $interpolateProvider#endSymbol} to change
         * the symbol.
         *
         * @returns {string} end symbol.
         */
        $interpolate.endSymbol = function () {
            return endSymbol;
        };

        return $interpolate;
    }];
}

/* locale provider functionality  https://github.com/angular/angular.js/blob/master/src/ng/locale.js */

module.exports = {parser: Parser, lexer: Lexer, sce: null, interpolate: $InterpolateProvider};