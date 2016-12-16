;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');
    yangaiche(sys.load_default_module)('env');

    yangaiche(sys.init)(function (t) {
//    var bought_time = new Date().toString().replace('年', '-').replace('月', '-').replace('日 GMT+8', 'T'), y = 0, m = 0;
//    alert(bought_time);
//    bought_time.replace(/(\d{4})-(\d+)-\d{2}/g, function(a, year, month) {
//        y = year;
//        m = month;
//    });
//    alert(y + '年' + m + '月');

//    var user_phone = '18535276856';
//    alert(user_phone.substr(0, 3) + '****' + user_phone.substr(7, 4));

//    var i = 1;
//    alert('1' === (i + ''));

//    var str = '18535276856';
//    if (!str.match(/^\d{11}$/)) {
//        alert('alert');
//    }

//    alert(window.navigator.userAgent.toLowerCase());

        t.each([], function() {});

        var store = yangaiche(sys.local_storage);
        store.clear();
        alert('已清空本地存储');

        var host = yangaiche(app.env.get_host);
        alert(host);
    });

}());