// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.
// 对添加的注释，感谢https://regex101.com/#javascript，MDN，w3schools.com，Google等

(function () {
    "use strict";

    var doT = {
        version: "1.0.3",
        templateSettings: {
            // 代码片段
            evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
            // 变量
            interpolate: /\{\{=([\s\S]+?)\}\}/g,
            // HTML转义
            encode: /\{\{!([\s\S]+?)\}\}/g,
            // 使用（宏）定义
            use: /\{\{#([\s\S]+?)\}\}/g,
            // 使用带参数的（宏）定义
            useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
            // （宏）定义
            define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            // 形式上是上面定义的一个子集，含义上指带参数的宏定义，注意只查找一次，也就是说“一条宏定义只可能包含一个参数形式”
            defineParams: /^\s*([\w$]+):([\s\S]+)/,
            // 条件语句
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            // 迭代语句 {{~ 数组名称 : 值 : 下标 }}
            iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
            // 写模板的时候，根节点叫啥名字嘞
            varname: "it",
            // 是否去掉空白和注释
            strip: true,
            // 这里直接影响到写模板的方法，true表示：编码段里全是HTML代码；false表示：编码段会自动被其它如条件迭代语句终止。
            append: true,
            // 模板保存HTML编码
            selfcontained: false,
            // false表示，不替换本身就是&nbsp;中的&；true表示进行无脑替换
            doNotSkipEncoded: false
        },
        template: undefined, //fn, compile template
        compile: undefined  //fn, for express
    }, _globals;

    // 给HTML代码转义
    doT.encodeHTMLSource = function (doNotSkipEncoded) {
        var encodeHTMLRules = {"&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;"},
            matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
        return function (code) {
            return code ? code.toString().replace(matchHTML, function (m) {
                return encodeHTMLRules[m] || m;
            }) : "";
        };
    };

    /**
     * 将doT变量绑定到global对象上
     */
    _globals = (function () {
        return this || (0, eval)("this");
    }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = doT;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return doT;
        });
    } else {
        _globals.doT = doT;
    }

    var startend = {
        append: {start: "'+(", end: ")+'", startencode: "'+encodeHTML("},
        split: {start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML("}
    };

    /**
     * 对于非空字符串，什么都不会匹配
     * @type {RegExp}
     */
    var skip = /$^/;

    function resolveDefs(c, block, def) {
        return ((typeof block === "string") ? block : block.toString())
            .replace(c.define || skip, function (m, code, assign, value) {
                if (code.indexOf("def.") === 0) {
                    code = code.substring(4);
                }
                if (!(code in def)) {
                    if (assign === ":") {
                        // 注意是在value上使用replace
                        if (c.defineParams) value.replace(c.defineParams, function (m, param, v) {
                            def[code] = {arg: param, text: v};
                        });
                        if (!(code in def)) def[code] = value;
                    } else {
                        new Function("def", "def['" + code + "']=" + value)(def);
                    }
                }
                return "";
            })
            .replace(c.use || skip, function (m, code) {
                if (c.useParams) code = code.replace(c.useParams, function (m, s, d, param) {
                    if (def[d] && def[d].arg && param) {
                        var rw = (d + ":" + param).replace(/'|\\/g, "_");
                        def.__exp = def.__exp || {};
                        // 谁会在宏定义的参数值里再写个参数名呢？杀马特！
                        def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
                        return s + "def.__exp['" + rw + "']";
                    }
                });
                var v = new Function("def", "return " + code)(def);
                // 用参数到最后就剩下四大皆空的境界了，否则就出现undefined问题咯
                return v ? resolveDefs(c, v, def) : v;
            });
    }

    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
    }

    doT.template = function (tmpl, c, def) {
        c = c || doT.templateSettings;
        var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
            str = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

        str = ("var out='"
        + (c.strip ?
            // 去掉字符串开头、结尾的空白
            str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ")
                // 去掉注释
                .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "")
            : str)
            // 这里译为不做替换
            .replace(/'|\\/g, "\\$&")
            // 传一个函数作为第二个参数，这个函数的参数具体有几个，还要看replace函数的第一个参数是怎样的
            // 详见：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
            .replace(c.interpolate || skip, function (m, code) {
                return cse.start + unescape(code) + cse.end;
            })
            // HTML转义，凡包裹住的内容，都要换成那种&nbsp;样子的东东，你懂得
            .replace(c.encode || skip, function (m, code) {
                needhtmlencode = true;
                return cse.startencode + unescape(code) + cse.end;
            })
            // 支持条件语句，if、if/else、if/else if/else。
            .replace(c.conditional || skip, function (m, elsecase, code) {
                return elsecase ?
                    (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
                    (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
            })
            // 支持迭代语句，迭代目标是数组
            .replace(c.iterate || skip, function (m, iterate, vname, iname) {
                if (!iterate) return "';} } out+='";
                sid += 1;
                indv = iname || "i" + sid;
                iterate = unescape(iterate);
                return "';var arr" + sid + "=" + iterate + ";if(arr" + sid + "){var " + vname + "," + indv + "=-1,l" + sid + "=arr" + sid + ".length-1;while(" + indv + "<l" + sid + "){"
                    + vname + "=arr" + sid + "[" + indv + "+=1];out+='";
            })
            // 直接写代码片段，记得写句末分号
            .replace(c.evaluate || skip, function (m, code) {
                return "';" + unescape(code) + "out+='";
            })
        + "';return out;")
            // 转义字符
            .replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
            // 清理没用的语句
            .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
        //.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

        // 其实不管是否selfcontained，它都优先使用了global下的_encodeHTML。
        if (needhtmlencode) {
            if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
            str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
                    // toString的用法详见：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/toString
                    // 所以，这里还是调用的意思，只不过，这个调用要等到生成的模板方法执行之时，所以decompiles。
                + doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
                + str;
        }
        try {
            console.log(str);
            return new Function(c.varname, str);
        } catch (e) {
            if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
            throw e;
        }
    };

    doT.compile = function (tmpl, def) {
        return doT.template(tmpl, null, def);
    };
}());