;(function () {

    'use strict';

	yangaiche(sys.load_module)('ios/bridge');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('order');

    app.supplier = {
        init: 'supplier_init'
    };

    yangaiche(app.supplier.init, function () {

        function supplier_products(suppliers, callback) {
            var config = suppliers.length > 0 ? '&supplier_id=' + suppliers[0].supplier_id : '';
            yangaiche(app.http.get_request)('/v1/api/service_products.json?code=all' + config, function (data) {
                callback(suppliers, data);
            }, function (error) {
                yangaiche(app.show_msg.show)(error.message);
            });
        }

        function supplier_adapt(location_info, callback, ware_id) {
            var config = (undefined === ware_id) ? '' : '&ware_id=' + ware_id;
            yangaiche(app.http.get_request)('/v2/api/supplier/adaption.json?longitude=' + location_info.longitude + '&latitude=' + location_info.latitude + config, function (data) {
                callback(data);
            }, function (error) {
                yangaiche(app.show_msg.show)(error.message);
            });
        }

        return function (callback, ware_id) {
            yangaiche(app.bridge.connect)(function (bridge) {
                bridge.callHandler('getInfo', {}, function (responseData) {
                    console.log('JS got a message: ' + responseData);
                    var init = JSON.parse(responseData);
                    yangaiche(ls.user.set)(init.user_info);
                    yangaiche(ls.location.set)(init.location);
                    supplier_adapt(init.location, function (suppliers) {
                        yangaiche(ls.order.update)(function (order) {
                            if (suppliers.length > 0) {
                                order.supplier_id = suppliers[0].supplier_id;
                                order.supplier_name = suppliers[0].supplier_name;
                            }
                        });
                        supplier_products(suppliers, callback);
                    }, ware_id);
                });
            });
        };
    });
}());