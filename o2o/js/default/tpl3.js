;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('duplicate_submission');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('back');

    (function (t) {

        t('body').on('touchstart', function () {
        });

        var url_params = yangaiche(app.url_parameter),
            exist = yangaiche(sys.exist),
            show_msg = yangaiche(app.show_msg.show);
        if (!(exist(url_params.page_type) && exist(url_params.page_code))) {
            var count = 0;
            var fn = function () {
                count += 1;
                if (count > 3) {
                    t('.am-dimmer').css('display', 'block');
                    t('.am-dimmer').unbind('click');
                    return;
                }
                show_msg('链接地址不正确', fn);
            };
            fn();
        }

        t('#submit_button_1').click(function () {
            yangaiche(app.ds.disable_button)('#submit_button_1');
            var phone_number = t('#phone').val();
            if (!/\d{11}/.test(phone_number)) {
                show_msg('请输入11位的手机号码.');
                yangaiche(app.ds.reset_button)('#submit_button_1');
                return;
            }

            yangaiche(app.http.post_request)('/v2/api/activity/create.json', {
                activity_code: url_params.page_type,
                activity_source: url_params.page_code,
                phone_number: phone_number
            }, function () {
                yangaiche(ls.back.set_back_to_self)('activities/pubhtml/coupon_got.html');
            }, function (error) {
                console.log(JSON.stringify(error));
                if ('20102' === error.code) {
                    yangaiche(ls.back.set_back_to_self)('activities/pubhtml/coupon_got.html?done=true');
                    return;
                }

                show_msg(error.message);
                yangaiche(app.ds.reset_button)('#submit_button_1');
            });
        });

    }(yangaiche(sys.$)));

}());