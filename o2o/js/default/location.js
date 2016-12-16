;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('order');

    ls.location = {
        map: 'order_location_map',
        touch: 'order_location_touch',
        set: 'order_location_set',
        update: 'order_location_update',

        location_info: 'location'
    };

    yangaiche(ls.location.map, function () {
        return {};
    });

    yangaiche(ls.location.touch, function () {
        return function () {
            var order = yangaiche(ls.order.touch)();
            var location = order[ls.location.location_info];
            if (!yangaiche(sys.exist)(location)) {
                // TODO : 似乎不需要加一个空对象在订单对象里
                return {};
            }
            return location;
        };
    });

    yangaiche(ls.location.set, function () {
        return function (location) {
            yangaiche(ls.order.update)(function (order) {
                order[ls.location.location_info] = location || order[ls.location.location_info];
            });
        };
    });

    yangaiche(ls.location.update, function () {
        return function (callback) {
            var location = yangaiche(ls.location.touch)();
            callback(location);
            yangaiche(ls.location.set)(location);
        };
    });

}());