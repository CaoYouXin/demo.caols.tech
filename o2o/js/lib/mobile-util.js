/**
 * MobileWeb 通用功能助手，包含常用的 UA 判断、页面适配、search 参数转 键值对。
 * 该 JS 应在 head 中尽可能早的引入，减少重绘。
 *
 * fixScreen 方法根据两种情况适配，该方法自动执行。
 *      1. 定宽： 对应 meta 标签写法 -- <meta name="viewport" content="target-densitydpi=device-dpi,width=750">
 *          该方法会提取 width 值，主动添加 scale 相关属性值。
 *          注意： 如果 meta 标签中指定了 initial-scale， 该方法将不做处理（即不执行）。
 *      2. REM: 不用写 meta 标签，该方法根据 dpr 自动生成，并在 html 标签中加上 data-dpr 和 font-size 两个属性值。
 *          该方法约束：IOS 系统最大 dpr = 3，其它系统 dpr = 1，页面每 dpr 最大宽度（即页面宽度/dpr） = 750，REM 换算比值为 16。
 *          对应 css 开发，任何弹性尺寸均使用 rem 单位，rem 默认宽度为 视觉稿宽度 / 16;
 *              scss 中 $ppr(pixel per rem) 变量写法 -- $ppr: 750px/16/1rem;
 *                      元素尺寸写法 -- html { font-size: $ppr*1rem; } body { width: 750px/$ppr; }。
 */
window.mobileUtil = (function (win, doc) {

    'use strict';

    var UA = navigator.userAgent,
        isAndroid = /android|adr/gi.test(UA),
        isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
        isMobile = isAndroid || isIos;  // 粗略的判断

    return {
        isAndroid: isAndroid,
        isIos: isIos,
        isMobile: isMobile,

        isNewsApp: /NewsApp\/[\d\.]+/gi.test(UA),
        isWeixin: /MicroMessenger/gi.test(UA),
        isQQ: /QQ\/\d/gi.test(UA),
        isYixin: /YiXin/gi.test(UA),
        isWeibo: /Weibo/gi.test(UA),
        isTXWeibo: /T(?:X|encent)MicroBlog/gi.test(UA),

        tapEvent: isMobile ? 'tap' : 'click',

        /**
         * 缩放页面
         */
        fixScreen: function () {
            var metaEl = doc.querySelector('meta[name="viewport"]'),
                metaCtt = (metaEl ? metaEl.content : '').replace(/\s*/g, '');

            var kvs = metaCtt.split(','), data = {};
            for (var i = 0; i < kvs.length; i++) {
                var kv = kvs[i].split('=');
                if (/width/.test(kv[0])) {
                    data.width = kv[1];
                }
                data[kv[0]] = kv[1];
            }
            data.width = data.width || 640;

            if (isMobile) { // 定宽
                if (isAndroid) {
                    var medium_dpi = data.width / win.screen.availWidth * window.devicePixelRatio * 160;

                    medium_dpi = medium_dpi.toFixed(2);

                    data['target-densitydpi'] = medium_dpi;
                } else {
                    var scale = win.screen.availWidth / data.width;

                    scale = scale.toFixed(2);

                    data['initial-scale'] = data['maximum-scale'] = data['minimum-scale'] = scale;
                }

                metaEl.content = JSON.stringify(data).replace(/\s*/g, '').replace(/[{}"]/g, '').replace(/:/g, '=');
            }
            console.log(data);
        },

        /**
         * 转href参数成键值对
         * @param href {string} 指定的href，默认为当前页href
         * @returns {object} 键值对
         */
        getSearch: function (href) {
            href = href || win.location.search;
            var data = {}, reg = new RegExp('([^?=&]+)(=([^&]*))?', 'g');
            if (href) {
                href.replace(reg, function ($0, $1, $2, $3) {
                    data[$1] = $3;
                });
            }
            return data;
        }

    };
})(window, document);

// 默认直接适配页面
window.mobileUtil.fixScreen();
