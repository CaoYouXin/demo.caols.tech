;(function () {

    'use strict';

    app.order_get_payment_order_id = {
        get_id: 'app_order_get_payment_order_id'
    };

	yangaiche(app.order_get_payment_order_id.get_id, function () {
        return function (id, callback) {
            callback(id);
        };
    });

}());