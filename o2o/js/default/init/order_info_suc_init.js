;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('pay');
    yangaiche(sys.load_default_module)('order_info');

    yangaiche(sys.init)(function (t) {
        var getReq = yangaiche(app.http.get_request);

        var reqParams = yangaiche(app.url_parameter);
        if (yangaiche(sys.exist)(reqParams.order_id)) {//有参数，查看页面
            getReq('/v3/api/orders.json?user_type=caruser&order_id=' + reqParams.order_id, function (order) {
                yangaiche(app.order_info.show)(order);

                t('#order_info_advise_items').css('display', 'none');

                t('#submit_button').text('关闭');
                t('#submit_button').css('display', 'block');

                t('#submit_button').click(function () {
                    yangaiche(sys.load_module)('close_app');
                });
            });
        }
    });

}());