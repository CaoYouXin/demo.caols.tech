;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('openid');
    yangaiche(sys.load_default_module)('env');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');

    app.open_id_init = {};

    yangaiche(sys.load_module)('init_open_id_params');

    app.open_id_init.redirect_uri = encodeURIComponent(yangaiche(ls.openid.get_redirect_uri));
    app.open_id_init.snsapi = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + app.open_id_init.appId + '&redirect_uri=' + app.open_id_init.redirect_uri + '&response_type=code&scope=snsapi_base#wechat_redirect';

    app.open_id_init.reqParam = yangaiche(app.url_parameter);
    app.open_id_init.to_snsapi = true;
    if (app.open_id_init.reqParam.code) {
        // TODO : get还是post啦?
        yangaiche(app.http.post_request)('/v1/api/login_by_wx_code.json?code=' + app.open_id_init.reqParam.code + '&situation=' + app.open_id_init.situation, {}, function (data) {
            yangaiche(ls.user.set)(data);
            yangaiche(ls.openid.after_login)(true);
        }, function (data) {
            yangaiche(sys.local_storage).set(ls.openid.open_id, data.data);
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