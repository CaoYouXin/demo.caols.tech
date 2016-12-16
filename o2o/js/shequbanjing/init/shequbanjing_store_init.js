;(function () {
    'use strict';

    // 这里导入其它文件的代码
    //yangaiche(sys.load_module)('');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('order');
    //yangaiche(sys.load_lib_module)('');

    yangaiche(sys.init)(function (t) {
        // 定义变量 var getReq = yangaiche(app.http.get_request);
        var http_get = yangaiche(app.http.get_request),
            set_back_to_self = yangaiche(ls.back.set_back_to_self);

        // 功能代码
        http_get('/v1/api/radius/get_goods_info.json', function (data) {
            console.log(data);

            var tpl_data = [];

            function process_product_data(i, product) {
                if (product.ware_price_max === product.ware_price_min) {
                    product.ware_price_text = product.ware_price_max.toFixed(1);
                } else {
                    product.ware_price_text = product.ware_price_max.toFixed(1) + ' ~ ' + product.ware_price_min.toFixed(1);
                }
                tpl_data.push(product);
            }

            t.each(data, function (i, datum) {
                t.each(datum.ware_list, process_product_data);
            });

            var tpl_fn = Handlebars.compile(t('#single_products_tpl').text());
            t('#shequbanjing_products').append(tpl_fn(tpl_data));
        });

        t('#shequbanjing_products').on('click', 'li', function () {
            var location = yangaiche(ls.location.touch)();
            yangaiche(ls.order.clear)();
            yangaiche(ls.location.set)(location);

            var data_rel = t(this).attr('data-rel');
            if (/\.html$/.test(data_rel)) {
                set_back_to_self(data_rel);
            } else {
                set_back_to_self('store_item_page.html?ware_id=' + data_rel);
            }
        });
    });
}());