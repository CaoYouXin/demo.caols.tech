;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('swiper');
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('back');

    yangaiche(sys.init)(function (t) {
        var progress = $.AMUI.progress;
        progress.start();
        progress.inc(0.5);
        t('#nprogress .nprogress-bar').css('bottom', 'auto');
        t('#nprogress .nprogress-bar').css('top', '0');

        yangaiche(app.http.get_request)('/v1/api/addresses?user_id=' + yangaiche(ls.user.touch)().user_id, function (data) {

            var tpl = Handlebars.compile(t('#address_list_tpl').text());
            t('body').prepend(tpl(data));

            t('.address-btn').click(function () {
                var $this = t(this);
                yangaiche(ls.location.update)(function (location_info) {
                    location_info.longitude = $this.attr('data-longitude');
                    location_info.latitude = $this.attr('data-latitude');
                    location_info.name = $this.children('.address-manager-clickable-text').text().replace(/(^\s*)|(\s*$)/g, '');
                    location_info.address = $this.children('.address-manager-clickable-subtext').text().replace(/(^\s*)|(\s*$)/g, '');
                });
                yangaiche(ls.back.set_back_to_his)(yangaiche(ls.back.get_parent_of_this)());
            });

            t('.address-manager-clickable-img').click(function () {
                var $this = t(this).parent('.address-btn');
                yangaiche(ls.location.update)(function (location_info) {
                    location_info.id = $this.attr('data-id');
                    location_info.longitude = $this.attr('data-longitude');
                    location_info.latitude = $this.attr('data-latitude');
                    location_info.name = $this.children('.address-manager-clickable-text').text().replace(/(^\s*)|(\s*$)/g, '');
                    location_info.address = $this.children('.address-manager-clickable-subtext').text().replace(/(^\s*)|(\s*$)/g, '');
                });
                yangaiche(ls.back.set_back_to_self)('get_address_editor.html');
                return false;
            });

            t('.delete-btn').click(function () {
                yangaiche(app.http.post_request)('/v1/api/addresses/delete', [t(this).attr('data-rel')], function () {
                    window.location.reload();
                });
            });

            function get_set_top_fn() {
                var top = 1;
                return function (i, btn) {
                    t(btn).css('top', (top + i * 120) + 'px');
                }
            }

            t.each(t('.address-btn'), get_set_top_fn());
            t.each(t('.delete-btn'), get_set_top_fn());

            yangaiche(app.swiper.show)('.address', '.address-btn', '/v1/api/addresses/delete');

            t('.add-address-btn').click(function () {
                yangaiche(ls.back.set_back_to_self)('get_address_editor.html?add=true');
            });

            progress.done();
        });
    });
}());