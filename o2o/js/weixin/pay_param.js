;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('openid');
    yangaiche(sys.load_default_module)('user');

    app.pay.get_extra_param = 'get_pay_extra_param';

    yangaiche(app.pay.get_extra_param, function () {
        return function (param) {
            param.channel = 'wx_pub';
            // 有两个localstorage的变量，一个是h5 app里的，一个是活动里的。最后取用户信息里的（已绑定用户）。最后触发登录，以绑定。
            var openid = yangaiche(sys.local_storage).get(ls.openid.open_id);
            if (!yangaiche(sys.exist)(openid) || openid === '') {
                openid = yangaiche(sys.local_storage).get(ls.openid.external_sale_wechat_openid);
                if (!yangaiche(sys.exist)(openid) || openid === '') {
                    openid = yangaiche(ls.user.touch)()[ls.user.openid];
                    if (!yangaiche(sys.exist)(openid) || openid === '') {
                        yangaiche(app.openid.show_login_win)();
                    }
                }
            }
            param.extra = {open_id: openid};
        };
    });

}());