;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');
    yangaiche(sys.load_default_module)('parameter');

    yangaiche(sys.init)(function (t) {

        var id = yangaiche(app.url_parameter).id;
        yangaiche(app.http.get_request)('/v1/api/check_reports?user_id=' + yangaiche(ls.user.touch)()[ls.user.user_id], function (data) {
            console.log(data);

            var passed = [], unpassed = [], passed_index = 1, unpassed_index = 1;

            data.forEach(function (r) {
                if (id === (r.id + '')) {
                    r.reports.forEach(function (report) {
                        if (1 === report.status) {
                            report.no = passed_index;
                            passed_index = passed_index + 1;
                            passed.push(report);
                        } else if (0 === report.status) {
                            report.no = unpassed_index;
                            unpassed_index = unpassed_index + 1;
                            unpassed.push(report);
                        }
                    });
                }
            });

            console.log(unpassed);
            console.log(passed);

            t('#unpassed_num').empty().html(unpassed.length);
            t('#passed_num').empty().html(passed.length);

            t('#unpassed_btn').click(function () {
                t('#unpassed_btn').removeClass('my-header-not-selected');
                t('#unpassed_btn').addClass('my-header-selected');
                t('#passed_btn').removeClass('my-header-selected');
                t('#passed_btn').addClass('my-header-not-selected');
                t('#unpassed').css('display', 'block');
                t('#passed').css('display', 'none');
            });

            t('#passed_btn').click(function () {
                t('#passed_btn').removeClass('my-header-not-selected');
                t('#passed_btn').addClass('my-header-selected');
                t('#unpassed_btn').removeClass('my-header-selected');
                t('#unpassed_btn').addClass('my-header-not-selected');
                t('#passed').css('display', 'block');
                t('#unpassed').css('display', 'none');
            });

            var tpl = Handlebars.compile(t('#exam_reports_tpl').text());
            t('#unpassed').append(tpl(unpassed));
            t('#passed').append(tpl(passed));

            t('.right').css('width', (640 - 110 - 30) + 'px');

            var module = t.AMUI.gallery;
            if (module && module.init) {
                module.init();
            }

            t.each(t('.my-gallery'), function (i, gallery) {
                t.each(t(gallery).find('.am-gallery-item'), function (j, gallery_item) {
                    if (j > 3) {
                        t(gallery_item).css('display', 'none');
                    }
                });
            });

        });
    });
}());