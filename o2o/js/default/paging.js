;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');

    app.paging = {
        setup: 'paging_setup',
        recover: 'paging_recover',
        save: 'paging_save',
        load_suc: 'paging_load_suc',
        load_more: 'paging_load_more',

        page: 1,
        total_size: 0,
        real_total_size: 0,
        page_size: parseInt(yangaiche(sys.$)(window).height() / 172) + 1,
        active: true,
        url_request: null,
        data_handler: null,

        data: {
            items: []
        }
    };

    yangaiche(app.paging.load_suc, function () {
        return function (data, callback) {
            if (data.items.length > 0) {
                app.paging.data_handler(data);

                app.paging.page = parseInt(data.cur_page) + 1;
                app.paging.total_size = parseInt(data.total_size);
                app.paging.real_total_size += data.items.length;

                for (var i = 0; i < data.items.length; i++) {
                    app.paging.data.items.push(data.items[i]);
                }

                if (callback !== undefined && callback !== null) {
                    callback();
                }
            }
        };
    });

    yangaiche(app.paging.load_more, function () {
        var load_suc = yangaiche(app.paging.load_suc),
            getReq = yangaiche(app.http.get_request),
            show_msg = yangaiche(app.show_msg.show);

        return function () {
            var progress = $.AMUI.progress;
            progress.start();
            getReq(app.paging.url_request + '&total_size=' + app.paging.total_size + '&page=' + app.paging.page + '&page_size=' + app.paging.page_size, function (data) {
                load_suc(data);
                progress.done();
                app.paging.active = true;
            }, function (error) {
                show_msg(error.message);
            });
        };
    });

    yangaiche(app.paging.setup, function () {
        var load_suc = yangaiche(app.paging.load_suc),
            load_more = yangaiche(app.paging.load_more),
            getReq = yangaiche(app.http.get_request),
            show_msg = yangaiche(app.show_msg.show),
            t = yangaiche(sys.$);

        return function (config) {

            app.paging.data_handler = config.data_handler;
            app.paging.url_request = config.url_request;

            app.paging.page_size = config.page_size || app.paging.page_size;

            var progress = $.AMUI.progress;
            progress.start();
            app.paging.active = false;

            getReq(app.paging.url_request + '&page=' + app.paging.page + '&page_size=' + app.paging.page_size, function (data) {
                load_suc(data, function () {
                    t('body').hammer().on('panup', function () {
                        if (app.paging.active) {
                            var $this = t(this),
                                viewH = t(window).height(),//可见高度
                                contentH = $this.get(0).scrollHeight,//内容高度
                                scrollTop = $this.scrollTop();//滚动高度
                            if (scrollTop / (contentH - viewH) >= 0.95) { //快到达底部时,加载新内容
                                // 这里加载数据..
                                if (app.paging.real_total_size === app.paging.total_size) {
                                    show_msg('没有更多了! ');
                                } else {
                                    app.paging.active = false;
                                    setTimeout(load_more, 0);
                                }
                            }
                        }
                    });
                });
                progress.done();
                app.paging.active = true;
            }, function (error) {
                show_msg(error.message);
            });
        };
    });

    yangaiche(app.paging.save, function () {
        return function () {
            yangaiche(sys.local_storage).set(key.snapshot.order_list, app.paging);
        };
    });

    yangaiche(app.paging.recover, function () {
        var load_suc = yangaiche(app.paging.load_suc),
            load_more = yangaiche(app.paging.load_more),
            show_msg = yangaiche(app.show_msg.show),
            t = yangaiche(sys.$);

        return function (data_handler) {
            var obj = yangaiche(sys.local_storage).get(key.snapshot.order_list);
            app.paging.data_handler = data_handler;
            app.paging.url_request = obj.url_request;
            app.paging.page = obj.page;
            app.paging.total_size = obj.total_size;
            app.paging.real_total_size = 0;
            app.paging.page_size = obj.page_size;
            app.paging.active = obj.active;
            obj.data.cur_page = app.paging.page - 1;
            obj.data.total_size = app.paging.total_size;
            load_suc(obj.data, function () {
                t('body').hammer().on('panend', function () {
                    if (app.paging.active) {
                        var $this = t(this),
                            viewH = t(window).height(),//可见高度
                            contentH = $this.get(0).scrollHeight,//内容高度
                            scrollTop = $this.scrollTop();//滚动高度
                        if (scrollTop / (contentH - viewH) >= 0.95) { //快到达底部时,加载新内容
                            // 这里加载数据..
                            if (app.paging.real_total_size === app.paging.total_size) {
                                show_msg('没有更多了! ');
                            } else {
                                setTimeout(load_more, 1);
                            }
                        }
                    }
                });
            });
        };
    });

}());