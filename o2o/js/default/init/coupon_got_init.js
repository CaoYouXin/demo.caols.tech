;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {
        t('.yac-coupon-got-btn').bind('touchstart', function () {
            t(this).addClass('yac-coupon-got-btn-hover');
        }).bind('touchend', function () {
            t(this).removeClass('yac-coupon-got-btn-hover');
        }).click(function () {
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yac.yacapp';
        });

        if (yangaiche(app.url_parameter).done) {
            yangaiche(app.show_msg.show)('这是你已经抢过的优惠券哦');
        }

        t('#footer_close').click(function () {
            t('#to_hide').hide();
        });
    });

}());