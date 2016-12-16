;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('env');
    yangaiche(sys.load_default_module)('http');

    ls.openid = {
        login_by_opencode: 'login_by_opencode',
        show_login_win: 'show_login_win',
        bind: 'bind_openid',
        after_login: 'after_login',
        get_redirect_uri: 'get_redirect_uri',

        open_id: 'open_id',
        external_sale_wechat_openid: 'external_sale_wechat_openid',
        user_gender: 'user_gender',
        user_mobile: 'user_mobile',
        user_real_name: 'user_real_name',
        page_before_login: 'page_before_login'
    };

    yangaiche(ls.openid.login_by_opencode, function () {
        return function () {
            var url = window.location.href;
            yangaiche(sys.local_storage).set(ls.openid.page_before_login, url);
            window.history.replaceState(null, null, url);
            yangaiche(ls.back.set_back_to_self)('open_id.html');
        };
    });

    yangaiche(ls.openid.show_login_win, function () {
        return function () {
            var url = yangaiche(sys.local_storage).get(ls.openid.page_before_login);
            window.history.replaceState(null, null, url);
            yangaiche(ls.back.set_back_to_self)('login.html');
        };
    });

    yangaiche(ls.openid.bind, function () {
        return function () {
            var open_id = yangaiche(sys.local_storage).get(ls.openid.open_id);
            if (!yangaiche(sys.exist)(open_id)) {
                return false;
            }

            var param = {
                openid: open_id,
                open_type: yangaiche(sys.browser_type).type
            };
            yangaiche(app.http.post_request)('/v1/api/openid_bind.json', param, function () {
                console.log('绑定openID成功');
            }, function (data) {
                console.log('绑定openID失败: ' + data.message);
            });
        };
    });

    yangaiche(ls.openid.after_login, function () {
        return function () {
            var referer = yangaiche(ls.back.get_parent_of)('open_id.html');
            if (yangaiche(sys.exist)(referer)) {
                yangaiche(ls.back.set_back_to_his)(referer);
            } else {
                yangaiche(ls.back.set_back_to)('store.html', null);
            }
        };
    });

    yangaiche(ls.openid.get_redirect_uri, function () {
        return function () {
            return yangaiche(app.env.get_host) + 'open_id.html';
        }();
    });

}());