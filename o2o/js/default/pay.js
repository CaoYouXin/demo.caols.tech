;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('duplicate_submission');
    yangaiche(sys.load_module)('pay/do');

    app.pay = {
        get_param: 'get_param',
        do: 'to_pay',
        to_pay_type_info: 'to_pay_type_info'
    };

    yangaiche(app.pay.get_param, function () {
        // 加载方法所需模块
        yangaiche(sys.load_module)('pay_param');
        return function (param, success_url, cancel_url) {
            param.subject = '养爱车-一站式管家服务';
            param.body = '养爱车-一站式管家服务';
            yangaiche(app.pay.get_extra_param)(param, success_url, cancel_url);
            return param;
        };
    });

    yangaiche(app.pay.do, function () {
        return yangaiche(app.pay_do.to_pay);
    });

    yangaiche(app.pay.to_pay_type_info, function () {
        return function (order) {
            if (!yangaiche(sys.exist)(order.pay_mode)) {
                return '线下支付';
            }
            if (1 === order.pay_mode) {
                return '在线支付';
            } else if (2 === order.pay_mode) {
                return '线下支付';
            }
        };
    });

}());