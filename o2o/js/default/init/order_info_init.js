;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('duplicate_submission');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('pay');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('order_info');

    yangaiche(sys.init)(function (t) {
        var getReq = yangaiche(app.http.get_request);

        var reqParams = yangaiche(app.url_parameter);
        if (yangaiche(sys.exist)(reqParams.order_id)) {//有参数，查看页面
            getReq('/v3/api/orders.json?user_type=caruser&order_id=' + reqParams.order_id, function (order) {
                yangaiche(app.order_info.show)(order.items[0]);

                function process_order_addition(value) {
                    var selected_images = t('#order_info_advise_items .order_info_items li img[src="http://7xiqe8.com2.z0.glb.qiniucdn.com/choose.png"]');
                    var params = [];
                    t.each(selected_images, function (i, image) {
                        if ('inline-block' === t(image).css('display')) {
                            params.push({order_item_id: parseInt(t(image).attr('data-rel')), selection_mode: value});
                        }
                    });

                    yangaiche(app.http.post_request)('/v1/api/order_addition/confirmation.json', params, function () {
                        window.location.reload();
                    }, function (error) {
                        yangaiche(app.show_msg.show)(error.message);
                    });
                }

                t('#order_addition_reject').click(function () {
                    process_order_addition(4);
                });
                t('#order_addition_agree').click(function () {
                    process_order_addition(3);
                });

                t('#order_info_advise_items .order_info_items li img').click(function () {
                    t(this).css('display', 'none');
                    t(this).siblings('img').css('display', 'inline-block');
                });
            });
        } else {
            var order = yangaiche(ls.order.touch)();
            order.client_basic = {
                name: order.contact_name,
                phone_number: order.phone_number,
                car_number: order.car_number,
                location: yangaiche(ls.location.touch)()
            };
            order.order_status_key = 'creating';
            yangaiche(app.order_info.show)(order);
        }
    });
}());