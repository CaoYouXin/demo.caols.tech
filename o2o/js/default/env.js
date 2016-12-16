;(function () {

    'use strict';

    app.env = {
        get: 'get_env',
        do_sth: 'do_sth_by_env',
        get_host: 'get_host',
        do_sth_by_browser: 'do_sth_by_browser'
    };

	yangaiche(app.env.get, function () {
        return function () {
            var cfg = $.ajax({
                url: yangaiche(sys.root) + '/map/env.json',
                cache: true,
                async: false,
                dataType: 'json'
            });
            return cfg.responseJSON.thisis;
        }();
    });

    yangaiche(app.env.do_sth, function () {
        return function (sth, params) {
            sth[yangaiche(app.env.get)](params);
        };
    });

    yangaiche(app.env.get_host, function () {
        // 如需转义，请使用encodeURIComponent方法，对应的方法是decodeURIComponent
        return function () {
            var cfg = $.ajax({
                url: yangaiche(sys.root) + '/map/env.json',
                cache: true,
                async: false,
                dataType: 'json'
            });
            var host = cfg.responseJSON.domain + '/';

            if (host.indexOf(window.location.host) >= 0) {
                return host;
            }

            host = 'http://' + window.location.host + '/h5/';
            return host;
        }();
    });

    yangaiche(app.env.do_sth_by_browser, function () {
        return function (sth, params) {
            sth[yangaiche(sys.browser_type).type](params);
        };
    });

}());