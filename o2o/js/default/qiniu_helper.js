;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');

    app.qiniu_helper = {
        token: 'qiniu_token',
        bind: 'qiniu_bind',

        expire_time: 10
    };

    yangaiche(app.qiniu_helper.token, function () {
        return function (callback) {
            var now = new Date(),
                storage = yangaiche(sys.local_storage),
                last_update = storage.get(key.qiniu.last_update);

            if (yangaiche(sys.exist)(last_update) && (now.getTime() - last_update) < 10 * 60 * 1000) {
                callback(storage.get(key.qiniu.token));
                return;
            }

            yangaiche(app.http.get_request)('/v1/api/media/uptoken.json', function (data) {
                storage.set(key.qiniu.token, data);
                storage.set(key.qiniu.last_update, now.getTime());
                callback(data);
            });
        };
    });

    yangaiche(app.qiniu_helper.bind, function () {
        return function (id, callback) {
            yangaiche(app.qiniu_helper.token)(function (token) {
                Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: id, //上传选择的点选按钮，**必需**
                    uptoken: token,
                    domain: 'http://qiniu-plupload.qiniudn.com/',
                    //bucket 域名，下载资源时用到，**必需**
                    max_file_size: '100mb',           //最大文件体积限制
                    max_retries: 3,                   //上传失败最大重试次数
                    dragdrop: true,                   //开启可拖曳上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    save_key: true,
                    //unique_names: true,				 // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    init: {
                        'FileUploaded': function (up, file, info) {
                            console.log('上传图片成功');
                            info = yangaiche(sys.$).parseJSON(info);
                            console.log(info);
                            callback(id, info);
                        },
                        'Error': function (up, err, errTip) {
                            //上传出错时,处理相关的事情
                            console.error(up);
                            console.error(err);
                            console.error(errTip);
                            alert('文件上传失败');
                        }
                    }
                });
            });
        };
    });

}());