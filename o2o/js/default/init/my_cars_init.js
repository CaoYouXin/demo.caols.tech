;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('swiper');
    yangaiche(sys.load_default_module)('format');
    yangaiche(sys.load_default_module)('back');

    yangaiche(sys.init)(function (t) {

        //var raw_data = '';
        //var data = $.parseJSON(raw_data);

        var progress = $.AMUI.progress;
        progress.start();
        progress.inc(0.5);
        t('#nprogress .nprogress-bar').css('bottom', 'auto');
        t('#nprogress .nprogress-bar').css('top', '0');

        yangaiche(app.http.get_request)('/v1/api/cars.json?car_user_id=' + yangaiche(ls.user.touch)().user_id, function (data) {
            var item = {};
            var tmpl_data = [];
            for (var i = 0; i < data.length; i++) {
                var view_data = {};
                view_data.car_id = data[i].id;
                view_data.car_model_type = data[i].model_type;
                view_data.img_url = data[i].brand_img_url.thumbnail_url;
                view_data.car_number = yangaiche(app.format.stripscript)(data[i].licence.province + data[i].licence.number);
                view_data.model = data[i].model;
                tmpl_data.push(view_data);
                item[view_data.car_id] = data[i];
            }
            console.log(tmpl_data);

            var tpl = Handlebars.compile(t('#carinfo_list_tpl').text());
            t('body').prepend(tpl(tmpl_data));
            t('.fixed-width-content').css('width', (640 - 30 - 70 - 30 - 30) + 'px');

            t('.carinfo-btn').click(function () {
                var car = item[t(this).attr('data-rel')];
                yangaiche(sys.local_storage).set('car_info_m', car);

                yangaiche(ls.back.set_back_to_self)('car_choose4.html?update=true');
            });

            t('.delete-btn').click(function () {
                yangaiche(app.http.post_request)('/v1/api/cars/delete', [t(this).attr('data-rel')], function () {
                    yangaiche(sys.local_storage).remove(key.car.info);

                    window.location.reload();
                });
            });

            function gen_set_top_fn() {
                var top = 1;
                return function (i, btn) {
                    t(btn).css('top', (top + i * 120) + 'px');
                }
            }

            t.each(t('.carinfo-btn'), gen_set_top_fn());
            t.each(t('.delete-btn'), gen_set_top_fn());

            yangaiche(app.swiper.show)('.carinfo', '.carinfo-btn', '/v1/api/cars/delete');

            t('.my-list > li:last-child').click(function () {
                yangaiche(ls.back.set_back_to_self)('car_choose.html');
            });

            progress.done();
        });
    });

}());