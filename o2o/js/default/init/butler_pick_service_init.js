;(function () {

    'use strict';

    yangaiche(sys.load_default_module)('swiper_line');
    yangaiche(sys.load_default_module)('template');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('products');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('supplier');
    yangaiche(sys.load_default_module)('obj_util');
    yangaiche(sys.load_default_module)('unique_service_type');

	yangaiche(sys.init)(function (t) {

        var getReq = yangaiche(app.http.get_request),
            show_msg = yangaiche(app.show_msg.show),
            storage = yangaiche(sys.local_storage),
            get_unique_service_type = yangaiche(app.unique_service_type.get),
            get_order = yangaiche(ls.order.touch),
            calculate = yangaiche(ls.products.calculate);

        function load_comments() {
            var product_ids = '';
            t.each(yangaiche(ls.products.touch)(), function (i, wp) {
                if (i !== 0) {
                    product_ids += ',';
                }
                product_ids += wp.product_type;
            });

            getReq('/v2/api/order/service_comment/page_list.json?product_ids=' + product_ids + '&page=1&page_size=1', function (data) {
                t('#store-item-comment-link').html('用户评价 ( ' + data.total_size + ' )');
                t('#store-item-comment-link').click(function (e) {
                    e.preventDefault();
                    yangaiche(ls.back.set_back_to_self)('comments_list.html?product_ids='+product_ids);
                });
            }, function (error) {
                show_msg(error.message || JSON.stringify(error));
            });
        }

        function init(suppliers, service_products) {
            var tpl = Handlebars.compile(t('#store_item_page_tpl').text());
            t('#cover-info-wrapper').html(tpl({supplier_name: suppliers.length > 0 ? suppliers[0].supplier_name : '养爱车综合店'}));

            t('#store-item-car-choose').click(function () {
                yangaiche(sys.local_storage).remove(key.goto.car_list);
                yangaiche(ls.back.set_back_to_self)('car_list.html');
            });

            t('#store-item-service-type').click(function () {
                var storage = yangaiche(sys.local_storage);
                var car = storage.get(key.car.info);
                if (!yangaiche(sys.exist)(car)) {
                    show_msg('请先选车');
                    return false;
                }

                t('#popup_service_type').css('display', 'block');

                window.top.lockScroll();
            });

            t('#products').click(function () {
                var storage = yangaiche(sys.local_storage);
                var car = storage.get(key.car.info);
                if (!yangaiche(sys.exist)(car)) {
                    show_msg('请先选车');
                    return false;
                }

                t('#popup_product_chooser').css('display', 'block');

                window.top.lockScroll();

                var stcw = t('.service-type-choose-wrapper');
                stcw.css('top', (480 / window.mobileUtil.bodyScale - stcw.height()) + 'px');
            });

            t('#store-item-footer .submit').click(function () {
                var storage = yangaiche(sys.local_storage);
                var car = storage.get(key.car.info);
                if (!yangaiche(sys.exist)(car)) {
                    show_msg('请先选车');
                    return false;
                }

                t('#popup_product_chooser').css('display', 'block');
            });

            t('#popup_service_type .store-item-cover').click(function () {
                t('#popup_service_type').css('display', 'none');

                window.top.unlockScroll();
            });

            t('#popup_product_chooser .store-item-cover').click(function () {
                t('#popup_product_chooser').css('display', 'none');

                window.top.unlockScroll();
            });

            function process(data, service_products) {
                t('.store-item-image-cover').css('bottom', (90 + 41 + 150 * data.optional_products.length) + 'px');

                var required_products = data.required_products, required_price = calculate(data.required_products), product_dict = {};

                t.each(data.optional_products ? data.optional_products : [], function (i, p_c) {
                    t.each(p_c.products, function (j, p) {
                        p.part_type = p_c.part_type;
                        product_dict[p.product_type] = p;
                    });
                });

                var tpl = Handlebars.compile(yangaiche(app.tpl.load)('template/carProducts.html'));
                var tpl_data = {
                    products: data.optional_products
                };
                t.each(service_products, function (i, p) {
                    if ('self' === p.service_type) {
                        tpl_data.can_self = {self_type: p.product_type, service_key: 'self'};
                    } else if ('keeper' === p.service_type) {
                        tpl_data.keeper_type = p.product_type;
                        tpl_data.service_key = 'keeper';
                    }
                    product_dict[p.product_type] = p;
                });
                t('#optional_products').empty().html(tpl(tpl_data));

                yangaiche(app.swiper_line.decorate)('#optional_products');

                t.each(t('.my-btn-group'), function (i, btn_group) {
                    if (i >= data.optional_products.length) {
                        return false;
                    }
                    var part_name = data.optional_products[i].part_name;
                    var first_p = t(btn_group).find('button').eq(0);
                    if ('空气滤' === part_name) {
                        t(first_p).css('background-color', '#FFFFFF');
                        t(first_p).css('color', '#333333');
                        t(first_p).css('border', '1px solid #cccccc');
                    } else {
                        var local_rel = first_p.attr('data-rel');
                        t(btn_group).attr('data-rel', local_rel);
                    }
                });

                function copy(array) {
                    var new_array = [];
                    t.each(array, function (i, item) {
                        new_array.push(item);
                    });
                    return new_array;
                }

                var products_tpl = Handlebars.compile(t('#products_tpl').text());

                function recalculate_products() {
                    var total_price = 0, total_products = copy(required_products);
                    t.each(t('.my-btn-group'), function (i, btn_group) {
                        var selected_rel = t(btn_group).attr('data-rel');
                        var p = product_dict[selected_rel];
                        if (p) {
                            p.total_price = parseFloat(calculate([p]));
                            total_products.push(p);
                            total_price += parseFloat(calculate([p]));
                        }
                    });

                    if (total_products.length === 0) {
                        total_products.empty = {};
                    }
                    t('#products .wrapper').html(products_tpl(total_products));

                    var cur_service_type = t('#my-btn-group').attr('data-key');
                    t.each(service_products, function (i, service_product) {
                        if (service_product.service_type === cur_service_type) {
                            total_products.push(service_product);
                        }
                    });
                    var now_total_price = yangaiche(ls.products.calculate)(total_products);
                    t('.store-item-u-price').text(now_total_price);

                    yangaiche(ls.order.update)(function (order) {
                        order.total_price = now_total_price;
                        order.products = total_products;
                    });

                    load_comments();
                }

                recalculate_products();

                storage.set(key.service.data, service_products);
                storage.set(key.service.can_self, service_products.length === 2);
                if (service_products.length < 2) {
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

                    t(group_p).find('.selectable').removeClass('selected');
                    $this.addClass('selected');

                    recalculate_products();
                });

                t('.my-btn-group').on('click', 'button', function () {
                    var group_p = t(this).parents()[1];
                    var local_rel = t(this).attr('data-rel');
                    var selected_rel = t(group_p).attr('data-rel');
                    var must_select_one = t(group_p).attr('must-select-one');
                    if (local_rel === selected_rel && !must_select_one) {
                        t(group_p).attr('data-rel', '');
                        t(this).css('background-color', '#FFFFFF');
                        t(this).css('color', '#333333');
                        t(this).css('border', '1px solid #cccccc');

                        recalculate_products();
                        return;
                    }

                    if (must_select_one) {
                        var local_key = t(this).attr('data-key');
                        t(group_p).attr('data-key', local_key);
                    }

                    t(group_p).attr('data-rel', local_rel);
                    t(group_p).find('button').css('background-color', '#FFFFFF');
                    t(group_p).find('button').css('color', '#333333');
                    t(group_p).find('button').css('border', '1px solid #cccccc');
                    t(this).css('background-color', '#0db603');
                    t(this).css('color', '#FFFFFF');
                    t(this).css('border', '1px solid #0db603');

                    recalculate_products();
                });

                var service_type = storage.get(get_unique_service_type((suppliers.length > 0 ? suppliers[0].supplier_name : '') + '保养维修'));
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

                t('#submit_btn').click(function () {

                    storage.set(key.shequbanjin.is_butler_pick, true);

                    yangaiche(ls.back.set_back_to_self)('order_settle.html');
                });
            }

            var config = suppliers.length > 0 ? '&supplier_id=' + suppliers[0].supplier_id : '';
            var order = get_order();
            var car = storage.get(key.car.info);
            getReq('/v2/api/products.json?service_type=11' + config + '&car_model_type=' + car.car_model_type, function (data) {
                if (data.required_products.length === 0 && data.optional_products.length === 0 && config) {
                    getReq('/v2/api/products.json?service_type=11&car_model_type=' + car.car_model_type, function (data) {
                        getReq('/v1/api/service_products.json?code=keeper', function (service_products) {
                            yangaiche(ls.order.update)(function (order) {
                                order.supplier_id = null;
                            });
                            t('#supplier .text').html('养爱车综合店');
                            process(data, service_products);
                        });
                    }, function (error) {
                        show_msg(error.message || JSON.stringify(error));
                    });
                } else {
                    if (!config) {
                        getReq('/v1/api/service_products.json?code=keeper', function (service_products) {
                            process(data, service_products);
                        });
                    }
                    process(data, service_products);
                }
            }, function (error) {
                show_msg(error.message || JSON.stringify(error));
            });
        }

        yangaiche(app.supplier.init)(init);

        var car_info = storage.get(key.car.info);
        if (yangaiche(sys.exist)(car_info)) {
            t('#store-item-car-choose .car-info-text').text(car_info.car_number);
            //var short_model = car_info.model.length > 10 ? car_info.model.substr(0, 10) + '...' : car_info.model;
            t('#car_model').text(car_info.car_number);
        }
    });

}());