;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('openid');
    yangaiche(sys.load_default_module)('duplicate_submission');

    yangaiche(sys.init)(function (t) {
        var user_mobile = yangaiche(sys.local_storage).get(ls.user.user_phone);
        if (yangaiche(sys.exist)(user_mobile)) {
            t('#phone').val(user_mobile);
        }

        var start_timer_controll = function (value) {
            if (typeof(t('#verify_button')) === 'undefined') {
                return;
            }
            t('#verify_button').text(value);
            if (value === 0) {
                t('#verify_button').text('获取验证码');
                reset_button('#verify_button');
                return;
            }
            setTimeout(function () {
                return start_timer_controll(value - 1);
            }, 1000);
        };

        var show_msg = yangaiche(app.show_msg.show),
            disable_button = yangaiche(app.ds.disable_button),
            reset_button = yangaiche(app.ds.reset_button);

        t('#verify_button').click(function () {
            var phone_number = t('#phone').val();
            console.log(phone_number);
            if (phone_number === '') {
                show_msg('请输入手机号码获取验证码');
                return;
            }
            if (!phone_number.match(/^\d{11}$/)) {
                show_msg('请输入正确的手机号码获取验证码');
                return;
            }
            yangaiche(app.http.get_request)('/v1/api/sign_verify_code.json/' + phone_number, function () {
                disable_button('#verify_button');
                start_timer_controll(60);
            }, function (data) {
                reset_button('#login_button');
                show_msg(data.message);
            });
        });

        t('#login_button').click(function () {
            // disable_button('#login_button');
            // var phone_number = t('#phone').val();
            // var verify_code = t('#verify_code').val();
            // if (phone_number === '' || verify_code === '') {
            //     show_msg('手机号码与验证码均不能为空');
            //     reset_button('#login_button');
            //     return;
            // }
            // var param = {phone: phone_number, verify_code: verify_code, sign_origin: yangaiche(sys.browser_type).type};
            yangaiche(app.http.post_request)('/v1/api/car_user/sign_up.json', {}, function (data) {
                yangaiche(ls.user.set)(data);
                yangaiche(ls.openid.bind)();
                yangaiche(ls.openid.after_login)();
            }, function (data) {
                reset_button('#login_button');
                show_msg(data.message);
            });
        });
    });
}());