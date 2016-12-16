;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('env');

    app.pay.get_extra_param = 'get_pay_extra_param';

    yangaiche(app.pay.get_extra_param, function () {
        return function (param, success_url, cancel_url) {
            param.channel = 'alipay_wap';
            param.extra = {
                success_url: yangaiche(app.env.get_host) + success_url,
                cancel_url: yangaiche(app.env.get_host) + cancel_url
            };
        };
    });

}());