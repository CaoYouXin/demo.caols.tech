;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('openid');
    yangaiche(sys.load_default_module)('env');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');

    app.open_id_init = {};

    app.open_id_init.situation = 'production';
    app.open_id_init.appId = '2882303761517266846';
    function fn1() {
        app.open_id_init.situation = 'test';
        app.open_id_init.appId = '2882303761517356288';
    }

    function fn2() {
        app.open_id_init.situation = 'production';
        app.open_id_init.appId = '2882303761517266846';
    }

    yangaiche(app.env.do_sth)({
        dev: fn1,
        staging: fn2,
        product: fn2
    });

    app.open_id_init.redirect_uri = encodeURIComponent(yangaiche(ls.openid.get_redirect_uri));
    app.open_id_init.snsapi = 'https://account.xiaomi.com/oauth2/authorize?client_id=' + app.open_id_init.appId + '&response_type=token&redirect_uri=' + app.open_id_init.redirect_uri;
    app.open_id_init.reqParam = yangaiche(app.hash_parameter);
    app.open_id_init.to_snsapi = true;
    app.open_id_init.accessToken = app.open_id_init.reqParam.access_token;//小米返回的access_token值
//app.open_id_init.macKey = app.open_id_init.reqParam.mac_key;//获取小米userId需要用到的macKey
//BUT : 目前没用到macKey好好地运作着...
    if (app.open_id_init.accessToken/* && macKey*/) {
        yangaiche(app.http.post_request)('/v1/api/login_by_xiaomi_openid.json?code=' + app.open_id_init.accessToken + '&situation=' + app.open_id_init.situation, {}, function (data) {
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