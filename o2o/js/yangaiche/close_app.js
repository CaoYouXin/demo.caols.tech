;(function () {

    'use strict';

	yangaiche(sys.load_module)('ios/bridge');

    yangaiche(app.bridge.connect)(function (bridge) {
        bridge.callHandler('close_webview', {}, function (responseData) {
            console.log('JS got response: ' + responseData);
        });
    });
}());