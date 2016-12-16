;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('map');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('order');

    app.supplier = {
        init: 'supplier_init'
    };

    yangaiche(app.supplier.init, function () {

        function supplier_products(suppliers, callback) {
            var config = suppliers.length > 0 ? '&supplier_id=' + suppliers[0].supplier_id : '';
            yangaiche(app.http.get_request)('/v1/api/service_products.json?code=keeper', function (data) {
                callback(suppliers, data);
            }, function (error) {
                yangaiche(app.show_msg.show)(error.message);
            });
        }

        return function (callback) {
            supplier_products([], callback);
        };
    });
}());