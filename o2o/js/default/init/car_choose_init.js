;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
	yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('show_msg');

    yangaiche(sys.init)(function (t) {
        yangaiche(app.http.get_request)('/v1/api/meta_brands/section', function (data) {
            var mydata = [], it, brand_img = {};
            t.each(data, function (i, o) {
                if (o.section) {
                    it = {section: o.section};
                    mydata.push(it);
                } else {
                    it.main = it.main || [];
                    it.main.push(o);
                    brand_img[o.brand_type] = o.img_url;
                }
            });
            yangaiche(sys.local_storage).set('brand2img', brand_img);

            var tpl = Handlebars.compile(t('#brand_list_tpl').text());
            t('#scroller').prepend(tpl(mydata));
            t('.my-list-item-hd').css('width', (640 - 30 - 70 - 30) + 'px');

        }, function (error) {
            yangaiche(app.show_msg.show)('请求服务器错误，' + (error.message || error));
        });
    });

}());