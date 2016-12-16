;(function () {

    'use strict';

	//yangaiche(sys.load_default_module)('init/store_init');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('show_msg');

    yangaiche(sys.init)(function (t) {

        var user_info = yangaiche(sys.local_storage).get(ls.user.user_info),
            set_back_to_self = yangaiche(ls.back.set_back_to_self);

        t('#to_show_user_win').remove();
        t('#home-page-wrapper').empty().css('display', 'block');

        yangaiche(app.http.post_request)('/v1/api/radius/auto_login.json', yangaiche(app.url_parameter), function (data) {
            yangaiche(ls.user.set)(data);
            set_back_to_self('shequbanjing_store.html');
        }, function (error) {
            yangaiche(ls.user.set)({});
            yangaiche(app.show_msg.show)(error.message || JSON.stringify(error));
        });

    }, 0);

}());