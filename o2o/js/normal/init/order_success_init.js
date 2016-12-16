;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('init/order_success_init');
    yangaiche(sys.load_default_module)('back');

    yangaiche(sys.init)(function (t) {
        t('#close_button').text('返回首页');

        t('#close_button').click(function () {
            yangaiche(ls.back.set_back_to_self)('store.html');
        });
    });
}());