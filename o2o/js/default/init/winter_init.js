;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('back');

    yangaiche(sys.init)(function (t) {
        t('#go_to_buy').click(function () {
            yangaiche(ls.back.set_back_to_store)('store_item_page.html?ware_id=42');
        });
    });

}());