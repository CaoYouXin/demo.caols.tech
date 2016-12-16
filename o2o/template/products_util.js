/**
 * Created by caols on 15-5-26.
 */
function load_products(service_type, car_model_type, before, before_param, after, after_param, debugging) {
    if (undefined === debugging) {
        debugging = false;
    }

    if (typeof(eval(before)) == "function") {
        if (debugging) {
            console.log('running before');
        }
        before(before_param);
    }

    getReq('products.json?service_type=' + service_type + '&car_model_type=' + car_model_type, function (data) {
        console.log(data);

        after_param = after_param || {};
        after_param['ret_data'] = data;
        if (typeof(eval(after)) == "function") {
            if (debugging) {
                console.log('running after');
            }
            after(after_param);
        }
    }, function () {
        alert("AJAX ERROR!");
    });
}

var simple_after = function (param) {
    function product_price(p) {
        return p['labour_price'] + p['price'] * p['unit_count'];
    }

    var products = [], total_price = 0;
    $.each(param['ret_data']['required_products'] ? param['ret_data']['required_products'] : [], function (i, p) {
        products.push(p);
        total_price += product_price(p);
    });

    $('#total_price').html('¥' + total_price.toFixed(2));
    var order = getOrder();
    order['products'] = products;
    updateOrder(order);
};

function product_price(p) {
    return p['labour_price'] + (p['price'] * p['unit_count']);
}

function recal_products(product_dict, product_part_dict, products) {
    var store = getStore();
    var now_total_price = store.get('required_price')['data'];
    $.each($('#products').find('.my-btn-group'), function (i, btn_group) {
        var p = product_dict[$(btn_group).attr('data-rel')];
        if (p) {
            if (products) {
                p['part_type'] = product_part_dict[p['product_type']];
                p['total_price'] = product_price(p);
                products.push(p);
            }
            now_total_price = now_total_price + product_price(p);
        }
    });
    $('#total_price').html('¥' + now_total_price.toFixed(2));
    store.set('total_price', now_total_price.toFixed(2));
    if (products) {
        var order = getOrder();
        order['total_price'] = now_total_price;
        order['products'] = products;
        updateOrder(order);
    }
}