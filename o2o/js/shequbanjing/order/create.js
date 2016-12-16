;(function () {

    'use strict';

    app.order_create = {
        get_api: 'app_order_create_get_api'
    };

	yangaiche(app.order_create.get_api, function () {
        return function () {
            if (yangaiche(sys.local_storage).get(key.shequbanjin.is_butler_pick)) {
                return '/v1/api/radius/create_maintain_order_info.json';
            }
            return '/v1/api/radius/create_order_info.json';
        }();
    });
}());