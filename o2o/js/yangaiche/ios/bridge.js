;(function () {

    'use strict';

    app.bridge = {
        connect: 'connect_to_bridge'
    };

	yangaiche(app.bridge.connect, function () {
        return function (callback) {
            if (window.WebViewJavascriptBridge) {
                //console.log('already ' + JSON.stringify(window.WebViewJavascriptBridge));
                callback(window.WebViewJavascriptBridge);
            } else {
                //console.log('wait for event ' + JSON.stringify(window.WebViewJavascriptBridge));
                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                    //console.log('event ' + JSON.stringify(window.WebViewJavascriptBridge));
                    callback(window.WebViewJavascriptBridge);
                }, false);
            }
        };
    });

}());