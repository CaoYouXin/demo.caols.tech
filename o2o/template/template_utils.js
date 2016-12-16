/**
 * Created by Administrator on 2015/5/25.
 */
var get_template = function (url, callback) {
    $.ajax({
        type: 'GET',
        dataType: 'text',
        timeout: 15 * 1000,
        url: url,
        beforeSend: default_header,
        success: callback,
        error: function (xhr, status, error) {
            console.log('服务器失败 status : ' + status + '错误 error :　' + error);
        }
    });
};

var template = function (url, ele_selector, mode, data, before, before_param, after, after_param, debugging) {
    if (undefined === debugging) {debugging = false;}

    if (typeof(eval(before))=="function") {
        if (debugging) {console.log('running before');}
        before(before_param);
    }

    if (debugging) {console.log('running in mode['+mode+']');}
    get_template(url, function (template_data) {
        if (debugging) {console.log(template_data);}
        var template = Handlebars.compile(template_data);
        if ('full-fill' == mode) {
            $(ele_selector).empty().html(template(data));
        } else if ('prepend' == mode) {
            $(ele_selector).prepend(template(data));
        } else if ('append' == mode) {
            $(ele_selector).append(template(data));
        }
        if (typeof(eval(after))=="function") {
            if (debugging) {console.log('running after');}
            after(after_param);
        }
    });
};
