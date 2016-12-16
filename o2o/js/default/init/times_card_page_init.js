;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('bigpipe/pipe_able');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('pay');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {
        yangaiche(app.bigpipe.stage)({
            template_url: 'template/times_card_detail.html',
            dom_hook: yangaiche(sys.$)('#times_card_detail'),
            data: yangaiche(sys.local_storage).get(key.times_card.current),
            hook: {
                pre: function (data) {
                    data.supplier_name = yangaiche(sys.local_storage).get(key.supplier.current).supplier_name;
                    return data;
                }
            }
        });

        yangaiche(app.bigpipe.stage)({
            template_url: 'template/times_card_usage.html',
            dom_hook: yangaiche(sys.$)('#times_card_usage')
        });

        yangaiche(app.bigpipe.commit)();

        var match = window.location.href.match(/http(.*?\/){4}(.*)/);
        var url = match[match.length - 1];
        t('#submit_button').click(function () {
            yangaiche(app.http.post_request)('/v1/api/times_card_order/create.json', {
                times_card_product_id: yangaiche(sys.local_storage).get(key.times_card.current).times_card_product_id
            }, function (data) {
                console.log(data);

                var param = yangaiche(app.pay.get_param)({
                    times_card_order_id: data.times_card_order_id
                }, url + '?suc=true', url + '?suc=false');

                yangaiche(app.pay.do)(param, null, '/v1/api/times_card_order/charge.json');
            }, function (error) {
                console.log(error);
                yangaiche(app.show_msg.show)(error.message);
            });
        });

        if (yangaiche(sys.exist)(yangaiche(app.url_parameter).suc)) {
            match = url.match(/(.*?)\?.*/);
            url = match[match.length - 1];
            yangaiche(ls.back.set_back_to_store)(url);
        }
    });
}());