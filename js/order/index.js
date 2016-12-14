/**
 * Created by cls on 2016/12/10.
 */
;(function () {

    (function scroll(links) {
        if (links.length <= 0) {
            return false;
        }

        var base = 2, exponent = 4;

        function constant(x) {
            return function () {
                return x;
            };
        }

        function raise(x, exponent) {
            return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
        }

        function deinterpolate(a, b) {
            return (b = raise(b, exponent) - (a = raise(a, exponent)))
                ? function (x) {
                return (raise(x, exponent) - a) / b;
            }
                : constant(b);
        }

        function reinterpolate(a, b) {
            b = raise(b, exponent) - (a = raise(a, exponent));
            return function (t) {
                return raise(a + b * t, 1 / exponent);
            };
        }

        function interpolatePow(a, b) {
            var num = Math.abs(a - b) / base;
            return function (t) {
                t = t > 1 ? 1 : t;
                var number = raise(base, t) * num;
                return a < b ? a + number : a - number;
            };
        }

        function interpolateLinear(a, b) {
            return function(t) {
                t = t > 1 ? 1 : t;
                return a + (b - a) * t;
            };
        }

        function moveTo(num) {
            console.log(num);

            var len = 1000, i = 0;
            var now = document.body.scrollTop || document.documentElement.scrollTop || 0;
            var r = reinterpolate(now, num);
            var d = deinterpolate(0, len);
            // var mid = (now + num) * .3;
            // var int1 = interpolateLinear(now, mid);
            // var int2 = interpolatePow(mid, num);

            // console.log(int2(1));

            var interval = setInterval(function () {
                var set = r(d(Math.min(i += 24, len)));
                // var d = i += 24 / len;
                // var set = d < .3 ? int1(d) : int2(d);
                // console.log(set);
                document.body.scrollTop = set;
                document.documentElement.scrollTop = set;
                if (set === num) {
                    clearInterval(interval);
                }
            }, 24, 0);
        }

        // var windowHeight = document.getElementsByClassName('banner').item(0).offsetHeight;
        // var footer = document.getElementsByTagName('footer').item(0);

        links.item(0).parentNode.addEventListener('click', function (e) {
            if (e.target === this) {
                return false;
            }

            if (e.target.getAttribute('href').substr(0, 1) !== '#') {
                return true;
            }

            e.preventDefault();

            var id = e.target.getAttribute('href').substr(1);
            var elementById = document.getElementById(id);

            moveTo((elementById.offsetTop - 80)/* * windowHeight / (footer.offsetTop + footer.offsetHeight)*/);
        }, false);
    })(document.querySelectorAll('.links > a'));

    (function onScroll() {
        var last_known_scroll_position = 0;
        var ticking = false;
        var once = {
            _625: false,
            _296: false
        };

        function doSomething(scroll_pos) {
            // do something with the scroll position

            if (scroll_pos > 80) {
                document.getElementsByTagName('header').item(0).classList.add('solid');
            } else {
                document.getElementsByTagName('header').item(0).classList.remove('solid');
            }

            var i, arr;
            if (scroll_pos > 625 && !once._625) {
                once._625 = true;
                for (i = 0, arr = document.querySelectorAll('.pros > *:nth-child(2) > .wrapper > .pro'); i < arr.length; i++) {
                    setTimeout(function(node) {
                        node.classList.remove('stage');
                    }, i * 220, arr.item(i));
                }
            }

            if (scroll_pos > 296 && !once._296) {
                once._296 = true;

                var elem = document.querySelector('.intro > .wrapper > a');
                for (arr = new Array(10), i = arr.length; i >= 0; i--) {
                    setTimeout(function(d) {
                        elem.style.transform = 'rotate(' + d + 'deg)';
                    }, (10 - i) * 100, i % 2 === 0 ? -i : i);
                }
            }
        }

        window.addEventListener('scroll', function(e) {
            last_known_scroll_position = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    doSomething(last_known_scroll_position);
                    ticking = false;
                });
            }
            ticking = true;
        });
    })();

})();
