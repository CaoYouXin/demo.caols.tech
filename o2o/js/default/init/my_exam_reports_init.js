;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('user');

    yangaiche(sys.init)(function (t) {
        yangaiche(app.http.get_request)('/v1/api/check_reports?user_id=' + yangaiche(ls.user.touch)()[ls.user.user_id], function (data) {
            console.log(data);

            data.forEach(function (d) {
                d.create_time = d.create_time.substr(0, '2015-11-11'.length);
            });

            var tpl = Handlebars.compile(t('#exam_reports_tpl').text());
            t('body').append(tpl(data));

            var width_of_left = (640 - 14 - 30 - 30 - 60);
            t('.left').css('width', width_of_left + 'px');
            t('.left').find('div').css('width', width_of_left + 'px');

            t('.report-btn').click(function () {
                var id = t(this).attr('data-rel');
                yangaiche(ls.back.set_back_to_self)('my_exam_reports_detail.html?id=' + id);
            });

        });
    });

}());