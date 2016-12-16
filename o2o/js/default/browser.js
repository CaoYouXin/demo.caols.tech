;(function () {

    'use strict';

    app.browser = {
        what_device: 'app_browser_what_device',

        android: 'Android',
        ios: 'iOS',
        unknown: 'Unknown'
    };

	yangaiche(app.browser.what_device, function () {
        var UA = navigator.userAgent,
            isAndroid = /android|adr/gi.test(UA),
            isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid; // 据说某些国产机的UA会同时包含 android iphone 字符
        return function () {
            if (isAndroid) {
                return app.browser.android;
            }
            if (isIos) {
                return app.browser.ios;
            }
            return app.browser.unknown;
        }();
    });

}());