;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('duplicate_submission');

    app.pay_do = {
        to_pay: 'app_pay_do_to_pay'
    };

    yangaiche(app.pay_do.to_pay, function () {
        var reset_button = yangaiche(app.ds.reset_button),
            show_msg = yangaiche(app.show_msg.show);
        return function (param, success_callback, url, else_callback, debug_flag) {
            yangaiche(app.http.post_charge_request)(url || '/v3/api/charge.json', param, function (charge) {
                pingpp.createPayment(charge, function (result, error) {
                    if (result === 'success') {
                        yangaiche(sys.load_module)('close_app');
                        if (yangaiche(sys.exist)(success_callback)) {
                            success_callback();
                        }
                    } else if (result === 'fail') {
                        reset_button('#submit_button');
                        reset_button('#order_settle_footer .submit');
                        show_msg('支付失败');
                        if (else_callback) {
                            else_callback();
                        }
                        if (yangaiche(sys.exist)(debug_flag)) {
                            show_msg(JSON.stringify(error));
                        }
                    } else if (result === 'cancel') {
                        reset_button('#submit_button');
                        reset_button('#order_settle_footer .submit');
                        show_msg('您已取消支付');
                        if (else_callback) {
                            else_callback();
                        }
                    }
                });
            }, function (error) {
                show_msg(error.message || error);
            });
        };
    });
}());