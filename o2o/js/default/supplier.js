;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('map');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('order');

    app.supplier = {
        simple: 'supplier_simple_init',
        init: 'supplier_init'
    };

    yangaiche(app.supplier.simple, function () {

        function supplier_adapt(location_info, callback, ware_id) {
            var config = (undefined === ware_id) ? '' : '&ware_id=' + ware_id;
            yangaiche(app.http.get_request)('/v2/api/supplier/adaption.json?longitude=' + location_info.longitude + '&latitude=' + location_info.latitude + config, function (data) {
                callback(data);
            }, function (error) {
                yangaiche(app.show_msg.show)(error.message);
            });
        }

        return function (callback, ware_id) {
            var location_info = yangaiche(ls.location.touch)();
            if (!yangaiche(sys.exist)(location_info.address) || '' === location_info.address) {
                yangaiche(app.map.auto_location)(function (address, auto_loacation_info) {
                    supplier_adapt(auto_loacation_info, callback, ware_id);
                });
            } else {
                supplier_adapt(location_info, callback, ware_id);
            }
        };
    });

    yangaiche(app.supplier.init, function () {

        function supplier_products(suppliers, callback) {
            var config = suppliers.length > 0 ? '&supplier_id=' + suppliers[0].supplier_id : '';
            yangaiche(app.http.get_request)('/v1/api/service_products.json?code=all' + config, function (data) {
                callback(suppliers, data);
            }, function (error) {
                yangaiche(app.show_msg.show)(error.message);
            });
        }

        return function (callback, ware_id) {
            yangaiche(app.supplier.simple)(function (suppliers) {
                yangaiche(ls.order.update)(function (order) {
                    if (suppliers.length > 0) {
                        order.supplier_id = suppliers[0].supplier_id;
                        order.supplier_name = suppliers[0].supplier_name;
                    }
                });
                supplier_products(suppliers, callback);
            }, ware_id);
        };
    });
}());