;(function () {

    'use strict';

    app.set_activity_peer_source = 'app_set_activity_peer_source';

	yangaiche(app.set_activity_peer_source, function () {
        return function (order) {
            order.peer_source = 'h5_activity';
        };
    });
}());