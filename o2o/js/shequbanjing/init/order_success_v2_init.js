;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('init/order_success_v2_init');
    yangaiche(sys.load_default_module)('back');

    yangaiche(sys.init)(function (t) {
        t('#close_button').hide();
    });
}());