;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {

        var page_code = yangaiche(app.url_parameter).page_code;

        page_code = decodeURIComponent(page_code).replace(/\s*/g, '');

        console.log(page_code);

        yangaiche(app.http.get_request)('/v1/api/h5template/get_page_by_code.json?code=' + page_code, function (data) {
            console.log(JSON.stringify(data));

            t('#player').html(data.rendered_html);

            // init js suits
            key.external_sale_configs = JSON.parse(data.external_sale_configs);
            console.log(key.external_sale_configs);
            t.each(data.js_suit.js_suit, function (i, js_name) {
                yangaiche(sys.load_module)(js_name);
            });
        });
    });

}());