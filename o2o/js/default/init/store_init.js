;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('map');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('env');
    yangaiche(sys.load_default_module)('supplier');
    yangaiche(sys.load_default_module)('bigpipe/pipe_able');

    yangaiche(sys.init)(function (t) {

        t('#home-page-wrapper').css('display', 'block');

        if (yangaiche(sys.browser_type).type !== 'h5_hybrid') {
            t('#location').css('display', 'block');
            t('#to_show_user_win').css('display', 'block');
        }

        //var raw_data = '{"code":"00000","data":[{"ware_list":[{"product_name":"机油-磁护","ware_mark_price":94.5,"ware_status":"down_shelves","ware_full_price":3232,"ware_type_name":"室内清洗","cover_img":{"img_id":1052,"thumbnail_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg/s250.jpg","img_index":0,"original_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg/s1024.jpg","raw_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg"},"ware_id":1,"ware_name":"室内清洗"}],"ware_type_name":"室内清洗"}]}';
        //var data = JSON.parse(raw_data).data;

        yangaiche(app.http.get_request)('/v2/api/store/banners.json', function (data) {
            t.each(data, function (i, d) {
                var matched = d.image_url.match(/^"(.*)"$/);
                d.image_url = matched ? matched[1] : d.image_url;
            });

            if (data.length > 1) {
                data = {multi: {data: data}};
            } else if (data.length === 1) {
                data = {solo: data[0]};
            } else {
                data = {};
            }

            var tpl = Handlebars.compile(t('#store_banners_tpl').text());
            t('#banner').empty().html(tpl(data));

            t('.am-slider').flexslider({playAfterPaused: 8000});

            t('#banner img').click(function () {
                yangaiche(ls.back.set_back_to_self)(t(t(this).parents()[0]).attr('data-rel'));
            });
        }, function (error) {
            yangaiche(app.show_msg.show)(error.message);
        });

        yangaiche(app.http.get_request)('/v2/api/home/good_suggest/enabled.json', function (data) {
        //yangaiche(app.http.get_request)('/v2/api/home/banners/enabled.json', function (data) {
            var tpl = Handlebars.compile(t('#good_suggest_tpl').text());
            t('#good_suggest').empty().html(tpl(data));

            t('#good_suggest').on('click', 'li', function () {
                yangaiche(ls.back.set_back_to_self)('store_item_page.html?ware_id=' + t(this).attr('data-rel'));
            });
        }, function (error) {
            yangaiche(app.show_msg.show)(error.message);
        });

        yangaiche(app.http.get_request)('/v2/api/store/home_ware_list.json', function (data) {

            var to_move_index = null, to_append_data = null;
            t.each(data, function (i, d) {
                if (d.ware_type_name.match(/线下/)) {
                    to_move_index = i;
                    to_append_data = d;
                }
                t.each(d.ware_list, function (j, wl) {
                    if (j % 2 === 0) {
                        wl.odd_or_even = 'odd';
                    } else {
                        wl.odd_or_even = 'even';
                    }
                    wl.cover_img.raw_url = wl.cover_img.raw_url + '?imageView2/0/w/330/h/185/interlace/1';
                    if (Math.abs(wl.ware_price_min.toFixed(1) - wl.ware_price_max.toFixed(1)) > 0) {
                        wl.ware_mark_price = wl.ware_price_min.toFixed(1) + '~¥' + wl.ware_price_max.toFixed(1);
                    } else {
                        wl.ware_mark_price = wl.ware_mark_price.toFixed(1);
                    }
                });
            });
            if (yangaiche(sys.exist)(to_move_index) && yangaiche(sys.exist)(to_append_data)) {
                data.splice(to_move_index, 1);
                data.push(to_append_data);
            }

            var tpl = Handlebars.compile(t('#home_store_list_tpl').text());
            t('#home-page-wrapper').append(tpl(data));

            t('.home-page-products li').click(function () {
                var location = yangaiche(ls.location.touch)();
                yangaiche(ls.order.clear)();
                yangaiche(ls.location.set)(location);

                var ware_id = t(this).attr('data-rel');

                yangaiche(ls.back.set_back_to_self)('store_item_page.html?ware_id=' + ware_id);
            });

            if (t('#location').css('display') !== 'none') {
                var location = yangaiche(ls.location.touch)();
                if (!yangaiche(sys.exist)(location.address) || '' === location.address) {
                    yangaiche(app.map.auto_location)(function (address) {
                        t('#location span').text(address);
                    });
                } else {
                    t('#location span').text(location.name + location.address);
                }
            }
        }, function (error) {
            yangaiche(app.show_msg.show)(error.message);
        });

        function reset_phone() {
            var user_phone = yangaiche(ls.user.touch)()[ls.user.user_phone];
            if (11 === user_phone.length) {
                t('#user_phone').html(user_phone.substr(0, 3) + '****' + user_phone.substr(7, 4));
            }
        }

        if (yangaiche(app.url_parameter).back) {
            t('#user-win').offCanvas('open');
            reset_phone();
        }

        t('#to_show_user_win').click(function () {
            reset_phone();
        });

        t('#user-win').on('close.offcanvas.amui', function () {
            window.history.replaceState(null, null, './store.html');
        }).on('open.offcanvas.amui', function () {
            window.history.replaceState(null, null, './store.html?back=true');
        });

        t('#location').click(function () {
            yangaiche(ls.back.set_back_to_self)('my_address_manage.html');
        });

        t('#user-win .menu-info a').click(function () {
            yangaiche(ls.back.set_back_to_self)(t(this).attr('data-rel'));
        });

        t('#services').on('click', 'li', function () {
            var data_rel = t(this).attr('data-rel');
            var matched = data_rel.match(/^tel:.*$/);
            if (matched) {
                window.location.href = data_rel;
            } else {
                yangaiche(ls.back.set_back_to_self)(data_rel);
            }
        });

        t('#user_info').click(function () {
            yangaiche(ls.back.set_back_to_self)('my_info.html');
        });

        yangaiche(app.supplier.simple)(function (suppliers) {
            if (suppliers.length > 0) {
                var times_card_dic = {};
                yangaiche(app.bigpipe.stage)({
                    data_url: '/v2/api/supplier/times_card/list.json/' + suppliers[0].supplier_id,
                    url_method: yangaiche(app.http.get_request),
                    template_url: 'template/times_card_list.html',
                    dom_hook: yangaiche(sys.$)('#times_card_wrapper'),
                    hook: {
                        pre: function (data) {
                            if (data.length <= 0) {
                                return null;
                            }

                            t.each(data, function (i, d) {
                                if (i % 2 === 0) {
                                    d.odd_or_even = 'odd';
                                } else {
                                    d.odd_or_even = 'even';
                                }
                                d.times_card_amount = d.buy_amount + d.send_amount;
                                times_card_dic[d.times_card_product_id] = d;
                            });
                            return {yac: {array: data}};
                        },
                        post: function () {
                            var list = t('.times_card_products');
                            list.find('li').click(function () {
                                yangaiche(sys.local_storage).set(key.supplier.current, suppliers[0]);
                                yangaiche(sys.local_storage).set(key.times_card.current, times_card_dic[t(this).attr('data-rel')]);
                                yangaiche(ls.back.set_back_to_self)('times_card_page.html');
                            });
                        }
                    }
                }, true);
            }
        });

        //t('#footer_close').click(function(e) {
        //    t('#footer').css('display', 'none');
        //});
    });
}());