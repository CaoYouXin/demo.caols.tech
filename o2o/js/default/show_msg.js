;(function () {

    'use strict';

    yangaiche(sys.load_default_module)('repository');

    app.show_msg = {
        init: 'init_show_msg',
        show: 'show_msg',
        show_agreement: 'show_agreement',

        html: '<div class="cover"></div>' +
        '<div tabindex="-1" id="yac-modal">' +
        '<div class="modal-body">' +
        '{{msg_to_show}}' +
        '</div>' +
        '</div>',

        agreement_html: '<div class="cover"></div>' +
        '<div tabindex="-1" id="yac-modal">' +
        '<div class="modal-body white fixed">' +
        '<div class="modal-title">养爱车声明协议</div>' +
        '<div class="modal-text">' +
        '<p>为保证服务安全、有序、顺利地实施，甲乙双方本着相互支持、相互理解的原则，就接送车服务达成如下协议：</p>' +
        '<p>1.甲方在甲乙双方协商约定的时间内向乙方提供车号为：（{{car_number}}）的汽车代驾接送车服务。</p>' +
        '<p>2.服务前，乙方必须出示真实有效的行驶本和商业险（车损险）及交强险保单正本。如车辆为外地牌照还需要提供真实有效的进京证等相关手续。如无法提供任何一项相关证件，服务管家有权拒绝提供代驾服务。</p>' +
        '<p>3.甲方应按指定路段进行，过程中车速不得超过限速规定。</p>' +
        '<p>4.甲方提供服务时，必须遵守国家规定的道路交通法规相关之规定。</p>' +
        '<p>5.如因管家司机不遵守交通法规，发生交通违章，由甲方及时到交通管理部门，接受处理。</p>' +
        '<p>6.如因甲方管家司机不遵守交通法规（代驾协议）而造成交通事故，由甲方承担事故责任。如将代驾车辆损坏，应首先以代驾车辆的商业及交强险进行保险理赔，甲方承担本次因保险事故造成的保费上浮及替代用车等赔偿费用。</p>' +
        '<p>7.甲方保留随时因车辆安全问题终止代驾服务的权利。</p>' +
        '<p>8.雨雪或大风等恶劣天气 甲方有权拒绝乙方的代驾请求。</p>' +
        '<p>9.服务路线由甲方划定，乙方有知情权（车辆定位）。</p>' +
        '</div>' +
        '<div class="modal-btns two">' +
        '<div class="modal-btn cancel">取消</div>' +
        '<div class="modal-btn confirm">同意</div>' +
        '</div>' +
        '</div>' +
        '</div>',

        wrapper: '<div id="msg_wrapper" style="display: none;"></div>'
    };

    yangaiche(app.show_msg.init, function () {
        var t = yangaiche(sys.$);
        return function () {
            if (t('#msg_wrapper').length > 0) {
                return true;
            }

            t('body').append(app.show_msg.wrapper);
        };
    });

    yangaiche(app.show_msg.show, function () {
        var tpl = Handlebars.compile(app.show_msg.html),
            t = yangaiche(sys.$),
            active = true;
        return function (msg, on_close) {
            if (!active) {
                return false;
            }

            var text = tpl({msg_to_show: msg});
            console.log(text);
            t('#msg_wrapper').empty().html(text);

            t('#msg_wrapper').show();

            active = false;

            function close_modal() {
                t('#msg_wrapper').hide();
                active = true;
                if ('function' === typeof(on_close)) {
                    on_close();
                }
            }

            var timeout = setTimeout(close_modal, 2000);

            t('#yac-modal').click(function () {
                clearTimeout(timeout);
                close_modal();
            });

            //alert(msg);
        };
    });

    yangaiche(app.show_msg.show_agreement, function () {
        var tpl = Handlebars.compile(app.show_msg.agreement_html),
            t = yangaiche(sys.$),
            active = true;
        return function (msg, confirm_cb) {
            if (!active) {
                return false;
            }

            var text = tpl({car_number: msg});
            console.log(text);
            t('#msg_wrapper').empty().html(text);

            t('#msg_wrapper').show();

            active = false;

            function gen_click_fn(is_confirm) {
                return function () {
                    t('#msg_wrapper').hide();
                    active = true;
                    if (is_confirm && 'function' === typeof(confirm_cb)) {
                        confirm_cb();
                    }
                };
            }

            t('#yac-modal .confirm').click(gen_click_fn(true));
            t('#yac-modal .cancel').click(gen_click_fn(false));
        };
    });

}());