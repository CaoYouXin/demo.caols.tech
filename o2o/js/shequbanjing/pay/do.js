;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');

    app.pay_do = {
        to_pay: 'app_pay_do_to_pay'
    };

    yangaiche(app.pay_do.to_pay, function () {
        return function (param) {
            yangaiche(app.http.get_request)('/v1/api/radius/get_access_token.json', function (data) {
                var token = 'access_token=' + data.access_token + '&';
                var call_back_url = data.call_back_url;
                console.log(JSON.stringify(data));
                window.location.href = call_back_url + '?' + token + 'type=payment&order_id=' + param.order_id;
            }, function (error) {
                yangaiche(app.show_msg.show)(error.message);
            });
        };
    });
}());