'use strict';

var domain = '', api_root = '/v1/api/', dev = '', external_sale_situation = 'test';

(function () {
    var obj = $.ajax({
        url: './data.json',
        cache: false,
        async: false,
        dataType: 'json'
    });
    console.log(obj.responseJSON);
    //alert(obj.responseJSON.thisis);
    if ('dev' === obj.responseJSON.thisis) {
        dev = '/develop';
    } else if ('staging' === obj.responseJSON.thisis) {
        dev = '/staging';
    } else {
        external_sale_situation = 'production';
    }
    loadCfg('platform.json', function (platform) {
        if ('rc' === platform.platform) {
            domain = '/java/rc';
            dev = '/develop';
        }
    });
}());

var default_header = function (request) {
    request.setRequestHeader('Accept-Encoding', 'gzip');
    request.setRequestHeader('API-Client-Device-Type', loadCfg('platform.json', function (platform) {
        return conditionalReturn(platform);
    }));
    /*request.setRequestHeader('API-Access-Token', '4ANoFzcFRA4sS1okrMztxWLnxR6guEe971kcHb8TE5xUNkn68j0uKaz7MqMv53zC');*/
    //var user = getUser();
    var user = getStore().get('user_info');
    if (typeof(user) !== 'undefined' && user !== null) {
        request.setRequestHeader('API-Access-Token', user.token);
    }
    /*request.setRequestHeader('API-Access-Token', '4ANoFzcFRA4sS1okrMztxWLnxR6guEe971kcHb8TE5xUNkn68j0uKaz7MqMv53zC');*/
};


var login_by_opencode = function () {
    loadCfg('platform.json', function (platform) {
        if ('normal' === platform.platform) {
            show_login_win();
        } else if ('rc' === platform.platform) {
            show_login_win();
        } else {
            window.location.href = './open_id.html';
        }
    });
};

var show_login_win = function () {
    window.location.href = './login.html';
};

var getReqParam = function () {
    var url = location.href; //
    var theRequest = {};
    theRequest.counts = 0;
    if (url.indexOf('?') !== -1) {
        var str = url.substr(url.indexOf('?') + 1);
        var strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
            var ss = strs[i].split('=');
            theRequest[ss[0]] = ss[1];
            theRequest.counts++;
        }
    }
    return theRequest;
};

var getHashParam = function () {
    var url = location.href; //
    var theRequest = {};
    theRequest.counts = 0;
    if (url.indexOf('#') !== -1) {
        var str = url.substr(url.indexOf('#') + 1);
        var strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
            var ss = strs[i].split('=');
            theRequest[ss[0]] = ss[1];
            theRequest.counts++;
        }
    }
    return theRequest;
};

var get_real_url = function (url) {
    var real_url = api_root + url;
    if (url.indexOf('v2') >= 0) {
        real_url = url;
    }
    return domain + dev + real_url;
};

var getReq = function (url, callBack, failureBack) {
    var real_url = get_real_url(url);

    $.ajax({
        type: 'GET',
        dataType: 'json',
        timeout: 45 * 1000,
        url: real_url,
        beforeSend: default_header,
        success: function (data) {
            if (data && data.code === '00000') {
                callBack(data.data);
            } else if (data && data.code === '20007') {
                //show_login_win();
                login_by_opencode();
            } else {
                console.log(data.message);
                if (failureBack) {
                    failureBack(data);
                }
            }
        },
        error: function (xhr, status, error) {
            console.log('服务器失败 status : ' + status);
        }
    });
};

var getTemplate = function (url, callBack) {

};

var postReq = function (url, param, callBack, failureBack) {
    var real_url = get_real_url(url);

    $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        timeout: 45 * 1000,
        url: real_url,
        data: JSON.stringify(param),
        beforeSend: default_header,
        success: function (data) {
            if (data && data.code === '00000') {
                callBack(data.data);
            } else if (data && data.code === '20007') {
                //show_login_win();
                login_by_opencode();
            } else {
                console.log(data.message);
                if (failureBack) {
                    failureBack(data);
                }
            }
        },
        error: function (xhr, status, error) {
            console.log('服务器失败 status : ' + status);
        }
    });
};

