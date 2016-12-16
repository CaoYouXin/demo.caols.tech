;(function () {

    'use strict';

    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('products');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('supplier');
    yangaiche(sys.load_default_module)('unique_service_type');

    app.simple_service_products = {
        config: {
            car_beauty_service: 22,
            renewal_service: 13,
            set_loss_service: 25
        },
        need_for_car_pick: {
            car_beauty_service: true,
            renewal_service: false,
            set_loss_service: true
        }
    };

    yangaiche(sys.init)(function (t) {

        var storage = yangaiche(sys.local_storage);
        var get_unique_service_type = yangaiche(app.unique_service_type.get);
        var getReq = yangaiche(app.http.get_request);

        app.simple_service_products.key = window.location.href.match(/\/.*\/(.*?)\.html/)[1];
        function init(service_products) {

            storage.set(key.service.data, service_products);

            storage.set(key.service.can_self, false);

            var order = yangaiche(ls.order.touch)(),
                service_type = app.simple_service_products.config[app.simple_service_products.key];


            var car_info = storage.get(key.car.info);
            if (yangaiche(sys.exist)(car_info)) {
                t('#store-item-car-choose .car-info-text').text(car_info.car_number);
                //var short_model = car_info.model.length > 10 ? car_info.model.substr(0, 10) + '...' : car_info.model;
                t('#car_model').text(car_info.car_number);
            }

            //var config = yangaiche(sys.exist)(order.supplier_id) ? '&supplier_id=' + order.supplier_id : '';
            getReq('/v2/api/products.json?service_type=' + service_type + '&car_model_type=' + car_info.car_model_type, function (data) {
                if (service_products.length > 0) {
                    data.required_products.push(service_products[0]);

                    storage.set(get_unique_service_type(app.simple_service_products.key), service_products[0].service_type);
                } else {
                    storage.set(get_unique_service_type(app.simple_service_products.key), '');
                }
                yangaiche(ls.products.set)(data.required_products);

                var product_ids = '';
                t.each(yangaiche(ls.products.touch)(), function (i, wp) {
                    if (i !== 0) {
                        product_ids += ',';
                    }
                    product_ids += wp.product_type;
                });

                getReq('/v2/api/order/service_comment/page_list.json?product_ids=' + product_ids + '&page=1&page_size=1', function (data) {
                    t('#store-item-comment-link').html('用户评价 ( ' + data.total_size + ' )');
                    t('#store-item-comment-link').click(function () {
                        yangaiche(ls.back.set_back_to_self)('comments_list.html?product_ids='+product_ids);
                    });
                }, function (error) {
                    show_msg(error.message || JSON.stringify(error));
                });

            }, function () {
                yangaiche(app.show_msg.show)('AJAX ERROR!');
            });

            // 去支付按钮
            t('#store-item-footer .submit').click(function () {
                var car = storage.get(key.car.info);
                if (!yangaiche(sys.exist)(car)) {
                    yangaiche(app.show_msg.show)('请先选车');
                    return false;
                }

                storage.set(key.submit_button.submit_text_key, key.submit_button.submit_text_value3);
                storage.set(key.shequbanjin.is_butler_pick, false);

                yangaiche(ls.order.update)(function (order) {
                    order.supplier_id = null;
                });

                yangaiche(ls.back.set_back_to_self)('order_settle.html');
            });

            t('#store-item-car-choose').click(function () {
                storage.remove(key.goto.car_list);
                yangaiche(ls.back.set_back_to_self)('car_list.html');
            });
        }

        if (app.simple_service_products.need_for_car_pick[app.simple_service_products.key]) {
            yangaiche(app.http.get_request)('/v1/api/service_products.json?code=keeper', function (data) {
                init(data);
            });
        } else {
            init([]);
        }
    });

}());