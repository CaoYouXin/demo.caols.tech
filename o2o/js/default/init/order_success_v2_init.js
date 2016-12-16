;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('back');
	yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('pay');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_module)('order/get_payment_order_id');

    yangaiche(sys.init)(function (t) {
        var order_id = yangaiche(app.url_parameter).order_id;
        if (order_id) {
            yangaiche(app.http.get_request)('/v3/api/orders.json?user_type=caruser&order_id=' + order_id, function (data) {
                yangaiche(ls.order.set)(data);
                yangaiche(ls.back.set_back_to_store)('order_success_v2.html');
            });
            return;
        }

        t('.normal-bottom-btn-div').css('display', 'block');
        t('#pay_button').css('display', 'none');

        var info_template = Handlebars.compile(t('#info-tpl').html());
        var order_info = yangaiche(ls.order.touch)();
        order_info.total_price = order_info.total_price.toFixed(1);
        t('#info_view').html(info_template(order_info));

        t('#close_button').click(function () {
            yangaiche(sys.load_module)('close_app');
        });

    });
}());