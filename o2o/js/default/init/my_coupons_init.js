;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('duplicate_submission');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {
        var getReq = yangaiche(app.http.get_request),
            postReq = yangaiche(app.http.post_request),
            show_msg = yangaiche(app.show_msg.show),
            disable_button = yangaiche(app.ds.disable_button),
            reset_button = yangaiche(app.ds.reset_button),
            user = yangaiche(ls.user.touch)(),
            set_back_to_his = yangaiche(ls.back.set_back_to_his),
            get_parent_of_this = yangaiche(ls.back.get_parent_of_this),
            updateOrder = yangaiche(ls.order.set);

        function load_coupons() {
            getReq('/v1/api/coupons?user_id=' + user[ls.user.user_id], function (data) {
                console.log(data);
                var coupon_id = yangaiche(ls.order.touch)().coupon_id;
                t.each(data, function (i, coupon) {
                    if (coupon.id === coupon_id) {
                        coupon.selected = true;
                    }
                    if ('未使用' === coupon.status) {
                        if (coupon.value < 50) {
                            coupon.bg_img = 'http://baseimg.yangaiche.com/couponsbackground3.png';
                        } else if (coupon.value < 100) {
                            coupon.bg_img = 'http://baseimg.yangaiche.com/couponsbackground2.png';
                        } else {
                            coupon.bg_img = 'http://baseimg.yangaiche.com/couponsbackground1.png';
                        }
                        coupon.used = 'false';
                    } else {
                        coupon.bg_img = 'http://baseimg.yangaiche.com/couponsbackground4.png';
                        coupon.used = 'true';
                    }
                    coupon.expired_time = coupon.expired_time.substr(0, coupon.expired_time.indexOf('T'));
                    if (coupon.show_money) {
                        coupon.showvalue = {value: coupon.value};
                    }
                });

                var tpl = Handlebars.compile(t('#coupons_list_tpl').text());
                t('#coupons').empty().html(tpl(data));

                var can_select = yangaiche(app.url_parameter).can_select;
                t('.coupon-btn').click(function () {
                    if (yangaiche(sys.exist)(can_select) && can_select && 'false' === t(this).attr('data-used')) {
                        var order = yangaiche(ls.order.touch)();
                        var seleted_id = parseInt(t(this).attr('data-id'));
                        if (order.coupon_id === seleted_id) {
                            order.coupon_id = null;
                            order.coupon_name = null;
                            order.coupon_value = 0;
                            updateOrder(order);
                            window.history.back();
                        } else {
                            var coupon_name = t(this).attr('data-name');
                            var coupon_type = t(this).attr('data-type');
                            postReq('/v1/api/order_preview', {
                                car_model_type: order.car_model_type,
                                coupon_id: seleted_id,
                                products: order.products,
                                user_id: user[ls.user.user_id]
                            }, function (data) {
                                order.coupon_id = seleted_id;
                                order.coupon_name = coupon_name;
                                order.coupon_type = coupon_type;
                                order.coupon_price = data.free_price;
                                order.paid_price = 0;
                                order.not_paid_price = data.total_price;
                                updateOrder(order);
                                window.history.back();
                            }, function (error) {
                                show_msg(error.message);
                            });
                        }
                    }
                });

                t('#coupon_number').val('');
            });
        }

        load_coupons();

        t('#coupon_convert').click(function () {
            disable_button('#coupon_convert');
            var code = t('#coupon_number').val();
            if (!code) {
                show_msg('请输入正确的兑换码');
                reset_button('#coupon_convert');
            }

            postReq('/v1/api/coupons/conversion', {
                user_id: user[ls.user.user_id],
                coupons: [{code: code}]
            }, function () {
                load_coupons();
                reset_button('#coupon_convert');
            }, function (error) {
                show_msg(error.message);
                reset_button('#coupon_convert');
            });
        });
    });
}());