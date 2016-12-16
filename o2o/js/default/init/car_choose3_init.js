;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {
        var category = yangaiche(app.url_parameter).category;
        yangaiche(app.http.get_request)('/v1/api/meta_cars.json?category_type=' + category, function (data) {
            var model2info = {};
            t.each(data, function (i, o) {
                if (o.producer.trim() === '无差别') {
                    o.producer = '';
                }
                model2info[o.model_type] = o;
            });
            yangaiche(sys.local_storage).set('model2info', model2info);

            var tpl = Handlebars.compile(t('#car_list_tpl').text());
            t('#scroller').prepend(tpl(data));
        }, function (error) {
            yangaiche(app.show_msg.show)('请求服务器错误，' + (error.message || error));
        });
    });

}());