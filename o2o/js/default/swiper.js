;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('http');

    app.swiper = {
        show: 'show_swiper'
    };

    yangaiche(app.swiper.show, function () {
        var accepted = false, startX, now_offset, is_moving = false, interval, last_intention_target, last_intention;//true for left, false for right

        var config = {}, $ = yangaiche(sys.$);

        function accept(i) {
            //                    return (i < -140) ? false : ((i > 0) ? false : i);
            //                    return i;
            return (i > 0) ? false : i;//禁止右滑动出界
        }

        function move(carinfo_btn, from, to) {
            if (from > to) {
                last_intention = true;
            } else if (from < to) {
                last_intention = false;
            } else {
                return false;
            }
            last_intention_target = to;

            var times = Math.abs(from - to) + 125;

            function get_offset(x) {
                function ifn(x) {
                    // 倍数不能小于
                    return Math.abs(Math.sin(x)) * times;
                }

                var number;
                if (last_intention) {
                    number = from - ifn(x);
                    return number >= to ? number : false;
                } else {
                    number = from + ifn(x);
                    return number <= to ? number : false;
                }
            }

            var i = Math.PI / 100, step = Math.PI / 100;
            interval = setInterval(function () {
                var offset = get_offset(i);
                console.log(offset);
                if (!offset) {
                    $(carinfo_btn).css('left', to + 'px');
                    clearInterval(interval);
                    is_moving = false;
                } else {
                    $(carinfo_btn).css('left', offset + 'px');
                    i = i + step;
                }
            }, 16);
            is_moving = true;
        }

        function panstart(e) {

            console.log('panstart');

            if (Math.abs(90 - Math.abs(e.gesture.angle)) < 50) {
                accepted = false;
                return accepted;
            }
            accepted = true;
            if (is_moving) {
                clearInterval(interval);
                is_moving = false;
            }
            startX = e.gesture.pointers[0].pageX;
            var carinfo_btn = $(this).find(config.move_btn).eq(0);
            now_offset = $(carinfo_btn).css('left');
            now_offset = parseFloat(now_offset.substr(0, now_offset.indexOf('px')));
            if (now_offset === 0) {
                $(config.move_btn).css('left', '0px');//所有地址归位
            }
        }

        function panmove(e) {

            console.log('panmove');

            if (!accepted) {
                return accepted;
            }
            var endX = e.gesture.pointers[0].pageX;
            $(this).find(config.move_btn).eq(0).css('left', accept(now_offset - (startX - endX)) + 'px');
        }

        function panend(e) {

            console.log('panend');

            if (!accepted) {
                return;
            }
            var endX = e.gesture.pointers[0].pageX;
            console.log(startX);
            console.log(endX);
            var carinfo_btn = $(this).find(config.move_btn).eq(0);
            now_offset = $(carinfo_btn).css('left');
            now_offset = parseFloat(now_offset.substr(0, now_offset.indexOf('px')));
            if (now_offset < (0 - 640 / 2)) {
                yangaiche(app.http.post_request)(config.delete_cmd, [$(this).attr('data-rel')], function () {
                    window.location.reload();
                });
            } else {
                if (now_offset === 0) {
                    $(config.move_btn).css('left', '0px');//所有地址归位
                }
                if ((startX - endX) > 0) {
                    move(carinfo_btn, now_offset, -140);
                } else if ((endX - startX) > 0) {
                    move(carinfo_btn, now_offset, 0);
                } else {
                    move(carinfo_btn, now_offset, last_intention_target);
                }
            }
        }

        return function (selector, move_btn, delete_cmd) {

            config.move_btn = move_btn;
            config.delete_cmd = delete_cmd;

            $(selector).hammer().on('panstart', panstart);

            $(selector).hammer().on('panmove', panmove);

            $(selector).hammer().on('panend', panend);
        };
    });

}());