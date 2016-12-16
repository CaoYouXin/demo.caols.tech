;(function () {

    'use strict';

	yangaiche(sys.load)('lib/yangaiche_module.js', true);
    yangaiche(sys.load_default_module)('repository');

    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(app.show_msg.init)();

    window.location.href.replace(/\/.*\/(.*?)\.html/, function (sth, filename) {
        yangaiche(sys.load_module)('go_back');
        yangaiche(sys.load_module)('init/' + filename + '_init');
        yangaiche(sys.load_module)('font/auto_font_size');
        yangaiche(sys.start)();
    });

}());