var postChargeReq = function (url, param, callBack, failureBack) {
    var real_url = get_real_url(url);

    $.ajax({
        type: 'POST',
        dataType: 'text',
        contentType: 'application/json',
        timeout: 45 * 1000,
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
                //alert(typeof(parsed_data));
                if ('string' === typeof(parsed_data) && failureBack) {
                    failureBack(parsed_data);
                } else if ('object' === typeof(parsed_data)) {
                    if (parsed_data.code === '20007') {
                        if (failureBack) {
                            failureBack(parsed_data.message);
                        } else {
                            alert('建议设置请求错误的回调');
                        }
                    } else {
                        callBack(parsed_data);
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

var arrToJson = function (arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i].name] = arr[i].value;
    }
    return obj;
};

var getStore = function () {
    var store = $.AMUI.store;
    if (!store.enabled) {
        console.log('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        return null;
    }
    return store
};

var getOrder = function () {
    var order = getStore().get('order_info');
    if (typeof (order) === 'undefined' || order === null) {
        order = {};
        getStore().set('order_info', order);
    }
    return order;
};

var getLocation = function () {
    var order = getOrder();
    var location = order.location;
    if (typeof (location) === 'undefined' || location === null) {
        location = {
            latitude: 21.1,
            longitude: 21.1,
            name: '',
            address: ''
        };
        order.location = location;
    }
    return location;
};

var updateLocation = function (location) {
    var order = getOrder();
    order.location = location;
    updateOrder(order);
};

var updateOrder = function (order) {
    getStore().set('order_info', order);
};

var updateUser = function (user) {
    getStore().set('user_info', user);
    return getUser();
};

var getUser = function () {
    var userInfo = getStore().get('user_info');
    if (typeof(userInfo) === 'undefined' || userInfo === null) {
        //show_login_win();
        login_by_opencode();
    }
    return userInfo;
};

var clearOrder = function () {
    getStore().remove('order_info');
};

var updateSuccessOrder = function (data) {
    getStore().set('success_order', data);
};

var getSuccessOrder = function () {
    return getStore().get('success_order');
};

var clearSuccessOrder = function () {
    getStore().remove('success_order');
};

var getFormValues = function (id) {
    return arrToJson($('#' + id).serializeArray());
};

var copyObj = function (obj, value) {
    for (var a in value) {
        if (typeof(value[a]) === 'function') {
            continue;
        }
        obj[a] = value[a];
    }
    return obj;
};

var parseFormValue = function (id, data) {
    for (var a in data) {
        if (typeof(data[a]) === 'function') {
            continue;
        }
        var tag = $('#' + a);
        if (typeof(tag) === 'undefined' || tag === null) {
            continue;
        }
        tag.val(data[a]);
    }
};

function stripscript(s) {
    var pattern = new RegExp('[`~!@#$^&*()=|{}\':;,\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“。，、？]');
    var rs = '';
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

var disable_button = function (id) {
    var rawcss = {};
    var $2 = $('#' + id);
    rawcss.color = $2.css('color');
    rawcss.border_color = $2.css('border-color');
    rawcss.background_color = $2.css('background-color');
    getStore().set(id, rawcss);
    $2.attr({'disabled': 'disabled'});
    $2.css('background-color', '#cecece');
    $2.css('border-color', '#cecece');
    $2.css('color', '#aaaaaa');
};

var reset_button = function (id) {
    var rawcss = getStore().get(id);
    var $2 = $('#' + id);
    $2.removeAttr('disabled');
    $2.css('background-color', rawcss.background_color);
    $2.css('border-color', rawcss.border_color);
    $2.css('color', rawcss.color);
};

var format_time = function (time) {
    var timeArr = time.split('T');
    var d = timeArr[0].split('-');
    var t = timeArr[1].split(':');
    var data = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], '');
    var year = data.getFullYear();  //获取年
    var month = data.getMonth() + 1;    //获取月
    var day = data.getDate(); //获取日
    var hours = data.getHours();
    var minutes = data.getMinutes();
    var seconds = data.getUTCSeconds();
    var milliseconds = data.getUTCMilliseconds();
    time = year + '/' + paddedBits(month) + '/' + paddedBits(day) + ' ' + paddedBits(hours) + ':' + paddedBits(minutes);
    return time;
};

var paddedBits = function (val) {
    val += '';
    if (val.length === 1) {
        return '0' + val;
    }
    return val;
};

var getPayTypeInfo = function (order) {
    if (order.pay_mode) {
        if (1 === order.pay_mode) {
            return '在线支付';
        } else if (2 === order.pay_mode) {
            return '线下支付';
        }
    }
    return '线下支付';
};

var show_msg = function (msg) {
    $('#msg').text(msg);
    setTimeout(function () {
        $('#msg').text('');
    }, 3000);
    alert(msg);
};

function loadCfg(url, callback) {
    var cfg = $.ajax({
        url: url,
        cache: false,
        async: false,
        dataType: 'json'
    });
    return callback(cfg.responseJSON);
}

function conditionalReturn(platform) {
    if ('wechat' === platform.platform) {
        return 'weixin';
    } else if ('xiaomi' === platform.platform) {
        return 'xiaomi';
    } else if ('alipay' === platform.platform) {
        return 'alipay';
    } else if ('normal' === platform.platform) {
        return 'h5_normal';
    } else if ('rc' === platform.platform) {
        return 'rc';
    } else if ('mirc' === platform.platform) {
        return 'mirc';
    } else {
        alert('未识别的平台');
    }
}

function bind_openid() {
    if (getStore().get('open_id')) {
        var param = {
            openid: getStore().get('open_id'),
            open_type: loadCfg('platform.json', function (platform) {
                return conditionalReturn(platform);
            })
        };
        postReq('openid_bind.json', param, function (data) {
            console.log('绑定openID成功');
        }, function (data) {
            console.log('绑定openID失败: ' + data.message);
        });
    }
}

function get_host() {
    var host;
    var thisis = $.ajax({
        url: 'data.json',
        cache: false,
        async: false,
        dataType: 'json'
    });
    if ('dev' === thisis.responseJSON.thisis) {
        host = 'dev.yangaiche.com%2Fdeveloper%2F';
    } else if ('staging' === thisis.responseJSON.thisis) {
        host = 'dev.yangaiche.com%2Fstage%2F';
    } else {
        host = 'pay.yangaiche.com%2F';
    }
    if (host.indexOf(window.location.host) >= 0) {
        return host;
    }
    return window.location.host + '%2Fh5%2F';
}

function set_back_to_home() {
    loadCfg('platform.json', function (platform) {
        if ('wechat' === platform.platform) {
            window.history.replaceState(null, null, './home_with_products.html');
        } else {
            window.history.replaceState(null, null, './home.html');
        }
    });
}

function go_back_to_reload() {
    getStore().set('to_reload', 'T');
    window.history.back();
}

function check_reload_cmd() {
    if ('T' === getStore().get('to_reload')) {
        getStore().remove('to_reload');
        window.location.reload();
    }
}

function retry(key, mins, callback) {
    var last = getStore().get(key);
    if (!last || (Date.now() - last) / 1000 / 60 > mins) {
        getStore().set(key, Date.now());
        callback();
    } else {
        show_msg('请30分钟后重试');
    }
}
