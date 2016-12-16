;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('browser');

    app.set_activity_peer_source = 'app_set_activity_peer_source';

    yangaiche(app.set_activity_peer_source, function () {
        return function (order) {
            var activity_peer_source = {};
            activity_peer_source[app.browser.android] = 'android_activity';
            activity_peer_source[app.browser.ios] = 'ios_activity';
            activity_peer_source[app.browser.unknown] = 'unknown_activity';
            order.peer_source = activity_peer_source[yangaiche(app.browser.what_device)];
        };
    });
}());