;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('show_msg');

    app.map = {
        init: 'map_init',
        auto_location: 'map_auto_location'
    };

    yangaiche(app.map.init, function () {
        return {};
    });

    yangaiche(app.map.auto_location, function () {
        return function (callback) {
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (e) {
                console.log(e);
                if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                    // 定位成功事件
                    yangaiche(ls.location.update)(function (location_info) {
                        var address = '';
                        address += e.address.city ? e.address.city : '';
                        address += e.address.district ? e.address.district : '';
                        address += e.address.street ? e.address.street : '';
                        address += e.address.streetNumber ? e.address.streetNumber : '';
                        location_info.name = e.address.city ? e.address.city : '';
                        location_info.address = address;
                        location_info.latitude = e.point.lat;
                        location_info.longitude = e.point.lng;
                        location_info.point = e.point;
                        callback(address, location_info);
                    });
                } else {
                    // 定位失败事件
                    yangaiche(app.show_msg.show)(e.message);
                }
            }, {enableHighAccuracy: true});
        };
    });

}());