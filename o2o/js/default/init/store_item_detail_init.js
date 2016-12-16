;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('repository');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {
        var device_width = t(window).width();

        //var raw_data = '{"data":{"ware_type_id":1,"ware_status":"down_shelves","ware_id":1,"introduction_imgs":[{"img_id":1052,"img_index":0,"original_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg/s1024.jpg","raw_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg","thumbnail_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg/s250.jpg"}],"ware_full_price":3232,"ware_type_name":"室内清洗","cover_img_id":1052,"product_id":2,"product_info":"机油-磁护","ware_mark_price":94.5,"ware_name":"室内清洗","brief_introduction":"简介备注","cover_img":{"thumbnail_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg/s250.jpg","img_index":0,"img_id":1052,"original_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg/s1024.jpg","raw_url":"http://7xiqd7.com2.z0.glb.qiniucdn.com/1052.jpg"},"ware_products":[{"product_price":94.5,"product_id":2,"product_name":"磁护","product_category":"机油"}]},"code":"00000"}';
        //var data = JSON.parse(raw_data).data;

        yangaiche(app.http.get_request)('/v2/api/store/ware/detail.json?ware_id=' + yangaiche(app.url_parameter).ware_id, function (data) {
            var wrapper_width = device_width - 40;
            data.cover_img.raw_url = data.cover_img.raw_url + '?imageView2/3/w/' + parseInt(wrapper_width) + '/h/' + parseInt(wrapper_width / 16 * 9) + '/interlace/1';
            t.each(data.introduction_imgs, function (i, img) {
                img.raw_url = img.raw_url + '?imageView2/3/w/' + parseInt(wrapper_width) + '/h/' + parseInt(wrapper_width / 16 * 9) + '/interlace/1';
            });

            var tpl = Handlebars.compile(t('#store_item_detail_tpl').text());
            t('body').prepend(tpl(data));

            var store_item_detail_img_width = t('#store-item-detail-img img').width();
            var store_item_detail_img_height = store_item_detail_img_width / 16 * 9;
            t('#store-item-detail-img img').height(store_item_detail_img_height);

            var store_item_detail_img_spec = t('#store-item-detail-img div');
            store_item_detail_img_spec.width(store_item_detail_img_width);
            store_item_detail_img_spec.css('top', (store_item_detail_img_height - store_item_detail_img_spec.height()) + 'px');
        }, function (error) {
            yangaiche(app.show_msg.show)(error.message);
        });
    });
}());