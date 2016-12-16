;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('env');

    app.open_id_init.situation = 'production';
    app.open_id_init.appId = 'wxb78dc0eb87da0df9';
    function fn1() {
        app.open_id_init.situation = 'test';
        app.open_id_init.appId = 'wx6569a515e0c3e346';
    }

    function fn2() {
        app.open_id_init.situation = 'production';
        app.open_id_init.appId = 'wxb78dc0eb87da0df9';
    }

    yangaiche(app.env.do_sth)({
        dev: fn1,
        local: fn1,
        staging: fn1,
        product: fn2
    });
}());