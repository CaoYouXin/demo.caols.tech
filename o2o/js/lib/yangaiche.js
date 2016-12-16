;(function () {

    'use strict';

    // lib objects
    var yangaiche;

    // default modules
    window.sys = {
        exist: 'exist',
        local_storage: 'local_storage',
        load: 'load',
        $: '$',
        init: 'init',
        start: 'start', //供框架调用.
        root: 'root',

        inits: []
    };

    function exist(obj) {
        return typeof obj !== 'undefined' && obj !== null;
    }

    window.runtime_obj = {};
    yangaiche = function (name, callback, params) {
        if (exist(window.runtime_obj[name])) {
            return window.runtime_obj[name];
        }
        if (exist(callback)) {
            window.runtime_obj[name] = callback(params);
        }
        if (exist(window.runtime_obj[name])) {
            return window.runtime_obj[name];
        } else {
            console.error('yangaiche can not be done with "' + name + '" & "' + callback + '" & "' + params + '" ');
        }
    };

    yangaiche(sys.exist, function () {
        return exist;
    });

    yangaiche(sys.local_storage, function () {
        var store = $.AMUI.store;
        if (!store.enabled) {
            console.error('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
            return null;
        }
        return store;
    });

    if (![].includes) {
        Array.prototype.includes = function (searchElement /*, fromIndex*/) {
            var O = Object(this);
            var len = parseInt(O.length) || 0;
            if (len === 0) {
                return false;
            }
            var n = parseInt(arguments[1]) || 0;
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) {
                    k = 0;
                }
            }
            var currentElement;
            while (k < len) {
                currentElement = O[k];
                if (searchElement === currentElement ||
                    (searchElement !== searchElement && currentElement !== currentElement)) {
                    return true;
                }
                k++;
            }
            return false;
        };
    }

    if (![].remove) {
        Array.prototype.remove = function (searchElement /*, fromIndex*/) {
            var O = Object(this);
            var len = parseInt(O.length) || 0;
            if (len === 0) {
                return true;
            }
            var n = parseInt(arguments[1]) || 0;
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) {
                    k = 0;
                }
            }
            var currentElement;
            while (k < len) {
                currentElement = O[k];
                if (searchElement === currentElement ||
                    (searchElement !== searchElement && currentElement !== currentElement)) {
                    O.splice(k, 1);
                    return true;
                }
                k++;
            }
            return true;
        };
    }

    if (!Array.from) {
        Array.from = (function () {
            var toStr = Object.prototype.toString;
            var isCallable = function (fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function (value) {
                var number = Number(value);
                if (isNaN(number)) { return 0; }
                if (number === 0 || !isFinite(number)) { return number; }
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var toLength = function (value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };

            // The length property of the from method is 1.
            return function from(arrayLike/*, mapFn, thisArg */) {
                // 1. Let C be the this value.
                var C = this;

                // 2. Let items be ToObject(arrayLike).
                var items = Object(arrayLike);

                // 3. ReturnIfAbrupt(items).
                if (arrayLike == null) {
                    throw new TypeError("Array.from requires an array-like object - not null or undefined");
                }

                // 4. If mapfn is undefined, then let mapping be false.
                var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                var T;
                if (typeof mapFn !== 'undefined') {
                    // 5. else
                    // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }

                    // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }

                // 10. Let lenValue be Get(items, "length").
                // 11. Let len be ToLength(lenValue).
                var len = toLength(items.length);

                // 13. If IsConstructor(C) is true, then
                // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
                // 14. a. Else, Let A be ArrayCreate(len).
                var A = isCallable(C) ? Object(new C(len)) : new Array(len);

                // 16. Let k be 0.
                var k = 0;
                // 17. Repeat, while k < len… (also steps a - h)
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                // 18. Let putStatus be Put(A, "length", len, true).
                A.length = len;
                // 20. Return A.
                return A;
            };
        }());
    }

    yangaiche(sys.$, function () {
        jQuery.cachedScript = function (url, options) {

            // Allow user to set any option except for dataType, cache, and url
            options = $.extend(options || {}, {
                dataType: 'script',
                cache: true,
                url: url
            });

            // Use $.ajax() since it is more flexible than $.getScript
            // Return the jqXHR object so we can chain callbacks
            return jQuery.ajax(options);
        };

        return jQuery;
    });

    yangaiche(sys.init, function () {
        return function (callback, index) {
            if (!yangaiche(sys.exist)(index)) {
                sys.inits.push(callback);
            } else {
                sys.inits.splice(index, 0, callback);
            }
            console.log('init complete...');
        };
    });

    yangaiche(sys.start, function () {
        return function () {
            var $ = yangaiche(sys.$);
            $(function () {
                for (var i = 0; i < sys.inits.length; i++) {
                    sys.inits[i]($);
                }
            });
            console.log('start complete...');
        };
    });

    yangaiche(sys.root, function () {
        var $ = yangaiche(sys.$), root = '.';
        var $root = $('body').attr('root');
        if (yangaiche(sys.exist)($root)) {
            root = $root;
        }
        return root;
    });

    yangaiche(sys.load, function () {
        var loaded = [], $ = yangaiche(sys.$), root = yangaiche(sys.root);
        console.log(loaded);

        var map = $.ajax({
            url: root + '/map.json',
            cache: false,
            async: false,
            dataType: 'json'
        });
        try {
            map = map.responseJSON;
        } catch (e) {
            map = null;
        }
        // 两个特性：1. 同步异步加载的标示是第二个参数，存在就是同步，不存在就是异步；也就是随便传个{}代表要同步加载。
        // 2. 对于同步加载，可以返回true代表加载成功，false代表加载失败；对于异步加载，总是返回null；可以使用sys.exist判断为null。
        return function (url, enable_sync_mode) {
            var exist = yangaiche(sys.exist);
            var enable_sync_mode_flag = exist(enable_sync_mode);
            if (exist(map)) {
                if (exist(map[url])) {
                    url = yangaiche(sys.root) + '/js/' + map[url];
                } else {
                    return enable_sync_mode_flag ? false : null;
                }
            } else {
                url = yangaiche(sys.root) + '/js/' + url;
            }
            if (!loaded.includes(url)) {
                loaded.push(url);
                var result = null;
                if (enable_sync_mode_flag) {
                    console.log('start sync mode [' + url + ']');
                    yangaiche(sys.$).cachedScript(url, {async: false})
                        .done(function () {
                            result = true;
                        })
                        .fail(function (jqxhr) {
                            var err404 = jqxhr.status === 404;
                            if (err404) {
                                loaded.remove(url);
                            }
                            result = err404 ? false : null;
                        });
                    console.log('end sync mode [' + url + ']');
                } else {
                    console.log('start async mode [' + url + ']');
                    yangaiche(sys.$).cachedScript(url, {async: true})
                        .done(function () {
                        })
                        .fail(function (jqxhr) {
                            var err404 = jqxhr.status === 404;
                            if (err404) {
                                loaded.remove(url);
                            }
                        });
                    console.log('end async mode [' + url + ']');
                }
                return result;
            }
        };
    });

    window.yangaiche = yangaiche;

    yangaiche(sys.load)('lib/yangaiche_init.js');

}());