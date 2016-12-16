;(function () {

    'use strict';

//old_service_start根据文件名设置goto参数，用在car_list.html中选车后的跳转。
//此外，清空order对象。
	yangaiche(sys.load_default_module)('order');
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('back');

    app.old_service = {
        config: {
            butler_pick_service: 'butler_pick_service_choose_product.html',
            car_beauty_service: 'car_beauty_service_product_info.html',
            home_testing_service: 'home_testing_service_product_info.html',
            renewal_service: 'renewal_service_product_info.html',
            set_loss_service: 'set_loss_service_product_info.html',
            vehicle_exam_service: 'vehicle_exam_service_product_info.html'
        }
    };

    yangaiche(sys.init)(function (t) {
        t('#submit_btn').click(function () {
            app.old_service.key = window.location.href.match(/\/.*\/(.*?)\.html/)[1];

            yangaiche(sys.local_storage).set(key.goto.car_list, app.old_service.config[app.old_service.key]);

            var location = yangaiche(ls.location.touch)();
            yangaiche(ls.order.clear)();
            yangaiche(ls.location.set)(location);

            yangaiche(ls.back.set_back_to_self)('car_list.html');
        });
    });

}());