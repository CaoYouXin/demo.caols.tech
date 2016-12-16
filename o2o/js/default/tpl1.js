;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('duplicate_submission');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('parameter');

    (function (t) {

        t('body').on('touchstart', function () {
        });

        var show_msg = yangaiche(app.show_msg.show),
            disable_button = yangaiche(app.ds.disable_button),
            reset_button = yangaiche(app.ds.reset_button),
            postReq = yangaiche(app.http.post_request),
            getReq = yangaiche(app.http.get_request),
            store = yangaiche(sys.local_storage);

        var tel_link = t('#contact-us');
        tel_link.css('margin-left', ((640 - tel_link.width()) / 2) + 'px');

        var is_weixin = function isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i);
        }();

        function pay(id) {

            store.set('activity_record_id', id);
            store.set('subject', '养爱车活动');
            store.set('success_url', '/activities/pubhtml/external_sale_pay_success.html');
            store.set('cancel_url', '/activities/pubhtml/external_sale_pay_fail.html');

            window.location.href = './external_sale_pay.html';

        }

        function create_order() {

            //TODO 下单
            postReq('/v1/api/activity_record/create', {activity_code: store.get('external_sale_activity_code')}, function (data) {
                //TODO

                pay(data.activity_record_id);


            }, function (data) {
                var cation = './activities/pubhtml/external_sale_youre_late.html';
                if ('20101' === data.code) {
                    alert('验证信息失败,请尝试刷新重试');
                }
                if ('20102' === data.code) {
                    cation = './activities/pubhtml/external_sale_you_areadydone.html';
                }
                window.location.href = cation;
                reset_button('login_button');
            });
        }

        function to_pay() {

            //入口
            var param = {
                phone: store.get('external_sale_phone_number'),
                verify_code: store.get('external_sale_verify_code'),
                sign_origin: 'activity'
            };
            postReq('/v1/api/car_user/sign_up.json', param, function (data) {

                yangaiche(ls.user.set)(data);

                create_order();

            }, function (data) {
                reset_button('login_button');
                show_msg(data.message);
            });
        }

        if (yangaiche(app.url_parameter).to_pay) {
            t('body').css('display', 'none');
            to_pay();
        } else if (yangaiche(app.url_parameter).code) {
            yangaiche(sys.load_module)('simple_get_openid_init');
        } else {

            // 检查是否过期
            var activity_code = yangaiche(app.url_parameter).page_code;

            activity_code = decodeURIComponent(activity_code).replace(/\s*/g, '');

            console.log(activity_code);

            getReq('/v1/api/activity/is_valid?code=' + activity_code, function (data) {
                if (data.code === activity_code) {
                    if (data.status === false) {
                        window.location.href = './activities/pubhtml/external_sale_youre_late.html';
                    }
                }
                store.set('external_sale_activity_code', activity_code);
            }, function () {
                window.location.href = './activities/pubhtml/external_sale_youre_late.html';
            });

        }

        var start_timer_controll = function (value) {
            if (typeof(t('#verify_button')) === 'undefined') {
                return;
            }
            t('#verify_button').text(value);
            if (value === 0) {
                t('#verify_button').text('获取验证码');
                reset_button('verify_button');
                return;
            }
            setTimeout(function () {
                return start_timer_controll(value - 1);
            }, 1000);
        };

        t('#verify_button').click(function () {
            disable_button('verify_button');
            var phone_number = t('#phone').val();
            if (phone_number === '') {
                show_msg('请输入手机号码获取验证码');
                reset_button('verify_button');
                return;
            }
            if (!phone_number.match(/^\d{11}$/)) {
                show_msg('请输入正确的手机号码获取验证码');
                reset_button('verify_button');
                return;
            }
            getReq('/v1/api/sign_verify_code.json/' + phone_number, function () {
                start_timer_controll(60);
            }, function (data) {
                reset_button('verify_button');
                show_msg(data.message);
            });
        });

        t('#login_button').click(function () {
            disable_button('login_button');
            var phone_number = t('#phone').val();
            var verify_code = t('#verify_code').val();
            if (phone_number === '' || verify_code === '') {
                show_msg('手机号码与验证码均不能为空');
                reset_button('login_button');
                return;
            }

            store.set('external_sale_phone_number', phone_number);
            store.set('external_sale_verify_code', verify_code);

            if (is_weixin && !store.get('external_sale_wechat_openid')) {
                yangaiche(sys.load_module)('simple_get_openid_init');
            } else {
                to_pay();
            }
        });
    }(yangaiche(sys.$)));

}());