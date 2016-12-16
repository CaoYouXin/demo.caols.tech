;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');

    app.order_get_payment_order_id = {
        get_id: 'app_order_get_payment_order_id'
    };

    yangaiche(app.order_get_payment_order_id.get_id, function () {
        return function (id, callback) {
            yangaiche(app.http.get_request)('/v1/api/radius/get_external_order_id.json?local_order_id=' + id, function (data) {
                callback(data);
            }, function (error) {
                yangaiche(app.show_msg.show)(error.message || error);
            });
        };
    });

}());