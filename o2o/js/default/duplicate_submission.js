;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');

    app.ds = {
        disable_button: 'disable_button',
        reset_button: 'reset_button'
    };

    yangaiche(app.ds.disable_button, function () {
        return function (selector) {
            var raw_css = {};
            var targets = yangaiche(sys.$)(selector);
            raw_css.color = targets.css('color');
            raw_css.border_color = targets.css('border-color');
            raw_css.background_color = targets.css('background-color');
            yangaiche(sys.local_storage).set(selector, raw_css);
            targets.attr('disabled', 'disabled');
            targets.css('background-color', '#cecece');
            targets.css('border-color', '#cecece');
            targets.css('color', '#aaaaaa');
        };
    });

    yangaiche(app.ds.reset_button, function () {
        return function (selector) {
            var raw_css = yangaiche(sys.local_storage).get(selector);
            var targets = $(selector);
            targets.removeAttr('disabled');
            targets.css('background-color', raw_css.background_color);
            targets.css('border-color', raw_css.border_color);
            targets.css('color', raw_css.color);
        };
    });

}());