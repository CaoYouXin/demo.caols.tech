;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('template');

    yangaiche(sys.init)(function (t) {
        var tpl = Handlebars.compile(yangaiche(app.tpl.load)('template/carInfo.html'));
        t('body').prepend(tpl([yangaiche(sys.local_storage).get(key.car.info)]));
        t('body').children().eq(0).find('.fixed-width-content').css('width', (640 - 30 - 70 - 30 - 30) + 'px');
    });

}());