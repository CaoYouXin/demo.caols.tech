;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('env');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');

    (function () {
        var link = encodeURIComponent(window.location.href.split('#')[0]),
            external_sale_situation = 'product' === yangaiche(app.env.get) ? 'production' : 'test';

        yangaiche(app.http.get_request)('/v1/api/wechat_js_sdk_config.json?url=' + link + '&situation=' + external_sale_situation, function (data) {
            /*
             * 注意：
             * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
             * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
             * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
             *
             * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
             * 邮箱地址：weixin-open@qq.com
             * 邮件主题：【微信JS-SDK反馈】具体问题
             * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
             */
            data.debug = false;
            data.jsApiList = [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ];
            data.timestamp = parseInt(data.timestamp);
            console.log(JSON.stringify(data));
            wx.config(data);
            /*
             * 注意：
             * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
             * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
             * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
             *
             * 如有问题请通过以下渠道反馈：
             * 邮箱地址：weixin-open@qq.com
             * 邮件主题：【微信JS-SDK反馈】具体问题
             * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
             */
            wx.ready(function () {
                var shareData = {
                    title: key.external_sale_configs.title || '【养爱车】给车主任性大礼，用心养护您的爱车',
                    desc: key.external_sale_configs.desc || '【养爱车】打蜡洗车只要19.9元，任性补贴贴到底',
                    link: decodeURIComponent(link),
                    imgUrl: key.external_sale_configs.imgUrl || 'http://baseimg.yangaiche.com/extra_sale_share_logo.png'
                };
                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareTimeline(shareData);
            });

            wx.error(function (res) {
                console.log(res.errMsg);
            });
        }, function (error) {
            yangaiche(app.show_msg.show)(error.message);
        });
    }(yangaiche(sys.$)));
}());