;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {

        var getReq = yangaiche(app.http.get_request),
            reqParam = yangaiche(app.url_parameter),
            storage = yangaiche(sys.local_storage);

        //raw_data = '';
        //data = t.parseJSON(raw_data);

        getReq('/v1/api/order/service_flow?order_id=' + reqParam.order_id, function (data) {
            console.log(data);
            function parse_date_time(time) {
                if (!yangaiche(sys.exist)(time)) {
                    return ['', ''];
                }
                var match = time.match(/^\d{4}-(\d{2}-\d{2})T(\d{2}:\d{2}):\d{2}\.\d*$/);
                return [match[1].replace('-', '/'), match[2]];
            }

            var show_up_line = false, len = data.length;
            t.each(data, function (i, d) {
                var date_time = parse_date_time(d.time);
                d.date = date_time[0];
                d.time = date_time[1];
                if (!show_up_line) {
                    d.show_up_line = 'f';
                    show_up_line = true;
                }
                if (0 === d.status) {
                    d.oval_type = '';
                    d.up_line_color = ' height-10';
                    d.down_line_color = '';
                    d.name_color = 'for-0';
                } else if (1 === d.status) {
                    d.oval_type = ' oval-double-fill margin-top-5';
                    d.up_line_color = ' height-5';
                    d.down_line_color = ' another';
                    d.name_color = 'for-1';
                } else if (-1 === d.status) {
                    d.oval_type = ' oval-fill';
                    d.up_line_color = ' another height-10';
                    d.down_line_color = ' another';
                    d.name_color = 'for--1';
                }
                if ((len - 1) === i) {
                    d.show_down_line = 'f';
                }
                d.items = d.items || [];
            });

            var tpl = Handlebars.compile(t('#order_flow_tpl').text());
            t('#order_flow').append(tpl(data));

            var module = t.AMUI.gallery;
            if (module && module.init) {
                module.init();
            }

            var left_width = t('.left').eq(0).width();
            t('.left').css('width', left_width + 'px');
            t('.my-gallery').css('margin', '0');
            t('.my-gallery').css('padding', '10px 0 0 0');
            t('.my-gallery').css('width', (640 - 30 - left_width - 81 - 30) + 'px');

            t.each(t('.center'), function (i, c) {
                function max(a, b) {
                    return a > b ? a : b;
                }

                var parent = t(c).parents()[0];
                var max_height = max(t(parent).find('.left').height(), t(parent).find('.right').height());
                t(c).css('height', max_height + 'px');
                var down_line = t(parent).find('.down-line')[0];
                t(down_line).css('height', (max_height - 5 - t(c).find('.oval').height()) + 'px');
                t.each(t(c).find('.line'), function (i, cc) {
                    if (t(cc).attr('data-display') === 'f') {
                        t(cc).css('display', 'none');
                    }
                });
            });

        });

        //raw_data = '';
        //data = t.parseJSON(raw_data);

        var ready = false, interval, mgr;

        function init_markers() {
            if (interval) {
                clearInterval(interval);
                mgr.clearMarkers();
            }

            var map = new BMap.Map('map_view');
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);

            var gen_pois = [];
            t.each(storage.get('track_data'), function (i, point) {
                gen_pois.push(new BMap.Point(point.longitude, point.latitude));
            });

            map.setViewport(gen_pois);

            mgr = new BMapLib.MarkerManager(map, {
                maxZoom: 20, trackMarkers: true
            });

            var loaded = false;
            map.addEventListener('tilesloaded', function () {
                if (!loaded) {

                    var last = gen_pois.length, minus = 31 * 0.7 / gen_pois.length, index = gen_pois.length - 1, markers = [];
                    var icon = new BMap.Icon('http://baseimg.yangaiche.com/dian.png', {
                        width: 45,
                        height: 45
                    }, {anchor: new BMap.Size(22.5, 22.5)}), marker;
                    interval = setInterval(function () {
                        var imgs = t('img[src="http://baseimg.yangaiche.com/dian.png"]');
//                                    alert(imgs.length);
                        var to_change_count = Math.min(last, markers.length), len = imgs.length;
                        for (var i = 0; i < to_change_count + Math.min(index + 1, 0); i++) {
                            var size = markers[len - 1 - i].size - minus;
                            imgs.eq(len - 1 - i).css('width', size + 'px');
                            imgs.eq(len - 1 - i).css('height', size + 'px');
                            markers[len - 1 - i].size = size;
                        }
                        if (index > 0) {
                            marker = new BMap.Marker(gen_pois[index], {
                                icon: icon
                            });
                            marker.size = 45;
                            marker.disableDragging();
                            marker.addEventListener('dragging', function (e) {
                                e.preventDefault();
                            });
                            markers.push(marker);
                            mgr.addMarker(marker, 4, 20);
                            mgr.showMarkers();
                        } else {
                            marker = new BMap.Marker(gen_pois[index], {
                                icon: new BMap.Icon('http://baseimg.yangaiche.com/car2.png', {
                                    width: 111,
                                    height: 126
                                }, {anchor: new BMap.Size(55, 126 - 32)})
                            });
                            marker.disableDragging();
                            marker.addEventListener('dragging', function (e) {
                                e.preventDefault();
                            });
                            markers.push(marker);
                            mgr.addMarker(marker, 4, 20);
                            mgr.showMarkers();
                        }
                        index -= 1;
                        if (index < 0) {
                            clearInterval(interval);
                        }
                    }, 300);

                    loaded = true;
                }
            });
        }

        getReq('/v1/api/tracks?order_id=' + reqParam.order_id, function (data) {
            console.log(data);

            storage.set('track_data', data);

            ready = true;

        });

        t('#car_tracks_btn').click(function () {
            if (ready) {
                t('#car_tracks_btn').removeClass('my-header-not-selected');
                t('#car_tracks_btn').addClass('my-header-selected');
                t('#order_flow_btn').removeClass('my-header-selected');
                t('#order_flow_btn').addClass('my-header-not-selected');
                t('#car_tracks').css('display', 'block');
                t('#order_flow').css('display', 'none');

                t('#map_view').css('height', (t(window).height()/* - t('#run').height()*/ - 80) + 'px');

                init_markers();
            }
        });

        t('#order_flow_btn').click(function () {
            t('#order_flow_btn').removeClass('my-header-not-selected');
            t('#order_flow_btn').addClass('my-header-selected');
            t('#car_tracks_btn').removeClass('my-header-selected');
            t('#car_tracks_btn').addClass('my-header-not-selected');
            t('#order_flow').css('display', 'block');
            t('#car_tracks').css('display', 'none');
        });
    });

}());