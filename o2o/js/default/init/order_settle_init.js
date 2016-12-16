;(function () {
    'use strict';

    yangaiche(sys.load_module)('order/create');
    yangaiche(sys.load_module)('order/get_payment_order_id');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('obj_util');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('products');
    yangaiche(sys.load_default_module)('unique_service_type');
    yangaiche(sys.load_default_module)('pay');
    yangaiche(sys.load_default_module)('map');
    yangaiche(sys.load_default_module)('duplicate_submission');
    //yangaiche(sys.load_lib_module)('');

    yangaiche(sys.init)(function (t) {

        var getReq = yangaiche(app.http.get_request),
            postReq = yangaiche(app.http.post_request),
            user = yangaiche(ls.user.touch)(),
            exist = yangaiche(sys.exist),
            storage = yangaiche(sys.local_storage),
            get_order = yangaiche(ls.order.touch),
            set_order = yangaiche(ls.order.set),
            show_msg = yangaiche(app.show_msg.show),
            address_info = yangaiche(ls.location.touch)(),
            preview_order = yangaiche(ls.order.preview);

        getReq('/v1/api/time_segments.json', function (data) {

            var tpl = Handlebars.compile('{{#each this}}<div class="swiper-slide"><div class="text">{{key}}</div></div>{{/each}}');
            var tpl2 = Handlebars.compile('{{#each this}}<div class="swiper-slide"><div class="text">{{this}}</div></div>{{/each}}');
            t('.swiper-container-day .swiper-wrapper').html(tpl(data));

            var swiper1, swiper2;
            t('#pick_time').click(function () {
                t('#popup').css('display', 'block');

                var opts = {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    slidesPerColumnFill: 'row',
                    scrollbarHide: true,
                    centeredSlides: false,
                    spaceBetween: 0,
                    grabCursor: true,
                    freeMode: true,
                    observer: true
                };
                swiper1 = swiper1 || new Swiper('.swiper-container-day', opts);
                swiper2 = swiper2 || new Swiper('.swiper-container-time', opts);
            });

            t('.swiper-container-day').on('click', '.swiper-slide', function () {
                var $this = t(this);
                t.each(data, function (i, d) {
                    if (d.key === $this.children('.text').html()) {
                        t('.swiper-container-day').attr('data-rel', d.key);
                        t('.swiper-container-time .swiper-wrapper').html(tpl2(d.data));
                    }
                });

                t('.swiper-container-day .swiper-slide').removeClass('selected');
                $this.addClass('selected');
            });

            t('.swiper-container-time').on('click', '.swiper-slide', function () {
                var $this = t(this);
                var pick_time_segment = $this.children('.text').html();
                t('#pick_time .value').html(t('.swiper-container-day').attr('data-rel') + ' ' + pick_time_segment);
                t('.swiper-container-time').attr('data-rel', pick_time_segment);

                t('.swiper-container-time .swiper-slide').removeClass('selected');
                $this.addClass('selected');

                t('#popup .cover').click();
            });

            t('.swiper-container-day .swiper-slide:first-child').click();
            t('.swiper-container-time .swiper-slide:first-child').click();

            t('#popup .cover').click(function () {
                t('#popup').css('display', 'none');
            });
        }, function (error) {
            show_msg(error.message || JSON.stringify(error));
        });

        var service_products = storage.get(key.service.data);
        if (service_products.length === 0) {
            t('#service_types').addClass('invisible');
        }
        t.each(service_products, function (i, service_product) {
            service_product.total_price = yangaiche(ls.products.calculate_single)(service_product).toFixed(1);
            t('#service_types .selectable[data-key="' + service_product.service_type + '"] .text').html(service_product.product_name + '(¥' + service_product.total_price + ')');
            t('#service_types .selectable[data-key="' + service_product.service_type + '"]').removeClass('invisible');
        });

        var $service_types = t('#service_types');
        $service_types.on('click', '.selectable:not(.invisible)', function () {
            var $this = t(this);
            var service_type = $this.attr('data-key');
            var old_service_type = $service_types.attr('data-key');
            if (service_type === old_service_type) {
                return false;
            }
            $service_types.attr('data-key', service_type);

            var is_self = service_type === 'self';
            var fn_name = is_self ? 'addClass' : 'removeClass';
            t('#address')[fn_name]('invisible');
            t('#pick_time')[fn_name]('invisible');

            t('#service_types .selectable').removeClass('selected');
            $this.addClass('selected');

            yangaiche(ls.products.update)(function (products) {
                var already_has = false;
                var filtered = products.filter(function (product) {
                    already_has = already_has ? true : product.service_type === service_type;
                    return !Boolean(product.service_type) || product.service_type !== old_service_type;
                });

                if (!already_has) {
                    t.each(service_products, function (i, service_product) {
                        if (service_product.service_type === service_type) {
                            filtered.push(service_product);
                        }
                    });
                }

                filtered.splice(0, 0, 0, products.length);
                [].splice.apply(products, filtered);
            });

            preview_order(get_order(), preview_order_cb);
        });

        function preview_order_cb() {
            var order = get_order();
            t('#order_settle_footer .price .value').html(order.not_paid_price);
            t('#order_settle_footer .coupon .value').html(order.coupon_price);
        }

        var service_type = yangaiche(sys.local_storage).get(yangaiche(app.unique_service_type.get)());
        t('#service_types .selectable[data-key="' + service_type + '"]').click();

        var order = get_order();
        if (exist(order.coupon_id)) {
            t('#coupon .value').html(order.coupon_name);
        } else {
            getReq('/v1/api/coupons?user_id=' + user.user_id, function (data) {
                var len = 0;
                t.each(data, function (i, coupon) {
                    if ('未使用' === coupon.status) {
                        len += 1;
                    }
                });

                t('#coupon .value').html(len + '张可用');
            });
            order.coupon_id = null;
            order.coupon_value = 0;
            set_order(order);
        }
        preview_order(order, preview_order_cb);

        if (!t('#comment input').val()) {
            t('#comment input').val(order.comment);
        }

        if (!t('#phone_number input').val()) {
            t('#phone_number input').val(user[ls.user.user_phone]);
        }

        if (!t('#contact_name input').val()) {
            var user_real_name = yangaiche(sys.local_storage).get(ls.openid.user_real_name);
            if (user[ls.user.user_name] && user[ls.user.user_name] !== '') {
                t('#contact_name input').val(user.name);
            } else if (yangaiche(sys.exist)(user_real_name)) {
                t('#contact_name input').val(user_real_name);
            }
        }

        if ((!exist(address_info.name) || address_info.name === '') &&
            (!exist(address_info.address) || address_info.address === '') || !exist(address_info.latitude) || !exist(address_info.longitude)) {
            yangaiche(app.map.auto_location)(function (address) {
                t('#address .value').text(address);
            });
        } else {
            t('#address .value').html(address_info.name + address_info.address);
        }

        yangaiche(sys.load_module)('show_payment');

        var $payment = t('#payment');
        $payment.on('click', '.selectable', function () {
            var $this = t(this);
            $payment.attr('data-pay-way', $this.attr('data-pay-way'));
            $payment.attr('data-pay-mode', $this.attr('data-pay-mode'));

            t('#payment .selectable').removeClass('selected');
            $this.addClass('selected');
        });

        t('#payment .selectable:not(.invisible)').eq(0).click();

        t('#address').click(function () {
            yangaiche(ls.back.set_back_to_self)('my_address_manage.html');
        });

        t('#coupon').click(function () {
            yangaiche(ls.back.set_back_to_self)('my_coupons.html?can_select=true');
        });

        function create_order() {
            var order = {},
                order_data = get_order(),
                car = storage.get(key.car.info),
                user = yangaiche(ls.user.touch)(),
                location = yangaiche(ls.location.touch)();

            order.supplier_id = order_data.supplier_id;
            order.service_type = service_type;
            order.pick_time = t('.swiper-container-day').attr('data-rel');
            order.pick_time_segment = t('.swiper-container-time').attr('data-rel');

            order.comment = t('#comment input').val();
            order.contact_name = t('#contact_name input').val();
            order.phone_number = t('#phone_number input').val();
            order.car_id = car.car_id;
            order.car_number = car.car_number;

            order.pay_mode = parseInt(t('#payment').attr('data-pay-mode'));

            order.user_id = user.user_id;
            order.peer_source = order.peer_source || yangaiche(sys.browser_type).type;
            order.client_basic = {
                name: order.contact_name,
                phone_number: order.phone_number,
                car_number: order.car_number,
                location: location
            };
            order.location = location;
            order[ls.products.products_info] = yangaiche(ls.products.touch)();
            order.order_status_key = 'creating';

            yangaiche(app.ds.disable_button)('#submit_button');

            postReq(yangaiche(app.order_create.get_api), order, function (data) {

                if (data.pay_status !== 1 && data.not_paid_price > 0 && order.pay_mode === 1) {//返回的pay_mode都是1,无奈额.
                    yangaiche(app.order_get_payment_order_id.get_id)(data.id, function (real_order_id) {
                        var param = yangaiche(app.pay.get_param)({order_id: real_order_id},
                            'order_success_v2.html?order_id=' + data.id,
                            'order_success_v2.html?order_id=' + data.id);

                        yangaiche(app.pay.do)(param, function () {
                            yangaiche(app.ds.reset_button)('#submit_button');
                        }, null, function () {
                            yangaiche(ls.back.set_back_to_store)('order_success_v2.html?order_id=' + data.id);
                        });
                    });
                } else {
                    yangaiche(app.ds.reset_button)('#submit_button');
                    yangaiche(ls.back.set_back_to_store)('order_success_v2.html?order_id=' + data.id);
                }
            }, function (data) {
                yangaiche(app.ds.reset_button)('#submit_button');
                show_msg('下单失败:' + data.message);
            });
        }

        t('#order_settle_footer .submit').click(function () {

            function gen_valid_fn(val_fn_name) {
                return function (input) {
                    var $input = t(input);
                    var pattern = $input.attr('data-reg');
                    var val = $input[val_fn_name]();

                    var invalid = !(pattern ? new RegExp(pattern).test(val) : Boolean(val));

                    if (invalid) {
                        show_msg($input.attr('data-reg-msg'));
                    }

                    return invalid;
                };
            }

            var is_any_input_invalid = Array.from(t('#baseinfo input')).some(gen_valid_fn('val'))
                ? true
                : Array.from(t('#baseinfo .line:not(.invisible) .value')).some(gen_valid_fn('html'));

            if (is_any_input_invalid) {
                return false;
            }

            if (t('#service_types').attr('data-key') === 'keeper') {
                yangaiche(app.show_msg.show_agreement)(order.car_number, create_order);
            } else {
                create_order();
            }
        });

    });
}());