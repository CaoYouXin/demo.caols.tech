;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('openid');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');

    app.open_id_init = {};

    app.open_id_init.redirect_uri = encodeURIComponent(yangaiche(ls.openid.get_redirect_uri));
    app.open_id_init.snsapi = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2014102800014827&auth_skip=false&scope=auth_userinfo&redirect_uri=' + app.open_id_init.redirect_uri;

    app.open_id_init.reqParam = yangaiche(app.url_parameter);
    app.open_id_init.to_snsapi = true;
    if (app.open_id_init.reqParam.auth_code) {
        yangaiche(app.http.post_request)('/v1/api/login_by_alipay_code.json?code=' + app.open_id_init.reqParam.auth_code, {}, function (data) {
            yangaiche(ls.user.set)(data);
            yangaiche(ls.openid.after_login)(true);
        }, function (data) {
            var json = JSON.parse(data.data);
            var storage = yangaiche(sys.local_storage);
            storage.set(ls.openid.user_gender, json.gender);
            storage.set(ls.openid.user_mobile, json.mobile);
            storage.set(ls.openid.user_real_name, json.real_name);
            storage.set(ls.openid.open_id, json.open_id);
            if (data && data.code === '10007') {
                yangaiche(ls.openid.show_login_win)();
            }
        });

        app.open_id_init.to_snsapi = false;
    }

    if (app.open_id_init.to_snsapi) {
        window.location.href = app.open_id_init.snsapi;
    }

}());