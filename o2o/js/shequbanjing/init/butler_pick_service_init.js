;(function () {
    'use strict';

    //yangaiche(sys.load_module)('');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('init/butler_pick_service_init');
    //yangaiche(sys.load_lib_module)('');

    yangaiche(sys.init)(function (t) {

        var user_info = yangaiche(sys.local_storage).get(ls.user.user_info);

        yangaiche(app.http.tweak)(function (type, request_type, url) {
            if (type === app.http.abort_or_hijack) {
                if (url === '/v1/api/radius/auto_login.json') {
                    var url_params = yangaiche(app.url_parameter);
                    if (url_params.user_open_id && url_params.sign && url_params.nonce && url_params.timestamp) {
                        return url;
                    } else {
                        return app.http.abort;
                    }
                }
                return url;
            }
        });

        yangaiche(app.http.post_request)('/v1/api/radius/auto_login.json', yangaiche(app.url_parameter), function (data) {
            yangaiche(ls.user.set)(data);
        }, function (error) {
            yangaiche(ls.user.set)({});
            yangaiche(app.show_msg.show)(error.message || JSON.stringify(error));
        });

        t('#store-item-car-choose').click(function () {
            return Boolean(user_info);
        });
    }, 0);
}());