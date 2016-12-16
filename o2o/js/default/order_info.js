;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('duplicate_submission');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('template');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('pay');
    yangaiche(sys.load_module)('order/create');

    app.order_info = {
        show: 'show_order_info'
    };

    yangaiche(app.order_info.show, function () {
        var t = yangaiche(sys.$),
            disable_button = yangaiche(app.ds.disable_button),
            reset_button = yangaiche(app.ds.reset_button),
            postReq = yangaiche(app.http.post_request),
            show_msg = yangaiche(app.show_msg.show);
        return function (order) {
            console.log(order);
            order.client_basic.car_number = order.car.car_number || order.car.licence.province + order.car.licence.number;

            order.to_select = null;
            order.to_selected_items = null;
            order.self_items = [];

            function products_divide(i, p) {
                if (p.disabled) {
                    return true;
                }

                var selection_mode = p.selection_mode || 1;
                if (selection_mode === 1) {
                    order.self_items.push(p);
                } else if (selection_mode === 2) {
                    if (!yangaiche(sys.exist)(order.to_select)) {
                        order.to_select = {
                            unselected_items: []
                        };
                    }
                    order.to_select.unselected_items.push(p);
                } else if (selection_mode !== 5) {
                    if (!yangaiche(sys.exist)(order.to_selected_items)) {
                        order.to_selected_items = {
                            selected_items: []
                        };
                    }
                    p.display_status = selection_mode === 3 ? '¥' + p.total_price : '已拒绝';
                    order.to_selected_items.selected_items.push(p);
                }
            }

            t.each(order.products, products_divide);
            t.each(order.increase_products || [], products_divide);

            if (order.not_paid_price > 0) {
                order.not_paid = {not_paid_price: order.not_paid_price};
            }
            if (order.paid_price > 0) {
                order.paid = {paid_price: order.paid_price};
            }

            order.keeper_basics = order.keeper_basics || [];
            t.each(order.keeper_basics, function (i, keeper) {
                if ('keeper' === keeper.type) {
                    keeper.type = '管家';
                } else if ('mechanic' === keeper.type) {
                    keeper.type = '技师';
                }
            });

            if (order.pay_status && order.pay_status === 1) {
                if ('completed' === order.order_status_key) {
                    order.submit_button_class = 'orange_btn';
                    order.submit_button_text = key.submit_button.submit_text_value4;
                } else {
                    order.submit_button_class = 'gray_btn';
                    if ('evaluated' === order.order_status_key) {
                        order.submit_button_text = key.submit_button.submit_text_value6;
                    } else if ('cancelled' === order.order_status_key) {
                        order.submit_button_class = 'gray_btn';
                        order.submit_button_text = key.submit_button.submit_text_value9;
                    } else if ('closed' === order.order_status_key) {
                        order.submit_button_class = 'gray_btn';
                        order.submit_button_text = key.submit_button.submit_text_value10;
                    } else {
                        order.submit_button_text = key.submit_button.submit_text_value5;
                    }
                }
            } else {
                order.submit_button_class = 'orange_btn';
                if ('creating' === order.order_status_key) {
                    order.submit_button_text = key.submit_button.submit_text_value3;
                } else if ('cancelled' === order.order_status_key) {
                    order.submit_button_class = 'gray_btn';
                    order.submit_button_text = key.submit_button.submit_text_value9;
                } else if ('closed' === order.order_status_key) {
                    order.submit_button_class = 'gray_btn';
                    order.submit_button_text = key.submit_button.submit_text_value10;
                } else {
                    if (order.not_paid_price > 0) {
                        order.submit_button_text = key.submit_button.submit_text_value2;
                    } else {
                        order.submit_button_class = 'gray_btn';
                        order.submit_button_text = key.submit_button.submit_text_value7;
                    }
                }
            }

            console.log(order);
            var template = Handlebars.compile(yangaiche(app.tpl.load)('template/orderInfo.html'));
            t('body').prepend(template(order));

            if (order.submit_button_text === key.submit_button.submit_text_value3) {
                t('#submit_button').click(function () {
                    disable_button('#submit_button');

                    var user = yangaiche(ls.user.touch)();
                    order.user_id = user.user_id;
                    order.peer_source = order.peer_source || yangaiche(sys.browser_type).type;
                    postReq(yangaiche(app.order_create.get_api), order, function (data) {
                        yangaiche(ls.order.set)(data);
                        yangaiche(ls.back.set_back_to_store)('order_success.html');
                    }, function (data) {
                        reset_button('#submit_button');
                        show_msg('下单失败:' + data.message);
                    });
                });
            } else if (order.submit_button_text === key.submit_button.submit_text_value2) {
                t('#submit_button').click(function () {
                    disable_button('#submit_button');

                    var param = yangaiche(app.pay.get_param)({order_id: order.id},
                        'order_info_suc.html?order_id=' + yangaiche(app.url_parameter).order_id,
                        'order_info.html?order_id=' + yangaiche(app.url_parameter).order_id);

                    yangaiche(app.pay.do)(param);
                });
            } else if (order.submit_button_text === key.submit_button.submit_text_value4) {
                t('#submit_button').click(function () {
                    yangaiche(ls.back.set_back_to_self)('order_comment.html?order_id=' + order.id);
                });
            }
        };
    });

}());