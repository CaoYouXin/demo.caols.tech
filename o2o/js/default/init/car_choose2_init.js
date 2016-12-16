;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {
        var brand = yangaiche(app.url_parameter).brand;
        yangaiche(sys.local_storage).set('selected_brand', brand);
        yangaiche(app.http.get_request)('/v1/api/meta_categories.json?brand_type=' + brand, function (data) {
            var tpl = Handlebars.compile(t('#category_list_tpl').text());
            t('#scroller').prepend(tpl(data));
        }, function (error) {
            yangaiche(app.show_msg.show)('请求服务器错误，' + (error.message || error));
        });
    });

}());