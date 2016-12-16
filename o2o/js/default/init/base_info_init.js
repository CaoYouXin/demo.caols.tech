;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('form');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('duplicate_submission');
    yangaiche(sys.load_default_module)('back');

    yangaiche(sys.init)(function (t) {
        t('#contact_name').bind('mouseup', function (event) {
            event.preventDefault();
        });
        t('#phone_number').bind('mouseup', function (event) {
            event.preventDefault();
        });
        t('#address').bind('mouseup', function (event) {
            event.preventDefault();
        });
        t('#pick_time_info').bind('click', function () {
            var prevent_default = function () {
                t('#pick_time_info').focus();
            };
            t('#phone_number').bind('focus', prevent_default);
            t('#address').bind('focus', prevent_default);
            setTimeout(function () {
                t('#phone_number').unbind('focus', prevent_default);
                t('#address').unbind('focus', prevent_default);
            }, 1000);
        });

        t('#my-btn-group').on('click', 'button', function () {
            var group_p = t(this).parents()[0];
            var local_rel = t(this).attr('data-rel');
            var selected_rel = t(group_p).attr('data-rel');
            if (local_rel === selected_rel) {
                return;
            }

            t(group_p).attr('data-rel', local_rel);
            t('input[name="pay_mode"]').val(local_rel);

            t(group_p).find('button').removeClass('baseinfo-pay-chosen');
            t(group_p).find('button').addClass('baseinfo-pay-chosen-not');

            t(this).removeClass('baseinfo-pay-chosen-not');
            t(this).addClass('baseinfo-pay-chosen');
        });

        var save_from_data = function () {
            var obj = yangaiche(app.form.to_obj)('#base_info_form');
            yangaiche(ls.order.form_obj)(obj);
        };

        var set_order = yangaiche(ls.order.set),
            show_msg = yangaiche(app.show_msg.show),
            postReq = yangaiche(app.http.post_request),
            getReq = yangaiche(app.http.get_request),
            disable_button = yangaiche(app.ds.disable_button),
            reset_button = yangaiche(app.ds.reset_button);

        var submitText = yangaiche(sys.local_storage).get(key.submit_button.submit_text_key);
        t('#submit_button').html(submitText);
        disable_button('#submit_button');

        var user = yangaiche(ls.user.touch)();

        function preview_order(order, go_flag) {
            var params = {
                car_model_type: order.car_model_type,
                coupon_id: order.coupon_id,
                products: order.products,
                user_id: user[ls.user.user_id]
            };
            if (yangaiche(sys.exist)(order.supplier_id)) {
                params.supplier_id = order.supplier_id;
            }
            postReq('/v1/api/order_preview', params, function (data) {
                order.coupon_price = data.free_price;
                order.paid_price = 0;
                order.not_paid_price = data.total_price;
                set_order(order);

                if (yangaiche(sys.exist)(go_flag)) {
                    yangaiche(ls.back.set_back_to_self)('order_info.html');
                }
            }, function (error) {
                order.coupon_id = null;
                set_order(order);
                show_msg(error.message || error);
            });
        }

        t('#submit_button').click(function () {
            var contact_name = t('#contact_name').val();
            if (!contact_name) {
                show_msg('请输入姓名!');
                return;
            }

            var phone_number = t('#phone_number').val();
            if (!phone_number) {
                show_msg('请输入电话号码!');
                return;
            }

            var address = t('#address').val();
            if (!address) {
                show_msg('请输入地址!');
                return;
            }

            save_from_data();

            var order = yangaiche(ls.order.touch)();
            if (1 !== order.pay_mode && yangaiche(sys.exist)(order.coupon_id)) {
                show_msg('只有在线支付可以享受优惠券哦');
                return;
            }

            if (key.submit_button.submit_text_value1 === submitText) {
                preview_order(order, {});
            } else {
                disable_button('#submit_button');
                order.user_id = user.user_id;
                order.peer_source = order.peer_source || yangaiche(sys.browser_type).type;
                order.total_price = null;

                postReq('/v2/api/order/create.json', order, function (order_data) {
                    set_order(order_data);
                    yangaiche(ls.back.set_back_to_store)('order_success.html');
                }, function (error) {
                    reset_button('#submit_button');
                    show_msg('下单失败:' + (error.message || error));
                });
            }
        });

        t('#go_to_map').click(function () {
            save_from_data();
            yangaiche(ls.back.set_back_to_self)('my_address_manage.html');
        });

        function handle_time_segments(data) {
            if (data.length <= 0) {
                show_msg('接车区域管家繁忙，请您输入其他地址或稍后再试');
                return;
            }

            var time_data = [];

            for (var a = 0; a < data.length; a++) {
                for (var b = 0; b < data[a].data.length; b++) {
                    var item = {};
                    item.pick_time = data[a].key;
                    item.index = time_data.length;
                    item.pick_time_segment = data[a].data[b];
                    item.infos = item.pick_time + '</br>' + item.pick_time_segment;
                    time_data.push(item);
                }
            }
            var template = Handlebars.compile(t('#take_time_tpl').html());
            t('#pick_time_info').html(template(time_data));

            var selectApicktime = function () {
                if (time_data.length > 0) {
                    var item = time_data[t('#pick_time_info').val()];
                    t('#pick_time').val(item.pick_time);
                    t('#pick_time_segment').val(item.pick_time_segment);
                    save_from_data();
                }
            };
            selectApicktime();
            t('#pick_time_info').unbind('change').change(selectApicktime);

            reset_button('#submit_button');
        }

        function set_activity_time_segments(address_info) {
            getReq('/v1/api/activity/time_segments?longitude=' + address_info.longitude + '&latitude=' + address_info.latitude, function (data) {
                handle_time_segments(data);
            }, function (error) {
                show_msg(error.message || error);
            });
        }

        var auto_get_location = function (order) {
            disable_button('#submit_button');

            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (e) {
                if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                    // 定位成功事件
                    var address = '';
                    yangaiche(ls.location.update)(function (location_info) {
                        address += e.address.city ? e.address.city : '';
                        address += e.address.district ? e.address.district : '';
                        address += e.address.street ? e.address.street : '';
                        address += e.address.streetNumber ? e.address.streetNumber : '';
                        location_info.name = e.address.city ? e.address.city : '';
                        location_info.address = address;
                        location_info.latitude = e.point.lat;
                        location_info.longitude = e.point.lng;
                        location_info.point = e.point;
                        if (/activity/.test(order.peer_source)) {
                            set_activity_time_segments(location_info);
                        }
                    });
                    t('#address').attr('placeholder', '限北京地区，请输入...');
                    t('#address').val(address);
                    reset_button('#submit_button');
                } else {
                    // 定位失败事件
                    show_msg(e.message);
                    t('#address').attr('placeholder', '定位失败');
                    reset_button('#submit_button');
                }
            }, {enableHighAccuracy: true});
        };

        var order_to_form = function (order) {
            // order to form
            yangaiche(app.form.from_obj)(order);

            if (!t('#phone_number').val()) {
                t('#phone_number').val(user[ls.user.user_phone]);
            }

            if (!t('#contact_name').val()) {
                var user_real_name = yangaiche(sys.local_storage).get(ls.openid.user_real_name);
                if (user[ls.user.user_name] && user[ls.user.user_name] !== '') {
                    t('#contact_name').val(user.name);
                } else if (yangaiche(sys.exist)(user_real_name)) {
                    t('#contact_name').val(user_real_name);
                }
            }

            var address_info = yangaiche(ls.location.touch)(), exist = yangaiche(sys.exist);
            if ((!exist(address_info.name) || address_info.name === '') &&
                (!exist(address_info.address) || address_info.address === '') ||
                !exist(address_info.latitude) ||
                !exist(address_info.longitude)) {
                auto_get_location(order);
            } else {
                t('#address').attr('placeholder', '限北京地区，请输入...');
                if ('' !== address_info.address) {
                    t('#address').val(address_info.address.replace(/(^\s*)|(\s*$)/g, ''));
                } else {
                    t('#address').val(address_info.name.replace(/(^\s*)|(\s*$)/g, ''));
                }

                if (/activity/.test(order.peer_source)) {
                    set_activity_time_segments(address_info);
                }
            }

            if (exist(order.coupon_id)) {
                t('#use_coupon').children('div').html(order.coupon_name);
            } else {
                getReq('/v1/api/coupons?user_id=' + user.user_id, function (data) {
                    var len = 0;
                    t.each(data, function (i, coupon) {
                        if ('未使用' === coupon.status) {
                            len += 1;
                        }
                    });

                    t('#use_coupon').children('div').html(len + '张可用');
                });
                order.coupon_id = null;
                order.coupon_value = 0;
                set_order(order);
            }

            preview_order(order);
        };

        var order_touch = yangaiche(ls.order.touch)();
        if (!/activity/.test(order_touch.peer_source)) {
            //获取接车时间（普通单）
            getReq('/v1/api/time_segments.json?service_type=keeper', function (data) {
                handle_time_segments(data);
                order_to_form(order_touch);
            }, function (error) {
                show_msg(error.message || error);
            });
        } else {
            order_to_form(order_touch);
        }

        t('#use_coupon').click(function () {
            yangaiche(ls.back.set_back_to_self)('my_coupons.html?can_select=true');
        });
    });
}());