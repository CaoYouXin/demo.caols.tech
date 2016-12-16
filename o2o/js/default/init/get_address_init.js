;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('duplicate_submission');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('user');

    yangaiche(sys.init)(function (t) {
        var show_msg = yangaiche(app.show_msg.show);

        t('#map_view').css('height', t(window).height() + 'px');
        t('#locate_button').attr('disabled', 'disabled');

        var location_info = {};
        var map = new BMap.Map('map_view');
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom(true);
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);               // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        map.panTo(point);

        var top_right_navigation = new BMap.NavigationControl({
            offset: new BMap.Size(15, 65),
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        });
        map.addControl(top_right_navigation);

        var geolocationControl = new BMap.GeolocationControl({offset: new BMap.Size(15, 65), enableAutoLocation: true});
        var updateLocationInfo = function () {
            map.clearOverlays();    //清除地图上所有覆盖物
            var cpoint = new BMap.Point(location_info.longitude, location_info.latitude);
            map.centerAndZoom(cpoint, 18);
            var marker = new BMap.Marker(cpoint);
            var opts = {
                width: 200,    // 信息窗口宽度
                height: 70,     // 信息窗口高度
                offset: new BMap.Size(0, -25),
                title: '标题：' + location_info.name, // 信息窗口标题
                enableAutoPan: true, //自动平移
                enableMessage: false
            };
            var infoWindow = new BMap.InfoWindow('地址：' + location_info.address, opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow, cpoint); //开启信息窗口
            marker.addEventListener('click', function () {
                map.openInfoWindow(infoWindow, cpoint); //开启信息窗口
            });
            map.addOverlay(marker);   //添加标注

            t('#locate_button').removeAttr('disabled');
        };

        geolocationControl.addEventListener('locationSuccess', function (e) {
            // 定位成功事件
            console.log(e);
            var address = '';
            address += e.addressComponent.city;
            address += e.addressComponent.district;
            address += e.addressComponent.street;
            address += e.addressComponent.streetNumber;
            location_info.name = e.addressComponent.city;
            location_info.address = address;
            location_info.latitude = e.point.lat;
            location_info.longitude = e.point.lng;
            location_info.point = e.point;
            updateLocationInfo();
        });
        geolocationControl.addEventListener('locationError', function (e) {
            // 定位失败事件
            show_msg(e.message);
        });
        map.addControl(geolocationControl);

        function initAddressInfo() {
            if (!yangaiche(sys.exist)(location_info.address) || location_info.address === '') {
                geolocationControl.location();
            } else {
                updateLocationInfo();
            }
        }

        setTimeout(initAddressInfo, 2000);

        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
                'input': 'search_input',
                'location': map
            });

        ac.addEventListener('onhighlight', function (e) {  //鼠标放在下拉列表上的事件
            var str = '';
            var _value = e.fromitem.value;
            var value = '';
            if (e.fromitem.index > -1) {
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;

            value = '';
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value;
            t('#searchResultPanel').innerHTML = str;
        });

        function setPlace(myValue) {
            location_info = {};
            function myFun() {
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                location_info.latitude = pp.lat;
                location_info.longitude = pp.lng;
                location_info.name = local.getResults().getPoi(0).title;
                location_info.address = local.getResults().getPoi(0).address;
                location_info.point = pp;
                updateLocationInfo();

                yangaiche(app.ds.reset_button)('#locate_button');
            }

            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }

        ac.addEventListener('onconfirm', function (e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value, myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            t('#searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue;

            setPlace(myValue);
            yangaiche(app.ds.disable_button)('#locate_button');
        });

        t('#locate_button').click(function () {
            location_info = location_info || {};
            location_info.name = location_info.name || '';
            location_info.address = t('#search_input').val() || location_info.address;

            if (location_info.address.match(/^\s*$/)) {
                show_msg('地址不能为空');
                return;
            }

            var param = {
                name: location_info.name,
                address: location_info.address,
                longitude: location_info.longitude,
                latitude: location_info.latitude,
                user_id: yangaiche(ls.user.touch)().user_id
            };
            yangaiche(app.http.post_request)('/v1/api/address/create', param, function () {
                yangaiche(ls.back.set_back_to_his)('my_address_manage.html');
            });
        });
    });
}());