;(function () {
    'use strict';

    //yangaiche(sys.load_module)();
    yangaiche(sys.load_default_module)('paging');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('format');

    yangaiche(sys.init)(function (t) {
        // 定义变量

        // 功能代码

        function make_array(size) {
            var array = [];
            for (var i = 0; i < size; i++) {
                array.push(i);
            }
            return array;
        }

        yangaiche(app.paging.setup)({
            url_request: '/v2/api/order/service_comment/page_list.json?product_ids=' + yangaiche(app.url_parameter).product_ids,
            data_handler: function (data) {
                t.each(data.items, function (i, d) {
                    d.order_rating = make_array(d.service_rating);
                    d.keeper_rating = make_array(d.keeper_rating);
                    d.create_time = d.create_time.substr(0, (4 + 2 + 1 + 2 + 1));
                    d.comment_user_name = d.comment_user_name.substr(0, 1) + '**';
                    d.comment_text = yangaiche(app.format.stripscript)(d.comment_text);
                });

                var tpl = Handlebars.compile(t('#comments_list_tpl').text());
                t('#store-item-comments ul').append(tpl(data.items));

                var total_height = 0;
                t.each(t('#store-item-comments ul li'), function (i, l) {
                    var list = t(l);
                    var height = (list.children('p').eq(0).height() + 70 * 2);
                    total_height += height;
                    list.css('height', height + 'px');
                });
                t('#store-item-comments ul').height(total_height);
            }
        });
    });
}());
