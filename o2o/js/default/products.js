;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');

    ls.products = {
        calculate: 'products_calculate',
        calculate_single: 'products_calculate_single',
        touch: 'products_touch',
        set: 'products_set',
        update: 'products_update',

        products_info: 'products'
    };

    yangaiche(ls.products.calculate_single, function () {
        return function (p) {
            return p.labour_price + (p.price * p.unit_count);
        };
    });

    yangaiche(ls.products.calculate, function () {
        var product_price = yangaiche(ls.products.calculate_single);
        return function (products) {
            var price = 0;
            yangaiche(sys.$).each(products, function (i, p) {
                price += product_price(p);
            });
            return price.toFixed(1);
        };
    });

    yangaiche(ls.products.touch, function () {
        return function () {
            var order = yangaiche(ls.order.touch)();
            var products = order[ls.products.products_info];
            if (!yangaiche(sys.exist)(products)) {
                // TODO : 似乎不需要加一个空数组在订单对象里
                return [];
            }
            return products;
        };
    });

    yangaiche(ls.products.set, function () {
        return function (products) {
            yangaiche(ls.order.update)(function (order) {
                order[ls.products.products_info] = products;
            });
        };
    });

    yangaiche(ls.products.update, function () {
        return function (callback) {
            var products = yangaiche(ls.products.touch)();
            callback(products);
            yangaiche(ls.products.set)(products);
        };
    });

}());