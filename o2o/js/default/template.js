;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('show_msg');

    app.tpl = {
        load: 'load_template'
    };

    yangaiche(app.tpl.load, function () {
        return function (url) {
            var text = null;
            $.ajax({
                type: 'GET',
                dataType: 'text',
                timeout: 15 * 1000,
                url: url,
                async: false,
                success: function (template_data) {
                    text = template_data;
                },
                error: function (xhr, status, error) {
                    yangaiche(app.show_msg.show)('服务器失败 status : ' + status + '错误 error :　' + error);
                }
            });
            return text;
        };
    });

}());