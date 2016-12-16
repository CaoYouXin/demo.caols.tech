;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('parameter');
    yangaiche(sys.load_default_module)('back');
    yangaiche(sys.load_default_module)('show_msg');

    yangaiche(sys.init)(function (t) {
        t('.star-group img').bind('click', function () {
            var children = t(t(this).parents()[0]).children('img');
            children.attr('src', 'http://baseimg.yangaiche.com/comment_gray_star.png');
            var rate = parseInt(t(this).attr('data-rel'));
            for (var i = 0; i < rate; i++) {
                children.eq(i).attr('src', 'http://baseimg.yangaiche.com/comment_star.png');
            }
        });

        var show_msg = yangaiche(app.show_msg.show);

        t('#submit_button').click(function () {
            var keeper_rate = t('#keeper img[src="http://baseimg.yangaiche.com/comment_star.png"]').length;
            var service_rate = t('#service img[src="http://baseimg.yangaiche.com/comment_star.png"]').length;

            yangaiche(app.http.post_request)('/v1/api/feedback', {
                client_feedback: {
                    comment: t('#comment-text').val(),
                    keeper_stars: keeper_rate,
                    order_stars: service_rate
                },
                order_id: yangaiche(app.url_parameter).order_id
            }, function (data) {
                if (data.if_feedback_committed) {
                    yangaiche(ls.back.set_back_to_his)('order_list.html');
                } else {
                    show_msg('提交评价失败!');
                }
            }, function (error) {
                show_msg(error.message);
            });
        });
    });

}());