;(function () {
    'use strict';

    //yangaiche(sys.load_module)();
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('init/order_settle_init');

    yangaiche(sys.init)(function (t) {
        // 定义变量

        // 功能代码
        yangaiche(ls.order.update)(function (order) {
            order.coupon_id = null;
        });

        t('#coupon').addClass('invisible');

    }, 0);
}());
