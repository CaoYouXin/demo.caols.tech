;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');

    yangaiche(sys.init)(function (t) {
        var class_name = 'auto-font-size-yac', min_font_size = 12, font_size_step = 2,
            size_limit_attr_name = 'font-size-limit';

        function set_width(max_limit, font_size, text_size, max_font_size) {

            console.log('max_limit : ' + max_limit + ' font_size : ' + font_size + ' text_size : ' + text_size + ' max_font_size : ' + max_font_size);

            if (font_size * text_size > max_limit) {
                return font_size - 2;
            }

            if (font_size + font_size_step > max_font_size) {
                return font_size;
            }

            return set_width(max_limit, font_size + font_size_step, text_size, max_font_size);

        }

        yangaiche(app.http.tweak)(function (type) {
            if (type === app.http.after_render) {
                var need_auto_size = t('.' + class_name);
                t.each(need_auto_size, function (i, comp) {
                    var $comp = t(comp);

                    var max_limit = $comp.attr(size_limit_attr_name);

                    $comp.css('font-size', set_width(max_limit,
                            min_font_size + font_size_step,
                            $comp.text().replace(/^\s*/, '').replace(/\s*$/, '').length,
                            $comp.css('font-size').match(/(\d*)/)[1]) + 'px');
                });
            }
        });
    }, 0);
}());