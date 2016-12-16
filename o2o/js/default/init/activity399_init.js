;(function () {

    'use strict';

	yangaiche(sys.load_module)('back');

    yangaiche(sys.init)(function (t) {
        t('.btn').click(function () {
            yangaiche(ls.back.set_back_to_store)('http://pay.yangaiche.com/h5/store_item_page.html?ware_id=50');
        });

        key.external_sale_configs = {
            title: '【养爱车】车内深度净化套餐，只需399元！限时抢购！',
            desc: '霾冬来临，你需要一次彻底的爱车清洁',
            imgUrl: 'http://7xiqe8.com2.z0.glb.qiniucdn.com/logo.png'
        };

        yangaiche(sys.load_default_module)('share');
    });
}());