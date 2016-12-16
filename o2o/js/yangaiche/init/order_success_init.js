;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('init/order_success_init');

    yangaiche(sys.init)(function (t) {
        t('.normal-bottom-btn-div').remove();
    }, 0);
}());