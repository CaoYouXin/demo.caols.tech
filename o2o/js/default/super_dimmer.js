;(function () {

    'use strict';

// dimmer，给任意元素加dimmer，并且亮起其中的任意元素。

    app.super_dimmer = {
        setup: 'super_dimmer_setup',

        template: '<div id="super-dimmer" style="position: absolute;z-index: 9999;background: #000;opacity: 0.5;display: none;"></div>',
        lighter_tpl: '<div id={{id}} style="position: absolute;z-index: {{index}};background: #FFF;opacity: 0.5;display: none;"></div>'
    };

	yangaiche(app.super_dimmer.setup, function () {
        var t = yangaiche(sys.$), tpl = Handlebars.compile(app.super_dimmer.lighter_tpl), index = 10000;
        return function (dimmer_selector, lighter_selectors) {
            var $dimmer = t(dimmer_selector)[0];
            console.log($dimmer.offsetLeft);
            t('body').append(app.super_dimmer.template);
            var $super_dimmer = t('#super-dimmer');
            console.log($super_dimmer);
            $super_dimmer.width($dimmer.offsetWidth);
            $super_dimmer.height($dimmer.offsetHeight);
            $super_dimmer.css('left', ($dimmer.offsetLeft) + 'px');
            $super_dimmer.css('top', ($dimmer.offsetTop) + 'px');

            var lighters = [];
            t.each(lighter_selectors, function(i, lighter_selector) {
                t.each(t(lighter_selector), function (j, s) {
                    var id = 'lighter-dimmer-' + i + '-' + j;
                    t('body').append(tpl({id: id, index: index}));
                    index += 1;

                    var lighter = t('#' + id);
                    lighter.width(s.offsetWidth);
                    lighter.height(s.offsetHeight);
                    lighter.css('left', (s.offsetLeft) + 'px');
                    lighter.css('top', (s.offsetTop) + 'px');

                    lighters.push(lighter);
                });
            });

            $super_dimmer.show();
            t.each(lighters, function (i, l) {
                t(l).show();
            });
        };
    });

}());