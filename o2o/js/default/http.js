;(function () {

        'use strict';

        yangaiche(sys.load_default_module)('repository');
        yangaiche(sys.load_default_module)('user');
        yangaiche(sys.load_default_module)('openid');
        yangaiche(sys.load_default_module)('env');

        app.http = {
            get_api_root: 'get_api_root',
            get_request: 'get_request',
            post_request: 'post_request',
            post_charge_request: 'post_charge_request',
            tweak: 'tweak_sth',
            fire_tweaks: 'fire_tweaks',

            abort_or_hijack: 'abort_or_hijack',
            hijacker: 'http_hijacker',
            before_render: 'before_render',
            after_render: 'after_render',

            get: 'get_request_key',
            post: 'post_request_key',
            charge: 'charge_request_key',

            abort: 'app_http_abort',

            tweaks: [],

            count: 0
        };

        yangaiche(app.http.get_api_root, function () {
            return function () {
                var api_root = '';

                yangaiche(app.env.do_sth)({
                    dev: function () {
                        api_root = '/develop';
                    },
                    staging: function () {
                        api_root = '/staging';
                    },
                    product: function () {
                        api_root = '';
                    },
                    local: function () {
                        api_root = '';
                    }
                });

                return api_root;
            }();
        });

        yangaiche(app.http.tweak, function () {
            return function (callback) {
                //alert(callback.toString());
                app.http.tweaks.push(callback);
            };
        });

        yangaiche(app.http.fire_tweaks, function () {
            return function (type, request_type, url) {
                var i = 0;

                if (type === app.http.abort_or_hijack) {
                    for (; i < app.http.tweaks.length; i++) {
                        var ret = app.http.tweaks[i](type, request_type, url);

                        if (yangaiche(sys.exist)(ret)) {
                            return ret;
                        }
                    }

                    return url;
                } else if (type === app.http.hijacker) {
                    for (; i < app.http.tweaks.length; i++) {
                        var callback = app.http.tweaks[i](type, request_type, url);

                        if (yangaiche(sys.exist)(callback)) {
                            return callback;
                        }
                    }
                } else {
                    for (; i < app.http.tweaks.length; i++) {
                        app.http.tweaks[i](type, request_type, url);
                    }
                }

            };
        });

        var timeout = 45 * 1000;

        function get_real_url(url) {
            // 所有Ajax后端服务请求都需要'/'开头
            return yangaiche(app.http.get_api_root) + url;
        }

        function default_header(request) {
            //request.setRequestHeader('Accept-Encoding', 'gzip');
            request.setRequestHeader('API-Client-App-Name', 'yangaiche_client');
            request.setRequestHeader('API-Client-Device-Type', yangaiche(sys.browser_type).type);
            yangaiche(ls.user.if_exist)(function (user) {
                request.setRequestHeader('API-Access-Token', user.token);
            });
        }

        yangaiche(app.http.get_request, function () {
            var tweaker = yangaiche(app.http.fire_tweaks);
            return function (url, callBack, failureBack) {

                console.log('url', url);

                app.http.count++;

                setTimeout(function () {
                        callBack({
                            "/v2/api/store/banners.json": [{
                                "id": 8,
                                "image_url": "../image/640x230-hot-event.png",
                                "link_url": "http://pay.yangaiche.com/h5/activity.html?page_code=Banner4",
                                "rank": 1
                            }, {
                                "id": 13,
                                "image_url": "../image/640x230-hot-event.png",
                                "link_url": "http://pay.yangaiche.com/h5/activity.html?page_code=Banner4",
                                "rank": 2147483647
                            }, {
                                "id": 17,
                                "image_url": "../image/640x230-hot-event.png",
                                "link_url": "http://pay.yangaiche.com/h5/activity.html?page_code=Banner4",
                                "rank": 2147483647
                            }],
                            "/v2/api/home/good_suggest/enabled.json": [{
                                "generalize_id": 13,
                                "title_img_id": 49364,
                                "link_url": "http://h5.eqxiu.com/s/si1vhnEi",
                                "link_type": "h5_page",
                                "link_id": null,
                                "link_text": "",
                                "generalize_code": "good_suggest",
                                "status": "enabled",
                                "index_no": 0,
                                "title_img_view": {
                                    "img_id": 49364,
                                    "img_index": 0,
                                    "thumbnail_url": "../image/375x336-hot-item.png",
                                    "original_url": "../image/375x336-hot-item.png",
                                    "raw_url": "../image/375x336-hot-item.png"
                                }
                            }, {
                                "generalize_id": 14,
                                "title_img_id": 49365,
                                "link_url": "",
                                "link_type": "ware",
                                "link_id": 49,
                                "link_text": "全年洗车卡(优惠卡包-全年洗车卡)",
                                "generalize_code": "good_suggest",
                                "status": "enabled",
                                "index_no": 0,
                                "title_img_view": {
                                    "img_id": 49365,
                                    "img_index": 0,
                                    "thumbnail_url": "../image/375x168-hot-item.png",
                                    "original_url": "../image/375x168-hot-item.png",
                                    "raw_url": "../image/375x168-hot-item.png"
                                }
                            }, {
                                "generalize_id": 15,
                                "title_img_id": 49366,
                                "link_url": "",
                                "link_type": "topic_list",
                                "link_id": 1,
                                "link_text": "洗车美容类专题",
                                "generalize_code": "good_suggest",
                                "status": "enabled",
                                "index_no": 0,
                                "title_img_view": {
                                    "img_id": 49366,
                                    "img_index": 0,
                                    "thumbnail_url": "../image/375x168-hot-item.png",
                                    "original_url": "../image/375x168-hot-item.png",
                                    "raw_url": "../image/375x168-hot-item.png"
                                }
                            }],
                            "/v2/api/store/home_ware_list.json": [{
                                "ware_type_name": "社区店专享",
                                "ware_list": [{
                                    "ware_id": 32,
                                    "ware_name": "普通补胎",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 36257,
                                    "cover_img": {
                                        "img_id": 36257,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "轮胎-普通补胎",
                                    "ware_full_price": 140.00000000,
                                    "ware_mark_price": 80.00000000,
                                    "ware_price_max": 100.00000000,
                                    "ware_price_min": 80.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 33,
                                    "ware_name": "蘑菇钉补胎",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 36258,
                                    "cover_img": {
                                        "img_id": 36258,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "轮胎-蘑菇钉补胎",
                                    "ware_full_price": 180.00000000,
                                    "ware_mark_price": 160.00000000,
                                    "ware_price_max": 160.00000000,
                                    "ware_price_min": 160.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 34,
                                    "ware_name": "普通车辆清洗",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 36259,
                                    "cover_img": {
                                        "img_id": 36259,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-普通车辆清洗",
                                    "ware_full_price": 65.00000000,
                                    "ware_mark_price": 50.00000000,
                                    "ware_price_max": 58.00000000,
                                    "ware_price_min": 50.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 57,
                                    "ware_name": "养爱车自营店优惠洗车",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48826,
                                    "cover_img": {
                                        "img_id": 48826,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "洗车美容-养爱车自营店普通洗车",
                                    "ware_full_price": 58.00000000,
                                    "ware_mark_price": 58.00000000,
                                    "ware_price_max": 58.00000000,
                                    "ware_price_min": 58.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 59,
                                    "ware_name": "养爱车自营店车身打蜡",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48861,
                                    "cover_img": {
                                        "img_id": 48861,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-车身打蜡（旗舰店）",
                                    "ware_full_price": 388.00000000,
                                    "ware_mark_price": 298.00000000,
                                    "ware_price_max": 298.00000000,
                                    "ware_price_min": 298.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 60,
                                    "ware_name": "养爱车自营店玻璃镀膜",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48862,
                                    "cover_img": {
                                        "img_id": 48862,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-玻璃镀膜（含普洗）",
                                    "ware_full_price": 428.00000000,
                                    "ware_mark_price": 398.00000000,
                                    "ware_price_max": 398.00000000,
                                    "ware_price_min": 398.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 61,
                                    "ware_name": "养爱车自营店铂晶量子镀晶",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48863,
                                    "cover_img": {
                                        "img_id": 48863,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-铂晶量子镀晶（一年）",
                                    "ware_full_price": 2580.00000000,
                                    "ware_mark_price": 1998.00000000,
                                    "ware_price_max": 1998.00000000,
                                    "ware_price_min": 1998.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 62,
                                    "ware_name": "养爱车自营店车内负离子杀菌",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48864,
                                    "cover_img": {
                                        "img_id": 48864,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-车内负离子杀菌",
                                    "ware_full_price": 99.00000000,
                                    "ware_mark_price": 59.00000000,
                                    "ware_price_max": 59.00000000,
                                    "ware_price_min": 59.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 63,
                                    "ware_name": "养爱车自营店车漆镜面还原抛光",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48865,
                                    "cover_img": {
                                        "img_id": 48865,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-车漆镜面还原抛光",
                                    "ware_full_price": 800.00000000,
                                    "ware_mark_price": 599.00000000,
                                    "ware_price_max": 599.00000000,
                                    "ware_price_min": 599.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 64,
                                    "ware_name": "养爱车自营店大灯去氧化层镀膜",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48866,
                                    "cover_img": {
                                        "img_id": 48866,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-大灯去氧化层镀膜",
                                    "ware_full_price": 160.00000000,
                                    "ware_mark_price": 128.00000000,
                                    "ware_price_max": 128.00000000,
                                    "ware_price_min": 128.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 65,
                                    "ware_name": "养爱车自营店镀晶保养",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48867,
                                    "cover_img": {
                                        "img_id": 48867,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-镀晶保养",
                                    "ware_full_price": 350.00000000,
                                    "ware_mark_price": 299.00000000,
                                    "ware_price_max": 299.00000000,
                                    "ware_price_min": 299.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 66,
                                    "ware_name": "养爱车自营店发动机舱清洗",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48868,
                                    "cover_img": {
                                        "img_id": 48868,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-发动机舱清洗（旗舰店）",
                                    "ware_full_price": 320.00000000,
                                    "ware_mark_price": 298.00000000,
                                    "ware_price_max": 298.00000000,
                                    "ware_price_min": 298.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 67,
                                    "ware_name": "养爱车自营店轮毂镀晶",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48869,
                                    "cover_img": {
                                        "img_id": 48869,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-轮毂镀晶",
                                    "ware_full_price": 420.00000000,
                                    "ware_mark_price": 396.00000000,
                                    "ware_price_max": 396.00000000,
                                    "ware_price_min": 396.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 68,
                                    "ware_name": "养爱车自营店漆面轮毂去沥青",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48870,
                                    "cover_img": {
                                        "img_id": 48870,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-漆面轮毂去沥青",
                                    "ware_full_price": 80.00000000,
                                    "ware_mark_price": 48.00000000,
                                    "ware_price_max": 48.00000000,
                                    "ware_price_min": 48.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 69,
                                    "ware_name": "养爱车自营店漆面去氧化层",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48871,
                                    "cover_img": {
                                        "img_id": 48871,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-漆面去氧化层（含普洗）",
                                    "ware_full_price": 180.00000000,
                                    "ware_mark_price": 158.00000000,
                                    "ware_price_max": 158.00000000,
                                    "ware_price_min": 158.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 70,
                                    "ware_name": "养爱车自营店钛晶氟素镀晶",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 48872,
                                    "cover_img": {
                                        "img_id": 48872,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-钛晶氟素镀晶（三年）",
                                    "ware_full_price": 4500.00000000,
                                    "ware_mark_price": 3998.00000000,
                                    "ware_price_max": 3998.00000000,
                                    "ware_price_min": 3998.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 75,
                                    "ware_name": "养爱车自营店深度精洗",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 49092,
                                    "cover_img": {
                                        "img_id": 49092,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-车辆深度精洗（旗舰店）",
                                    "ware_full_price": 180.00000000,
                                    "ware_mark_price": 128.00000000,
                                    "ware_price_max": 128.00000000,
                                    "ware_price_min": 128.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 78,
                                    "ware_name": "洗车打蜡 双11特惠套餐  自营门店",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 53139,
                                    "cover_img": {
                                        "img_id": 53139,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "洗车美容-洗车打蜡 双11特惠",
                                    "ware_full_price": 280.00000000,
                                    "ware_mark_price": 111.10000000,
                                    "ware_price_max": 111.10000000,
                                    "ware_price_min": 111.10000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 79,
                                    "ware_name": "养爱车 全车镀晶1年 双11特惠  上门接送车",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 53169,
                                    "cover_img": {
                                        "img_id": 53169,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "洗车美容-全车镀晶1年 上门接送车",
                                    "ware_full_price": 1980.00000000,
                                    "ware_mark_price": 1111.00000000,
                                    "ware_price_max": 1111.00000000,
                                    "ware_price_min": 1111.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }, {
                                    "ware_id": 80,
                                    "ware_name": "养爱车 自营店3M全车贴膜",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 53192,
                                    "cover_img": {
                                        "img_id": 53192,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "洗车美容-养爱车 3M全车贴膜 双11特惠",
                                    "ware_full_price": 1980.00000000,
                                    "ware_mark_price": 1111.00000000,
                                    "ware_price_max": 1111.00000000,
                                    "ware_price_min": 1111.00000000,
                                    "ware_type_name": "社区店专享",
                                    "ware_sub_type_code": "community_exclusive",
                                    "ware_type_code": "store_home_ware"
                                }]
                            }, {
                                "ware_type_name": "线下活动专享",
                                "ware_list": [{
                                    "ware_id": 77,
                                    "ware_name": "养爱车  代办验车服务",
                                    "ware_status": "up_shelves",
                                    "title_img_id": 52992,
                                    "cover_img": {
                                        "img_id": 52992,
                                        "img_index": 0,
                                        "thumbnail_url": "../image/329x185-item.png",
                                        "original_url": "../image/329x185-item.png",
                                        "raw_url": "../image/329x185-item.png"
                                    },
                                    "product_name": "特殊商品分类-代办验车",
                                    "ware_full_price": 500.00000000,
                                    "ware_mark_price": 312.00000000,
                                    "ware_price_max": 312.00000000,
                                    "ware_price_min": 312.00000000,
                                    "ware_type_name": "线下活动专享",
                                    "ware_sub_type_code": null,
                                    "ware_type_code": "store_home_ware"
                                }]
                            }],
                            "/v2/api/supplier/adaption.json": [],
                            "/v1/api/car_user/sign_up.json": {
                                "phone": "18618128264",
                                "userId": 33337,
                                "token": "VWIIaHrFoSWqd6rstU14dQsSmsm6pvmbhjCQHNuKc4nsBVKPYFsOCYhmIus00wrM",
                                "name": "",
                                "gender": "male",
                                "password": "",
                                "supplierId": null,
                                "supplierName": null,
                                "openid": null,
                                "user_id": 33337,
                                "phone_number": "18618128264",
                                "attachment_view": null,
                                "user_role": null
                            },
                            "/v1/api/addresses": [{
                                "id": 3614,
                                "address": "六里屯",
                                "longitude": 116.481273,
                                "latitude": 39.938564,
                                "user_id": 33337,
                                "name": "六里屯街道六北小区"
                            }, {
                                "id": 3613,
                                "address": "北京市东城区",
                                "longitude": 116.402136,
                                "latitude": 39.913709,
                                "user_id": 33337,
                                "name": "广场西侧路"
                            }],
                            "/v2/api/store/ware/detail.json": {
                                "ware_id": 32,
                                "ware_type_id": 7,
                                "ware_type_name": "社区店专享",
                                "ware_name": "普通补胎",
                                "brief_introduction": "胎内补贴片，送动平衡",
                                "ware_full_price": 140.00000000,
                                "ware_mark_price": 80.00000000,
                                "ware_status": "up_shelves",
                                "cover_img_id": 36257,
                                "cover_img": {
                                    "img_id": 36257,
                                    "img_index": 0,
                                    "thumbnail_url": "../image/750x420-cover.png",
                                    "original_url": "../image/750x420-cover.png",
                                    "raw_url": "../image/750x420-cover.png"
                                },
                                "introduction_imgs": [{
                                    "img_id": 19475,
                                    "img_index": 0,
                                    "thumbnail_url": "../image/750x500-intro.png",
                                    "original_url": "../image/750x500-intro.png",
                                    "raw_url": "../image/750x500-intro.png"
                                }, {
                                    "img_id": 19476,
                                    "img_index": 1,
                                    "thumbnail_url": "../image/750x500-intro.png",
                                    "original_url": "../image/750x500-intro.png",
                                    "raw_url": "../image/750x500-intro.png"
                                }, {
                                    "img_id": 19477,
                                    "img_index": 2,
                                    "thumbnail_url": "../image/750x500-intro.png",
                                    "original_url": "../image/750x500-intro.png",
                                    "raw_url": "../image/750x500-intro.png"
                                }],
                                "ware_products": [{
                                    "product_id": 1116,
                                    "product_category": "轮胎",
                                    "product_name": "普通补胎",
                                    "product_price": 80.00000000
                                }],
                                "product_info": "轮胎-普通补胎",
                                "product_id": 1116,
                                "ware_type_code": "store_home_ware"
                            },
                            "/v1/api/service_products.json": [{
                                "recommended": true,
                                "price": 88.00000000,
                                "product_type": 11,
                                "product_name": "管家接车",
                                "labour_price": 0,
                                "unit_count": 1,
                                "service_type": "keeper"
                            }, {
                                "recommended": true,
                                "price": 0E-8,
                                "product_type": 1107,
                                "product_name": "自驾到店",
                                "labour_price": 0,
                                "unit_count": 1,
                                "service_type": "self"
                            }],
                            "/v2/api/order/service_comment/page_list.json": {
                                "cur_page": 1,
                                "page_size": 1,
                                "total_size": 169,
                                "total_page": 169,
                                "items": [{
                                    "order_id": 25936,
                                    "comment_user_id": 25088,
                                    "comment_user_name": "李长海",
                                    "comment_text": "养爱车，绝对信得过的养车平台。",
                                    "keeper_rating": null,
                                    "service_rating": 5,
                                    "create_time": "2016-03-11T15:05:06.000"
                                }]
                            },
                            "/v1/api/cars.json": [{
                                "id": 43347,
                                "disabled": false,
                                "licence": {"province": "京", "number": "啊啊啊"},
                                "brand": "阿尔法·罗密欧",
                                "category": "156",
                                "model": "2004款  156 2.0 2004款",
                                "number": "啊啊啊",
                                "province": "京",
                                "bought_time": "2007-01-01T01:01:01.000",
                                "miles": 0,
                                "chassis_number": null,
                                "engine_number": null,
                                "brand_img_url": {
                                    "id": 1041,
                                    "thumbnail_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png/s250.jpg",
                                    "original_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png/s1024.jpg",
                                    "raw_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png"
                                },
                                "model_type": 462,
                                "user_id": 33337,
                                "carcare_book": [],
                                "whole_score": 70,
                                "parts": [{
                                    "id": 823205,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 11,
                                    "name": "空气滤",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/11home_engine_oil.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823206,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 15,
                                    "name": "制动液",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/15home_brake_fluid.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823207,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 6,
                                    "name": "后刹车片",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/6home_brake_pads.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823208,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 13,
                                    "name": "变速箱油",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/13home_transmission.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823209,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 5,
                                    "name": "前刹车片",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/5home_brake_pads.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823210,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 7,
                                    "name": "雨刮片",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/7home_wiper.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823211,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 16,
                                    "name": "电瓶",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/16home_battery.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823212,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 12,
                                    "name": "汽滤",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/12home_engine_oil.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823213,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 19,
                                    "name": "火花塞",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/19home_spark.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823214,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 4,
                                    "name": "右后轮胎",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/4home_tire.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823215,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 2,
                                    "name": "右前轮胎",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/2home_tire.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823216,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 14,
                                    "name": "转向助力液",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/14home_fule_oil.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823217,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 18,
                                    "name": "空滤",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/18home_engine_oil.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823218,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 17,
                                    "name": "正时皮带",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/17home_timing.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823219,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 1,
                                    "name": "左前轮胎",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/1home_tire.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823220,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 3,
                                    "name": "左后轮胎",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/3home_tire.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823221,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 8,
                                    "name": "雨刮器",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/8home_wiper.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823222,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 9,
                                    "name": "机油",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/9engine_oil.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 823223,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 43347,
                                    "type": 10,
                                    "name": "机滤",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/10home_engine_oil.png",
                                    "last_update_time": "2007-01-01T01:01:01.000",
                                    "used_miles": 0
                                }]
                            }, {
                                "id": 45901,
                                "disabled": false,
                                "licence": {"province": "京", "number": "Alpha"},
                                "brand": "阿尔法·罗密欧",
                                "category": "166",
                                "model": "2003款  166 3.0 2003款",
                                "number": "Alpha",
                                "province": "京",
                                "bought_time": "2016-07-01T01:01:01.000",
                                "miles": 141234,
                                "chassis_number": null,
                                "engine_number": null,
                                "brand_img_url": {
                                    "id": 1041,
                                    "thumbnail_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png/s250.jpg",
                                    "original_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png/s1024.jpg",
                                    "raw_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png"
                                },
                                "model_type": 463,
                                "user_id": 33337,
                                "carcare_book": [],
                                "whole_score": 70,
                                "parts": [{
                                    "id": 871731,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 12,
                                    "name": "汽滤",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/12home_engine_oil.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871732,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 15,
                                    "name": "制动液",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/15home_brake_fluid.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871733,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 3,
                                    "name": "左后轮胎",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/3home_tire.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871734,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 19,
                                    "name": "火花塞",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/19home_spark.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871735,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 8,
                                    "name": "雨刮器",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/8home_wiper.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871736,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 13,
                                    "name": "变速箱油",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/13home_transmission.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871737,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 7,
                                    "name": "雨刮片",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/7home_wiper.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871738,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 6,
                                    "name": "后刹车片",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/6home_brake_pads.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871739,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 11,
                                    "name": "空气滤",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/11home_engine_oil.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871740,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 5,
                                    "name": "前刹车片",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/5home_brake_pads.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871741,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 4,
                                    "name": "右后轮胎",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/4home_tire.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871743,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 1,
                                    "name": "左前轮胎",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/1home_tire.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871744,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 18,
                                    "name": "空滤",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/18home_engine_oil.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871745,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 16,
                                    "name": "电瓶",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/16home_battery.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871746,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 17,
                                    "name": "正时皮带",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/17home_timing.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871748,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 14,
                                    "name": "转向助力液",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/14home_fule_oil.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871749,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 2,
                                    "name": "右前轮胎",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/2home_tire.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871747,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 9,
                                    "name": "机油",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/9engine_oil.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }, {
                                    "id": 871742,
                                    "score": 70,
                                    "status": "需检测",
                                    "comment": "破损程度一般，建议检测",
                                    "car_id": 45901,
                                    "type": 10,
                                    "name": "机滤",
                                    "img_url": "http://7xiqe8.com2.z0.glb.qiniucdn.com/10home_engine_oil.png",
                                    "last_update_time": "2016-07-01T01:01:01.000",
                                    "used_miles": 0
                                }]
                            }],
                            "/v1/api/meta_brands/section": [{"section": "A"}, {
                                "brand_type": 5,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png",
                                "brand_name": "阿尔法·罗密欧",
                                "logo_attachment_id": 1041,
                                "brand_pinyin": "aerfaluomiou",
                                "first_letter": "A"
                            }, {
                                "brand_type": 7,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1000.png",
                                "brand_name": "奥迪",
                                "logo_attachment_id": 1000,
                                "brand_pinyin": "aodi",
                                "first_letter": "A"
                            }, {
                                "brand_type": 6,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1028.png",
                                "brand_name": "阿斯顿·马丁",
                                "logo_attachment_id": 1028,
                                "brand_pinyin": "asidunmading",
                                "first_letter": "A"
                            }, {"section": "B"}, {
                                "brand_type": 8,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1083.png",
                                "brand_name": "宝马",
                                "logo_attachment_id": 1083,
                                "brand_pinyin": "baoma",
                                "first_letter": "B"
                            }, {
                                "brand_type": 9,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1196.png",
                                "brand_name": "保时捷",
                                "logo_attachment_id": 1196,
                                "brand_pinyin": "baoshijie",
                                "first_letter": "B"
                            }, {
                                "brand_type": 11,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2123.png",
                                "brand_name": "北京汽车",
                                "logo_attachment_id": 2123,
                                "brand_pinyin": "beijingqiche",
                                "first_letter": "B"
                            }, {
                                "brand_type": 12,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1128.png",
                                "brand_name": "奔驰",
                                "logo_attachment_id": 1128,
                                "brand_pinyin": "benchi",
                                "first_letter": "B"
                            }, {
                                "brand_type": 46,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1052.png",
                                "brand_name": "本田",
                                "logo_attachment_id": 1052,
                                "brand_pinyin": "bentian",
                                "first_letter": "B"
                            }, {
                                "brand_type": 47,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1166.png",
                                "brand_name": "标致",
                                "logo_attachment_id": 1166,
                                "brand_pinyin": "biaozhi",
                                "first_letter": "B"
                            }, {
                                "brand_type": 16,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1071.png",
                                "brand_name": "别克",
                                "logo_attachment_id": 1071,
                                "brand_pinyin": "bieke",
                                "first_letter": "B"
                            }, {
                                "brand_type": 73,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1110.png",
                                "brand_name": "比亚迪",
                                "logo_attachment_id": 1110,
                                "brand_pinyin": "biyadi",
                                "first_letter": "B"
                            }, {"section": "C"}, {
                                "brand_type": 48,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1249.png",
                                "brand_name": "长安",
                                "logo_attachment_id": 1249,
                                "brand_pinyin": "changan",
                                "first_letter": "C"
                            }, {
                                "brand_type": 49,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1262.png",
                                "brand_name": "长城",
                                "logo_attachment_id": 1262,
                                "brand_pinyin": "changcheng",
                                "first_letter": "C"
                            }, {
                                "brand_type": 50,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_3091.png",
                                "brand_name": "成功",
                                "logo_attachment_id": 3091,
                                "brand_pinyin": "chenggong",
                                "first_letter": "C"
                            }, {"section": "D"}, {
                                "brand_type": 52,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1366.png",
                                "brand_name": "道奇",
                                "logo_attachment_id": 1366,
                                "brand_pinyin": "daoqi",
                                "first_letter": "D"
                            }, {
                                "brand_type": 51,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1291.png",
                                "brand_name": "大众",
                                "logo_attachment_id": 1291,
                                "brand_pinyin": "dazhong",
                                "first_letter": "D"
                            }, {
                                "brand_type": 68,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1341.png",
                                "brand_name": "东风汽车",
                                "logo_attachment_id": 1341,
                                "brand_pinyin": "dongfengqiche",
                                "first_letter": "D"
                            }, {
                                "brand_type": 53,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1334.png",
                                "brand_name": "东南",
                                "logo_attachment_id": 1334,
                                "brand_pinyin": "dongnan",
                                "first_letter": "D"
                            }, {
                                "brand_type": 80,
                                "img_url": "http://7xiqd8.com2.z0.glb.qiniucdn.com/FuQv8AMIH4QQRtMFVHzAYGPVkC7i",
                                "brand_name": "DS",
                                "logo_attachment_id": 15780,
                                "brand_pinyin": "DS",
                                "first_letter": "D"
                            }, {"section": "F"}, {
                                "brand_type": 54,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1446.png",
                                "brand_name": "菲亚特",
                                "logo_attachment_id": 1446,
                                "brand_pinyin": "feiyate",
                                "first_letter": "F"
                            }, {
                                "brand_type": 72,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1410.png",
                                "brand_name": "丰田",
                                "logo_attachment_id": 1410,
                                "brand_pinyin": "fengtian",
                                "first_letter": "F"
                            }, {
                                "brand_type": 55,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1389.png",
                                "brand_name": "福特",
                                "logo_attachment_id": 1389,
                                "brand_pinyin": "fute",
                                "first_letter": "F"
                            }, {"section": "G"}, {
                                "brand_type": 56,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1499.png",
                                "brand_name": "广汽",
                                "logo_attachment_id": 1499,
                                "brand_pinyin": "guangqi",
                                "first_letter": "G"
                            }, {
                                "brand_type": 76,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1519.png",
                                "brand_name": "观致汽车",
                                "logo_attachment_id": 1519,
                                "brand_pinyin": "guanzhiqiche",
                                "first_letter": "G"
                            }, {"section": "H"}, {
                                "brand_type": 75,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1587.png",
                                "brand_name": "哈飞",
                                "logo_attachment_id": 1587,
                                "brand_pinyin": "hafei",
                                "first_letter": "H"
                            }, {
                                "brand_type": 28,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1535.png",
                                "brand_name": "哈弗",
                                "logo_attachment_id": 1535,
                                "brand_pinyin": "hafu",
                                "first_letter": "H"
                            }, {
                                "brand_type": 29,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1543.png",
                                "brand_name": "海马",
                                "logo_attachment_id": 1543,
                                "brand_pinyin": "haima",
                                "first_letter": "H"
                            }, {
                                "brand_type": 30,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1573.png",
                                "brand_name": "红旗",
                                "logo_attachment_id": 1573,
                                "brand_pinyin": "hongqi",
                                "first_letter": "H"
                            }, {
                                "brand_type": 31,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_3152.png",
                                "brand_name": "华颂",
                                "logo_attachment_id": 3152,
                                "brand_pinyin": "huasong",
                                "first_letter": "H"
                            }, {
                                "brand_type": 32,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1555.png",
                                "brand_name": "华泰",
                                "logo_attachment_id": 1555,
                                "brand_pinyin": "huatai",
                                "first_letter": "H"
                            }, {
                                "brand_type": 65,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1607.png",
                                "brand_name": "汇众",
                                "logo_attachment_id": 1607,
                                "brand_pinyin": "huizhong",
                                "first_letter": "H"
                            }, {"section": "J"}, {
                                "brand_type": 1,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1634.png",
                                "brand_name": "Jeep",
                                "logo_attachment_id": 1634,
                                "brand_pinyin": "Jeep",
                                "first_letter": "J"
                            }, {
                                "brand_type": 67,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1610.png",
                                "brand_name": "江淮",
                                "logo_attachment_id": 1610,
                                "brand_pinyin": "jianghuai",
                                "first_letter": "J"
                            }, {
                                "brand_type": 57,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1656.png",
                                "brand_name": "捷豹",
                                "logo_attachment_id": 1656,
                                "brand_pinyin": "jiebao",
                                "first_letter": "J"
                            }, {
                                "brand_type": 33,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2913.png",
                                "brand_name": "吉利",
                                "logo_attachment_id": 2913,
                                "brand_pinyin": "jili",
                                "first_letter": "J"
                            }, {
                                "brand_type": 74,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1686.png",
                                "brand_name": "金杯",
                                "logo_attachment_id": 1686,
                                "brand_pinyin": "jinbei",
                                "first_letter": "J"
                            }, {"section": "K"}, {
                                "brand_type": 17,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1721.png",
                                "brand_name": "凯迪拉克",
                                "logo_attachment_id": 1721,
                                "brand_pinyin": "kaidilake",
                                "first_letter": "K"
                            }, {
                                "brand_type": 10,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1732.png",
                                "brand_name": "克莱斯勒",
                                "logo_attachment_id": 1732,
                                "brand_pinyin": "kelaisile",
                                "first_letter": "K"
                            }, {"section": "L"}, {
                                "brand_type": 20,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1787.png",
                                "brand_name": "雷克萨斯",
                                "logo_attachment_id": 1787,
                                "brand_pinyin": "leikesasi",
                                "first_letter": "L"
                            }, {
                                "brand_type": 21,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1825.png",
                                "brand_name": "雷诺",
                                "logo_attachment_id": 1825,
                                "brand_pinyin": "leiluo",
                                "first_letter": "L"
                            }, {
                                "brand_type": 24,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1864.png",
                                "brand_name": "莲花",
                                "logo_attachment_id": 1864,
                                "brand_pinyin": "lianhua",
                                "first_letter": "L"
                            }, {
                                "brand_type": 25,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1837.png",
                                "brand_name": "猎豹SUV",
                                "logo_attachment_id": 1837,
                                "brand_pinyin": "liebaoSUV",
                                "first_letter": "L"
                            }, {
                                "brand_type": 23,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1804.png",
                                "brand_name": "力帆",
                                "logo_attachment_id": 1804,
                                "brand_pinyin": "lifan",
                                "first_letter": "L"
                            }, {
                                "brand_type": 63,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1757.png",
                                "brand_name": "铃木",
                                "logo_attachment_id": 1757,
                                "brand_pinyin": "lingmu",
                                "first_letter": "L"
                            }, {
                                "brand_type": 22,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1871.png",
                                "brand_name": "理念",
                                "logo_attachment_id": 1871,
                                "brand_pinyin": "linian",
                                "first_letter": "L"
                            }, {
                                "brand_type": 34,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1817.png",
                                "brand_name": "陆风",
                                "logo_attachment_id": 1817,
                                "brand_pinyin": "lufeng",
                                "first_letter": "L"
                            }, {
                                "brand_type": 35,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1778.png",
                                "brand_name": "路虎",
                                "logo_attachment_id": 1778,
                                "brand_pinyin": "luhu",
                                "first_letter": "L"
                            }, {"section": "M"}, {
                                "brand_type": 71,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1882.png",
                                "brand_name": "马自达",
                                "logo_attachment_id": 1882,
                                "brand_pinyin": "mazida",
                                "first_letter": "M"
                            }, {
                                "brand_type": 2,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1902.png",
                                "brand_name": "名爵",
                                "logo_attachment_id": 1902,
                                "brand_pinyin": "mingjue",
                                "first_letter": "M"
                            }, {
                                "brand_type": 3,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1911.png",
                                "brand_name": "MINI",
                                "logo_attachment_id": 1911,
                                "brand_pinyin": "MINI",
                                "first_letter": "M"
                            }, {"section": "N"}, {
                                "brand_type": 36,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1948.png",
                                "brand_name": "纳智捷",
                                "logo_attachment_id": 1948,
                                "brand_pinyin": "nazhijie",
                                "first_letter": "N"
                            }, {"section": "O"}, {
                                "brand_type": 38,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1967.png",
                                "brand_name": "欧宝",
                                "logo_attachment_id": 1967,
                                "brand_pinyin": "oubao",
                                "first_letter": "O"
                            }, {
                                "brand_type": 37,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1957.png",
                                "brand_name": "讴歌",
                                "logo_attachment_id": 1957,
                                "brand_pinyin": "ouge",
                                "first_letter": "O"
                            }, {
                                "brand_type": 39,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1190.png",
                                "brand_name": "欧朗",
                                "logo_attachment_id": 1190,
                                "brand_pinyin": "oulang",
                                "first_letter": "O"
                            }, {"section": "Q"}, {
                                "brand_type": 64,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2012.png",
                                "brand_name": "启辰",
                                "logo_attachment_id": 2012,
                                "brand_pinyin": "qichen",
                                "first_letter": "Q"
                            }, {
                                "brand_type": 14,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1994.png",
                                "brand_name": "奇瑞",
                                "logo_attachment_id": 1994,
                                "brand_pinyin": "qirui",
                                "first_letter": "Q"
                            }, {
                                "brand_type": 69,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1974.png",
                                "brand_name": "起亚",
                                "logo_attachment_id": 1974,
                                "brand_pinyin": "qiya",
                                "first_letter": "Q"
                            }, {"section": "R"}, {
                                "brand_type": 77,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2021.png",
                                "brand_name": "日产",
                                "logo_attachment_id": 2021,
                                "brand_pinyin": "richan",
                                "first_letter": "R"
                            }, {
                                "brand_type": 40,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2047.png",
                                "brand_name": "荣威",
                                "logo_attachment_id": 2047,
                                "brand_pinyin": "rongwei",
                                "first_letter": "R"
                            }, {"section": "S"}, {
                                "brand_type": 61,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2063.png",
                                "brand_name": "三菱",
                                "logo_attachment_id": 2063,
                                "brand_pinyin": "sanling",
                                "first_letter": "S"
                            }, {
                                "brand_type": 66,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2138.png",
                                "brand_name": "上汽通用五菱",
                                "logo_attachment_id": 2138,
                                "brand_pinyin": "shangqitongyongwuling",
                                "first_letter": "S"
                            }, {
                                "brand_type": 62,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2096.png",
                                "brand_name": "斯巴鲁",
                                "logo_attachment_id": 2096,
                                "brand_pinyin": "sibalu",
                                "first_letter": "S"
                            }, {
                                "brand_type": 41,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2083.png",
                                "brand_name": "斯柯达",
                                "logo_attachment_id": 2083,
                                "brand_pinyin": "sikeda",
                                "first_letter": "S"
                            }, {
                                "brand_type": 4,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2115.png",
                                "brand_name": "Smart",
                                "logo_attachment_id": 2115,
                                "brand_pinyin": "Smart",
                                "first_letter": "S"
                            }, {"section": "W"}, {
                                "brand_type": 70,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2143.png",
                                "brand_name": "沃尔沃",
                                "logo_attachment_id": 2143,
                                "brand_pinyin": "woerwo",
                                "first_letter": "W"
                            }, {"section": "X"}, {
                                "brand_type": 13,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2164.png",
                                "brand_name": "现代",
                                "logo_attachment_id": 2164,
                                "brand_pinyin": "xiandai",
                                "first_letter": "X"
                            }, {
                                "brand_type": 15,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2194.png",
                                "brand_name": "雪佛兰",
                                "logo_attachment_id": 2194,
                                "brand_pinyin": "xuefolan",
                                "first_letter": "X"
                            }, {
                                "brand_type": 42,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2212.png",
                                "brand_name": "雪铁龙",
                                "logo_attachment_id": 2212,
                                "brand_pinyin": "xuetielong",
                                "first_letter": "X"
                            }, {"section": "Y"}, {
                                "brand_type": 27,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2268.png",
                                "brand_name": "英菲尼迪",
                                "logo_attachment_id": 2268,
                                "brand_pinyin": "yingfeinidi",
                                "first_letter": "Y"
                            }, {
                                "brand_type": 43,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1190.png",
                                "brand_name": "一汽",
                                "logo_attachment_id": 1190,
                                "brand_pinyin": "yiqi",
                                "first_letter": "Y"
                            }, {"section": "Z"}, {
                                "brand_type": 44,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2300.png",
                                "brand_name": "中华",
                                "logo_attachment_id": 2300,
                                "brand_pinyin": "zhonghua",
                                "first_letter": "Z"
                            }, {
                                "brand_type": 78,
                                "img_url": "http://7xiqd8.com2.z0.glb.qiniucdn.com/FoLxltMD2zPuipAHBHmf-eNsyDUo",
                                "brand_name": "众泰",
                                "logo_attachment_id": 7513,
                                "brand_pinyin": "zhongtai",
                                "first_letter": "Z"
                            }, {
                                "brand_type": 45,
                                "img_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_2326.png",
                                "brand_name": "中兴",
                                "logo_attachment_id": 2326,
                                "brand_pinyin": "zhongxing",
                                "first_letter": "Z"
                            }],
                            "/v1/api/meta_categories.json": [{
                                "category_type": 38,
                                "brand_type": 5,
                                "brand_name": "阿尔法·罗密欧",
                                "category_name": "156"
                            }, {
                                "category_type": 39,
                                "brand_type": 5,
                                "brand_name": "阿尔法·罗密欧",
                                "category_name": "166"
                            }, {
                                "category_type": 40,
                                "brand_type": 5,
                                "brand_name": "阿尔法·罗密欧",
                                "category_name": "4C"
                            }, {
                                "category_type": 41,
                                "brand_type": 5,
                                "brand_name": "阿尔法·罗密欧",
                                "category_name": "Giulietta"
                            }, {"category_type": 42, "brand_type": 5, "brand_name": "阿尔法·罗密欧", "category_name": "Gtv"}],
                            "/v1/api/meta_cars.json": [{
                                "model_type": 463,
                                "brand_name": "阿尔法·罗密欧",
                                "category_name": "166",
                                "engine_displacement": "",
                                "production_year": "2003",
                                "producer": "",
                                "car_model_Name": "166 3.0 2003款",
                                "engine_oil_amount": "6.0"
                            }],
                            "/v1/api/coupons": [],
                            "/v1/api/time_segments.json": [{
                                "key": "2016-12-17 周六",
                                "data": ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]
                            }, {
                                "key": "2016-12-18 周日",
                                "data": ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]
                            }, {
                                "key": "2016-12-19 周一",
                                "data": ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]
                            }, {
                                "key": "2016-12-20 周二",
                                "data": ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]
                            }, {
                                "key": "2016-12-21 周三",
                                "data": ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]
                            }, {
                                "key": "2016-12-22 周四",
                                "data": ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]
                            }, {
                                "key": "2016-12-23 周五",
                                "data": ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"]
                            }],
                            "/v2/api/products.json": {
                                "service_type": 11,
                                "required_products": [],
                                "optional_products": [{
                                    "part_type": 9,
                                    "part_name": "机油",
                                    "products": [{
                                        "recommended": true,
                                        "price": 115.50000000,
                                        "unit": "升",
                                        "product_type": 3,
                                        "product_name": "金美孚",
                                        "labour_price": 0,
                                        "unit_count": 6,
                                        "user_defined": false,
                                        "product_categories": ["其他", "机油"]
                                    }, {
                                        "recommended": true,
                                        "price": 82.00000000,
                                        "unit": "升",
                                        "product_type": 4,
                                        "product_name": "银美孚",
                                        "labour_price": 0,
                                        "unit_count": 6,
                                        "user_defined": false,
                                        "product_categories": ["其他", "机油"]
                                    }, {
                                        "recommended": false,
                                        "price": 115.50000000,
                                        "unit": "升",
                                        "product_type": 1,
                                        "product_name": "极护",
                                        "labour_price": 0,
                                        "unit_count": 6,
                                        "user_defined": false,
                                        "product_categories": ["其他", "机油"]
                                    }]
                                }, {
                                    "part_type": 10,
                                    "part_name": "机滤",
                                    "products": [{
                                        "recommended": true,
                                        "price": 115.00000000,
                                        "unit": "",
                                        "product_type": 17,
                                        "product_name": "曼牌100",
                                        "labour_price": 0,
                                        "unit_count": 1,
                                        "user_defined": false,
                                        "product_categories": ["其他", "机滤"]
                                    }]
                                }]
                            },
                            "/v3/api/orders.json": {
                                "cur_page": 1,
                                "page_size": 5,
                                "total_size": 1,
                                "total_page": 1,
                                "items": [{
                                    "id": 29203,
                                    "products": [{
                                        "id": 57345,
                                        "disabled": false,
                                        "comment": null,
                                        "complete": false,
                                        "order_item_id": 57345,
                                        "product_type": 1116,
                                        "product_name": "普通补胎",
                                        "unit_count": 1,
                                        "price": 80.00,
                                        "labour_price": 0.00,
                                        "source_inspection": null,
                                        "total_price": 80.00,
                                        "pic_id": [],
                                        "pics": [],
                                        "complete_time": null,
                                        "keeper_id": null,
                                        "part_type": null,
                                        "user_defined": false,
                                        "product_info": "其他_轮胎_普通补胎",
                                        "product_categories": ["其他", "轮胎"],
                                        "referee_keeper_id": null,
                                        "referee_operator_id": null,
                                        "selection_mode": 1,
                                        "pay_status": 0,
                                        "required_pay": null,
                                        "source_mode": 1,
                                        "supplier_cost": 45.00,
                                        "total_supplier_cost": 45.00
                                    }, {
                                        "id": 57346,
                                        "disabled": false,
                                        "comment": null,
                                        "complete": false,
                                        "order_item_id": 57346,
                                        "product_type": 11,
                                        "product_name": "管家接车",
                                        "unit_count": 1,
                                        "price": 88.00,
                                        "labour_price": 0.00,
                                        "source_inspection": null,
                                        "total_price": 88.00,
                                        "pic_id": [],
                                        "pics": [],
                                        "complete_time": null,
                                        "keeper_id": null,
                                        "part_type": null,
                                        "user_defined": false,
                                        "product_info": "其他_服务费_管家接车",
                                        "product_categories": ["其他", "服务费"],
                                        "referee_keeper_id": null,
                                        "referee_operator_id": null,
                                        "selection_mode": 1,
                                        "pay_status": 0,
                                        "required_pay": null,
                                        "source_mode": 1,
                                        "supplier_cost": 0.00,
                                        "total_supplier_cost": 0.00
                                    }],
                                    "inspections": [],
                                    "customerEvaluated": false,
                                    "paid": false,
                                    "number": "20161216212657966",
                                    "disabled": false,
                                    "committed": true,
                                    "order_type": null,
                                    "service_type": "keeper",
                                    "peer_source": "normal",
                                    "source_order_id": null,
                                    "keeper_basics": [{
                                        "id": 36886,
                                        "type": "keeper",
                                        "name": "张鑫宇",
                                        "gender": "male",
                                        "star_count": 4,
                                        "rating": 4.0,
                                        "ID_number": "110101198309160533",
                                        "phone_number": "13717642584",
                                        "car_exp_year": 1,
                                        "avatar_img": "http://7xiz0z.com2.z0.glb.qiniucdn.com/Fs4yfrQJXFxrRs6WTIfayo-tBtXU/s1024.jpg",
                                        "current": true
                                    }],
                                    "current_keeper_id": 36886,
                                    "client_basic": {
                                        "id": 33337,
                                        "location": {
                                            "longitude": 116.481273,
                                            "latitude": 39.938564,
                                            "address": "六里屯",
                                            "name": "六里屯街道六北小区"
                                        },
                                        "phone_number": "18618128264",
                                        "name": "adadsf",
                                        "gender": null,
                                        "avatar_img": ""
                                    },
                                    "coupon": null,
                                    "car": {
                                        "id": 45901,
                                        "disabled": false,
                                        "licence": {"province": "京", "number": "Alpha"},
                                        "brand": "阿尔法·罗密欧",
                                        "category": "166",
                                        "model": "2003款  166 3.0 2003款",
                                        "number": "Alpha",
                                        "province": "京",
                                        "bought_time": "2016-07-01T01:01:01.000",
                                        "miles": 141234,
                                        "chassis_number": null,
                                        "engine_number": null,
                                        "brand_img_url": {
                                            "id": 1041,
                                            "thumbnail_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png/s250.jpg",
                                            "original_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png/s1024.jpg",
                                            "raw_url": "http://7xiqd7.com2.z0.glb.qiniucdn.com/NCB_1041.png"
                                        },
                                        "model_type": 463,
                                        "user_id": 33337,
                                        "carcare_book": null,
                                        "whole_score": null,
                                        "parts": null
                                    },
                                    "pick_time": "2016-12-17 周六",
                                    "pick_time_segment": "09:00-10:00",
                                    "pick_start_time": "2016-12-17T09:00:00.000",
                                    "pick_end_time": "2016-12-17T10:00:00.000",
                                    "place_time": "2016-12-16T21:26:57.000",
                                    "start_time": null,
                                    "end_time": null,
                                    "increase_products": [],
                                    "client_feedback": {
                                        "if_feedback_committed": false,
                                        "comment": "",
                                        "keeper_stars": 4,
                                        "order_stars": 4
                                    },
                                    "keeper_rating": 4,
                                    "order_rating": 4,
                                    "user_evaluation": "",
                                    "total_price": 168.00,
                                    "fee": 88.00,
                                    "coupon_price": 0.00,
                                    "operator": {
                                        "id": null,
                                        "name": null,
                                        "gender": null,
                                        "type": null,
                                        "avatar_img": null,
                                        "phone_number": null
                                    },
                                    "suppliers": [{
                                        "arrived": false,
                                        "name": "北京昌石汽车修理有限公司（授权服务中心）",
                                        "address": "北京市海淀区昌平路临895号-1号（北五环外，清河小营）",
                                        "longitude": 116.343801,
                                        "latitude": 40.048097,
                                        "layoff": false,
                                        "rating": 4.7,
                                        "evaluation": null,
                                        "id": 35123,
                                        "order_id": 29203,
                                        "arrived_keeper_id": null,
                                        "supplier_id": 3,
                                        "phone_number": "18910085979",
                                        "mobile_number": "",
                                        "type": "修理厂",
                                        "contact_name": "王经理",
                                        "order_supplier_rating": null,
                                        "time_score": null,
                                        "price_score": null,
                                        "service_score": null,
                                        "part_score": null,
                                        "work_score": null,
                                        "confirm_score": null,
                                        "evaluated_keeper_id": null,
                                        "attachments_id": [{
                                            "id": 44675,
                                            "thumbnail_url": "http://7xiz0z.com2.z0.glb.qiniucdn.com/FupLD9eLINjeP5LEcUV08eGQxl5y/s250.jpg",
                                            "original_url": "http://7xiz0z.com2.z0.glb.qiniucdn.com/FupLD9eLINjeP5LEcUV08eGQxl5y/s1024.jpg",
                                            "raw_url": "http://7xiz0z.com2.z0.glb.qiniucdn.com/FupLD9eLINjeP5LEcUV08eGQxl5y"
                                        }],
                                        "supplier_mold": "comprehensive"
                                    }],
                                    "order_position": null,
                                    "employee_ids": null,
                                    "comment": "",
                                    "product_comment": null,
                                    "operator_comment": null,
                                    "take_keeper_id": null,
                                    "take_time": null,
                                    "give_back_start_time": null,
                                    "give_back_time": null,
                                    "give_back_keeper_id": null,
                                    "relation_order_ids": [],
                                    "keeper_confirmed": false,
                                    "pay_types": [],
                                    "pay_type": null,
                                    "pay_type_infos": [],
                                    "sale_source": null,
                                    "pay_status": 2,
                                    "pay_status_value": "未支付",
                                    "pay_mode": 1,
                                    "order_status_key": "unconfirmed",
                                    "order_status_value": "待确认",
                                    "status": "待确认",
                                    "sale_person": null,
                                    "sale_person_id": null,
                                    "paid_price": 0.00,
                                    "not_paid_price": 168.00,
                                    "channel": "alipay_wap",
                                    "supplier_mold": "comprehensive",
                                    "refund_status": "normal",
                                    "refund_status_value": "正常",
                                    "refund_status_note": null,
                                    "order_total_supplier_cost": 45.00,
                                    "mileage_num": 0,
                                    "tyre_info": ""
                                }]
                            },
                            "/v1/api/check_reports": []
                        }[url.substr(0, -1 === url.indexOf('?') ? url.length : url.indexOf('?'))]);

                        setTimeout(function () {
                            if (0 === --app.http.count) {
                                window.parent.document.querySelector('iframe').style.height = Math.max(document.body.offsetHeight * window.mobileUtil.bodyScale, 480) + 'px';
                                // window.top.$('.iframe').getNiceScroll().resize();

                                document.body.style.cursor = 'url(hyper.cur), pointer';
                            }
                        }, 500);
                    }, 0
                );

                // url = tweaker(app.http.abort_or_hijack, app.http.get, url);
                //
                // if (url === app.http.abort) {
                //     return;
                // }
                //
                // var real_url = get_real_url(url);
                //
                // $.ajax({
                //     type: 'GET',
                //     dataType: 'json',
                //     timeout: timeout,
                //     url: real_url,
                //     beforeSend: default_header,
                //     success: function (data) {
                //         if (data && data.code === '00000') {
                //             tweaker(app.http.before_render, app.http.get, url);
                //             (tweaker(app.http.hijacker, app.http.get, url) || callBack)(data.data);
                //             tweaker(app.http.after_render, app.http.get, url);
                //         } else if (data && data.code === '20007') {
                //             yangaiche(ls.openid.login_by_opencode)();
                //         } else {
                //             console.log(data.message || JSON.stringify(data));
                //             if (failureBack) {
                //                 failureBack(data);
                //             }
                //         }
                //     },
                //     error: function (xhr, status) {
                //         console.log('服务器失败 status : ' + status);
                //     }
                // });
            };
        })
        ;

        yangaiche(app.http.post_request, function () {
            var tweaker = yangaiche(app.http.fire_tweaks);
            return function (url, param, callBack, failureBack) {

                console.log('url', url);

                app.http.count++;

                setTimeout(function () {
                    callBack({
                        "/v1/api/car_user/sign_up.json": {
                            "phone": "18618128264",
                            "userId": 33337,
                            "token": "VWIIaHrFoSWqd6rstU14dQsSmsm6pvmbhjCQHNuKc4nsBVKPYFsOCYhmIus00wrM",
                            "name": "",
                            "gender": "male",
                            "password": "",
                            "supplierId": null,
                            "supplierName": null,
                            "openid": null,
                            "user_id": 33337,
                            "phone_number": "18618128264",
                            "attachment_view": null,
                            "user_role": null
                        },
                        "/v1/api/order_preview": {"total_price": 168.00000000, "free_price": 0}
                    }[url.substr(0, -1 === url.indexOf('?') ? url.length : url.indexOf('?'))]);

                    setTimeout(function () {
                        if (0 === --app.http.count) {
                            window.parent.document.querySelector('iframe').style.height = Math.max(document.body.offsetHeight * window.mobileUtil.bodyScale, 480) + 'px';
                            window.parent.$('.iframe').getNiceScroll().resize();
                        }
                    }, 500);
                }, 0);

                // url = tweaker(app.http.abort_or_hijack, app.http.post, url);
                //
                // if (url === app.http.abort) {
                //     return;
                // }
                //
                // var real_url = get_real_url(url);
                //
                // $.ajax({
                //     type: 'POST',
                //     dataType: 'json',
                //     contentType: 'application/json',
                //     timeout: timeout,
                //     url: real_url,
                //     data: JSON.stringify(param),
                //     beforeSend: default_header,
                //     success: function (data) {
                //         if (data && data.code === '00000') {
                //             tweaker(app.http.before_render, app.http.post, url);
                //             (tweaker(app.http.hijacker, app.http.post, url) || callBack)(data.data);
                //             tweaker(app.http.after_render, app.http.post, url);
                //         } else if (data && data.code === '20007') {
                //             yangaiche(ls.openid.login_by_opencode)();
                //         } else {
                //             console.log(data.message || JSON.stringify(data));
                //             if (failureBack) {
                //                 failureBack(data);
                //             }
                //         }
                //     },
                //     error: function (xhr, status) {
                //         console.log('服务器失败 status : ' + status);
                //     }
                // });
            };
        });

        yangaiche(app.http.post_charge_request, function () {
            var tweaker = yangaiche(app.http.fire_tweaks);
            return function (url, param, callBack, failureBack) {
                var real_url = get_real_url(url);

                $.ajax({
                    type: 'POST',
                    dataType: 'text',
                    contentType: 'application/json',
                    timeout: timeout,
                    url: real_url,
                    data: JSON.stringify(param),
                    beforeSend: default_header,
                    success: function (data) {
                        var parsed_data;
                        try {
                            parsed_data = $.parseJSON(data);
                        } catch (e) {
                            parsed_data = data;
                        } finally {
                            if ('string' === typeof(parsed_data) && failureBack) {
                                failureBack(parsed_data);
                            } else if ('object' === typeof(parsed_data)) {
                                if (parsed_data.code) {
                                    if (failureBack) {
                                        failureBack(parsed_data);
                                    } else {
                                        alert('建议设置请求错误的回调');
                                    }
                                } else {
                                    tweaker(app.http.before_render, app.http.charge, url);
                                    callBack(parsed_data);
                                    tweaker(app.http.after_render, app.http.charge, url);
                                }
                            } else if (failureBack) {
                                failureBack('未能识别服务器返回参数');
                            } else {
                                alert('建议设置请求错误的回调');
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        alert(status);
                        alert(error);
                        console.log('服务器失败 status : ' + status);
                    }
                });
            };
        });

    }
    ()
)
;