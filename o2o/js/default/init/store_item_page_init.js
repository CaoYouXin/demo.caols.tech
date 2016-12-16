;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('products');
    yangaiche(sys.load_default_module)('paging');
    yangaiche(sys.load_default_module)('format');
    yangaiche(sys.load_default_module)('obj_util');
    yangaiche(sys.load_default_module)('unique_service_type');
    yangaiche(sys.load_default_module)('back');

    if (/=42$/.test(window.location.href)) {
        yangaiche(sys.load_default_module)('supplier');
    } else {
        yangaiche(sys.load_module)('supplier');
    }

    yangaiche(sys.load_module)('set_activity_peer_source');

    yangaiche(sys.init)(function (t) {

        if (/=50$/.test(window.location.href)) {
            yangaiche(ls.user.touch)();
            yangaiche(app.http.get_request)('/v1/api/pass_card/exchange_check?code=wei_ka_voucher', function () {
            }, function () {
                yangaiche(ls.back.set_back_to_self)('activities/pubhtml/activity399v2.html');
            });
        }

        var device_width = t(window).width();

        var getReq = yangaiche(app.http.get_request),
            show_msg = yangaiche(app.show_msg.show),
            storage = yangaiche(sys.local_storage),
            get_unique_service_type = yangaiche(app.unique_service_type.get);

        function load_comments(store_item) {
            var product_ids = '';
            t.each(store_item.ware_products, function (i, wp) {
                if (i !== 0) {
                    product_ids += ',';
                }
                product_ids += wp.product_id;
            });

            getReq('/v2/api/order/service_comment/page_list.json?product_ids=' + product_ids + '&page=1&page_size=1', function (data) {
                t('#store-item-comment-link').html('用户评价 ( ' + data.total_size + ' )');
                t('#store-item-comment-link').click(function () {
                    yangaiche(ls.back.set_back_to_self)('comments_list.html?product_ids='+product_ids);
                });
            }, function (error) {
                show_msg(error.message || JSON.stringify(error));
            });
        }

        function init(suppliers, service_products) {
            storage.set(key.service.data, service_products);
            storage.set(key.service.can_self, service_products.length > 0);
            if (service_products.length <= 1) {
                t('#my-btn-group .selectable[data-key="self"]').css('display', 'none');
            }

            t.each(service_products, function (i, service_product) {
                service_product.total_price = yangaiche(ls.products.calculate_single)(service_product).toFixed(1);
                t('#my-btn-group .selectable[data-key=' + service_product.service_type + '] .text').html(service_product.product_name + '(¥' + service_product.total_price + ')');
            });

            t('#my-btn-group').on('click', '.selectable', function () {
                var $this = t(this);
                var group_p = $this.parents()[0];
                var local_key = $this.attr('data-key');
                var selected_key = t(group_p).attr('data-key');
                if (local_key === selected_key) {
                    return false;
                }

                t(group_p).attr('data-key', local_key);
                storage.set(get_unique_service_type(), $this.attr('data-key'));
                t('#store-item-service-type .service-type-text').text($this.children('.text').html());

                var products = yangaiche(ls.products.touch)();
                var mutable_products = yangaiche(app.obj_util.copy)(products);
                t.each(service_products, function (i, service_product) {
                    if (service_product.service_type === local_key) {
                        mutable_products.push(service_product);
                    }
                });

                t('.store-item-u-price').text(yangaiche(ls.products.calculate)(mutable_products));

                t(group_p).find('.selectable').removeClass('selected');
                $this.addClass('selected');
            });

            var config = suppliers.length > 0 ? '&supplier_id=' + suppliers[0].supplier_id : '';
            getReq('/v2/api/store/ware/detail.json?ware_id=' + yangaiche(app.url_parameter).ware_id + config, function (store_item) {

                t.each(store_item.ware_products, function (i, wp) {
                    wp.price = wp.total_price = wp.product_price;
                    wp.product_type = wp.product_id;
                    wp.unit_count = 1;
                    wp.labour_price = 0;
                });
                yangaiche(ls.products.set)(store_item.ware_products);

                store_item.cover_img.raw_url = store_item.cover_img.raw_url + '?imageView2/3/w/' + parseInt(device_width) + '/h/' + parseInt(device_width / 16 * 9) + '/interlace/1';
                store_item.supplier_name = suppliers.length > 0 ? suppliers[0].supplier_name : '养爱车综合店';
                store_item.ware_mark_price = store_item.ware_mark_price.toFixed(1);
                store_item.ware_full_price = store_item.ware_full_price.toFixed(1);

                var tpl = Handlebars.compile(t('#store_item_page_tpl').text());
                t('#cover-info-wrapper').html(tpl(store_item));

                t.each(store_item.introduction_imgs, function (i, img) {
                    img.raw_url = img.raw_url + '?imageView2/3/w/' + parseInt(device_width) + '/h/' + parseInt(device_width / 16 * 9) + '/interlace/1';
                });

                tpl = Handlebars.compile(t('#store_item_detail_tpl').text());
                t('#store-item-details').html(tpl(store_item));

                t('#item_title').text(store_item.ware_name);

                load_comments(store_item);

                t('#store-item-footer .submit').click(function () {
                    if (!yangaiche(sys.exist)(store_item)) {
                        return true;
                    }

                    var storage = yangaiche(sys.local_storage);
                    var car = storage.get(key.car.info);
                    if (!yangaiche(sys.exist)(car)) {
                        yangaiche(app.show_msg.show)('请先选车');
                        return false;
                    }

                    yangaiche(ls.order.update)(function (order) {
                        order.car_id = car.car_id;
                        order.car_model_type = car.car_model_type;
                        order.car_number = car.car_number;

                        if ('洗车打蜡' === store_item.ware_name) {
                            yangaiche(app.set_activity_peer_source)(order);
                        }

                        order.service_type = t('#my-btn-group .selectable.selected').attr('data-key');
                        order[ls.products.products_info] = order[ls.products.products_info] || [];
                        t.each(service_products, function (i, service_product) {
                            if (service_product.service_type === order.service_type) {
                                order[ls.products.products_info].push(service_product);
                            }
                        });
                    });

                    storage.set(key.submit_button.submit_text_key, key.submit_button.submit_text_value1);
                    storage.set(key.shequbanjin.is_butler_pick, false);

                    yangaiche(ls.back.set_back_to_self)('order_settle.html');
                });

                var service_type = storage.get(get_unique_service_type((suppliers.length > 0 ? suppliers[0].supplier_name : '') + yangaiche(app.url_parameter).ware_id));
                if (yangaiche(sys.exist)(service_type)) {
                    var btn = t('#my-btn-group .selectable[data-key="' + service_type + '"]');
                    if (btn.css('display') === 'none') {
                        t('#my-btn-group .selectable[data-key="keeper"]').click();
                    } else {
                        btn.click();
                    }
                } else {
                    var self_btn = t('#my-btn-group .selectable[data-key="self"]');
                    if (self_btn.css('display') === 'none') {
                        t('#my-btn-group .selectable[data-key="keeper"]').click();
                    } else {
                        self_btn.click();
                    }
                }
            }, function (error) {
                show_msg(error.message || JSON.stringify(error));
            });
        }

        yangaiche(app.supplier.init)(init, yangaiche(app.url_parameter).ware_id);

        t('#store-item-car-choose').click(function () {
            yangaiche(sys.local_storage).remove(key.goto.car_list);
            yangaiche(ls.back.set_back_to_self)('car_list.html');
        });
        
        t('#store-item-service-type').click(function () {
            var storage = yangaiche(sys.local_storage);
            var car = storage.get(key.car.info);
            if (!yangaiche(sys.exist)(car)) {
                yangaiche(app.show_msg.show)('请先选车');
                return false;
            }

            t('#popup').css('display', 'block');

            window.top.lockScroll();
        });

        t('.store-item-cover').click(function () {
            t('#popup').css('display', 'none');

            window.top.unlockScroll();
        });

        var car_info = storage.get(key.car.info);
        if (yangaiche(sys.exist)(car_info)) {
            t('#store-item-car-choose .car-info-text').text(car_info.car_number);
            //var short_model = car_info.model.length > 10 ? car_info.model.substr(0, 10) + '...' : car_info.model;
            t('#car_model').text(car_info.car_number);
        }

    });

}());