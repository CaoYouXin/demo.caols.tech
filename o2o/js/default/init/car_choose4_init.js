;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('show_msg');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('template');
    yangaiche(sys.load_default_module)('format');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('user');

    yangaiche(sys.init)(function (t) {
        var storage = yangaiche(sys.local_storage), reqParams = yangaiche(app.url_parameter), car_model_type = null, o = null;

        if (yangaiche(sys.exist)(reqParams.update) && reqParams.update) {
            o = storage.get('car_info_m');
            car_model_type = o.model_type;
            o.img_url = o.brand_img_url.thumbnail_url;
            o.car_number = yangaiche(app.format.stripscript)(o.licence.province + o.licence.number);
        } else if (yangaiche(sys.exist)(reqParams.cmt)) {
            var model2info = storage.get('model2info');
            var brand2img = storage.get('brand2img');
            car_model_type = reqParams.cmt;
            o = model2info[car_model_type];
            o.img_url = brand2img[storage.get('selected_brand')];
            o.car_number = '京';
            o.model = o.production_year + '款&nbsp;' + o.car_model_Name;
        } else {
            throw false;
        }

        var year_data = [], month_data = [], i;
        var this_year = new Date().getFullYear();
        for (i = 15; i >= 0; i--) {
            var year = (this_year - i);
            year_data.push({ninfo: year, infos: year + '年'});
        }
        for (i = 1; i <= 12; i++) {
            if (i < 10) {
                month_data.push({ninfo: '0' + i, infos: i + '月'});
            } else {
                month_data.push({ninfo: i, infos: i + '月'});
            }
        }
        o.year_data = year_data;
        o.month_data = month_data;
        var iter = [
            '京',
            '津',
            '冀',
            '晋',
            '蒙',
            '辽',
            '吉',
            '黑',
            '苏',
            '浙',
            '皖',
            '沪',
            '闽',
            '赣',
            '鲁',
            '豫',
            '鄂',
            '湘',
            '粤',
            '桂',
            '琼',
            '渝',
            '川',
            '黔',
            '滇',
            '藏',
            '陕',
            '甘',
            '青',
            '宁',
            '新',
            '台',
            '港',
            '澳'
        ];
        t.each(iter, function (i, p) {
            iter[i] = {province: p};
        });
        o.province_data = iter;

        var tpl = Handlebars.compile(yangaiche(app.tpl.load)('template/editCarInfo.html'));
        t('body').prepend(tpl([o]));

        t('body').children().eq(0).find('.fixed-width-content').css('width', (640 - 30 - 70 - 30 - 30) + 'px');

        t('#number').unbind('keyup');
        t('#number').bind('keyup', function () {
            t('#car_number').empty().html(t('#province').val() + t(this).val());
        });

        t('#province').unbind('change');
        t('#province').bind('change', function () {
            t('#car_number').empty().html(t(this).val() + t('#number').val());
        });

        t('#pick_year').bind('click', function () {
            var prevent_default = function () {
                t('#pick_year').focus();
            };
            t('#province').bind('focus', prevent_default);
            t('#number').bind('focus', prevent_default);
            t('#miles').bind('focus', prevent_default);
            setTimeout(function () {
                t('#province').unbind('focus', prevent_default);
                t('#number').unbind('focus', prevent_default);
                t('#miles').unbind('focus', prevent_default);
            }, 1000);
        });

        t('#pick_month').bind('click', function () {
            var prevent_default = function () {
                t('#pick_month').focus();
            };
            t('#province').bind('focus', prevent_default);
            t('#number').bind('focus', prevent_default);
            t('#miles').bind('focus', prevent_default);
            setTimeout(function () {
                t('#province').unbind('focus', prevent_default);
                t('#number').unbind('focus', prevent_default);
                t('#miles').unbind('focus', prevent_default);
            }, 1000);
        });

        if (yangaiche(sys.exist)(reqParams.update) && reqParams.update) {
            o.bought_time.replace(/(\d{4})-(\d+)-\d{2}T/, function (a, year, month) {
                t('#pick_year').val(year);
                t('#pick_month').val(month);
            });
            t('#province').val(o.licence.province);
            t('#number').val(o.licence.number);
            t('#miles').val(o.miles);
        }

        t('#submit_btn').unbind('click');
        t('#submit_btn').bind('click', function () {
            var miles, year, month, number, province;

            province = t('#province').val();

            number = t('#number').val();

            year = t('#pick_year').val();
            month = t('#pick_month').val();

            miles = t('#miles').val();

            var param = [{
                user_id: yangaiche(ls.user.touch)()[ls.user.user_id],
                miles: miles,
                bought_time: year + '-' + month + '-01T01:01:01.0Z',
                licence: {
                    number: number,
                    province: province
                },
                model_type: parseInt(car_model_type),
                number: number,
                province: province
            }];

            if (yangaiche(sys.exist)(reqParams.update) && reqParams.update) {
                param[0].id = o.id;
            }

            yangaiche(app.http.post_request)('/v1/api/cars/update.json', param, function () {
                if (yangaiche(sys.exist)(reqParams.update) && reqParams.update) {
                    yangaiche(ls.back.set_back_to_his)('my_cars.html');
                } else if (yangaiche(sys.exist)(reqParams.cmt)) {
                    yangaiche(ls.back.set_back_to_his)(yangaiche(ls.back.get_parent_of)('car_choose.html'));
                }
            }, function () {
                yangaiche(app.show_msg.show)('AJAX ERROR');
            });
        });
    });
}());