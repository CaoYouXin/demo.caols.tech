;(function () {

    'use strict';

    app.order_create = {
        get_api: 'app_order_create_get_api'
    };

	yangaiche(app.order_create.get_api, function () {
        return function () {
            return '/v2/api/order/create.json';
        }();
    });
}());