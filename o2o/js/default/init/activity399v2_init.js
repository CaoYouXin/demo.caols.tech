;(function () {

    'use strict';

	yangaiche(sys.load_module)('back');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('duplicate_submission');

    yangaiche(sys.init)(function (t) {

        t('.gototop').click(function () {
            document.body.scrollTop = 0;
        });

        var show_msg = yangaiche(app.show_msg.show),
            disable_button = yangaiche(app.ds.disable_button),
            reset_button = yangaiche(app.ds.reset_button);

        var start_timer_controll = function (value) {
            if (typeof(t('#verify_btn')) === 'undefined') {
                return;
            }
            t('#verify_btn').text(value);
            if (value === 0) {
                t('#verify_btn').text('获取验证码');
                reset_button('verify_btn');
                return;
            }
            setTimeout(function () {
                return start_timer_controll(value - 1);
            }, 1000);
        };

        t('#verify_btn').click(function () {
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
                disable_button('#verify_btn');
                start_timer_controll(60);
            }, function (data) {
                reset_button('#login_btn');
                show_msg(data.message);
            });
        });

        function show() {
            t('#login').hide();
            t('#exchange').show(500, function () {
            });
        }

        function check_exchange(data) {
            t('#exchange p').html('您的手机号为' + data[ls.user.user_phone]);

            yangaiche(app.http.get_request)('/v1/api/pass_card/exchange_check?code=wei_ka_voucher', function (data) {
                t('#exchange #exchange_code').val(data.card_number);
                t('#exchange #exchange_code').attr('disabled', true);

                key.activity399.is_checked = true;

                show();
            }, function () {
                t('#exchange #exchange_code').val('');
                t('#exchange #exchange_code').removeAttr('disabled');

                key.activity399.is_checked = false;

                show();
            });
        }

        t('#login_btn').click(function () {
            disable_button('#login_btn');
            var phone_number = t('#phone').val();
            var verify_code = t('#verify_code').val();
            if (phone_number === '' || verify_code === '') {
                show_msg('手机号码与验证码均不能为空');
                reset_button('#login_btn');
                return;
            }
            var param = {phone: phone_number, verify_code: verify_code, sign_origin: yangaiche(sys.browser_type).type};
            yangaiche(app.http.post_request)('/v1/api/car_user/sign_up.json', param, function (data) {
                yangaiche(ls.user.set)(data);

                check_exchange(data);
            }, function (error) {
                reset_button('#login_btn');
                show_msg(error.message);
            });
        });

        t('#exchange_btn').click(function () {
            disable_button('#exchange_btn');

            if (key.activity399.is_checked) {
                yangaiche(ls.back.set_back_to_self)('store_item_page.html?ware_id=50');
                return;
            }

            var exchange_code = t('#exchange_code').val();
            if (!exchange_code || exchange_code === '') {
                show_msg('兑换码不能为空');
                reset_button('#exchange_btn');
                return;
            }

            yangaiche(app.http.post_request)('/v1/api/pass_card/exchange.json', {
                card_number: exchange_code,
                code: 'wei_ka_voucher'
            }, function () {
                yangaiche(ls.back.set_back_to_self)('store_item_page.html?ware_id=50');
            }, function (error) {
                reset_button('#exchange_btn');
                show_msg(error.message);
            });
        });

        yangaiche(ls.user.if_exist)(function (user) {
            check_exchange(user);
        });

        key.external_sale_configs = {
            title: '【养爱车】车内深度净化套餐，只需399元！限时抢购！',
            desc: '霾冬来临，你需要一次彻底的爱车清洁',
            imgUrl: 'http://7xiqe8.com2.z0.glb.qiniucdn.com/logo.png'
        };

        yangaiche(sys.load_default_module)('share');
    });
}());