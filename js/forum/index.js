/**
 * Created by cls on 2016/12/9.
 */
;(function () {

    (function gallery(el, imgEl, navEl) {
        var img = document.querySelector(el + ' ' + imgEl);

        var it = img.firstElementChild;
        var imgOffsetWidth = img.offsetWidth;
        while (it) {
            it.style.width = imgOffsetWidth + 'px';
            it = it.nextElementSibling;
        }
        img.style.width = imgOffsetWidth * img.childElementCount + 'px';

        var nav = document.querySelector(el + ' ' + navEl);
        var elemsEl = el + ' ' + navEl + ' span';
        nav.onclick = function (e) {
            if ('SPAN' === e.target.tagName) {
                var index = indexOfAndRemoveActive(e.target, elemsEl);
                e.target.classList.add('active');
                img.style.transform = 'translateX(-'+(index * imgOffsetWidth)+'px)';
            }
        };

        function indexOfAndRemoveActive(elem, elemsEl) {
            return Array.from(document.querySelectorAll(elemsEl)).reduce(function (previousValue, currentValue, currentIndex, array) {
                currentValue.classList.remove('active');
                return previousValue + (currentValue === elem ? (currentIndex + 1) : 0);
            }, -1);
        }

        function indexOfActiveAndRemoveActive(elems) {
            return elems.reduce(function (previousValue, currentValue, currentIndex, array) {
                var is = currentValue.classList.contains('active');
                currentValue.classList.remove('active');
                return previousValue + (is ? (currentIndex + 1) : 0);
            }, -1);
        }

        function indexOf(elem, elemP) {
            var index = 0, it = elemP.firstElementChild;
            while (it) {
                if (it === elem) {
                    return index;
                }
                index++;
                it = it.nextElementSibling;
            }
            return -1;
        }

        setInterval(function () {
            var elems = Array.from(document.querySelectorAll(elemsEl));
            var curIndex = indexOfActiveAndRemoveActive(elems);
            var index = (curIndex + 1) % elems.length;
            elems[index].classList.add('active');
            img.style.transform = 'translateX(-'+(index * imgOffsetWidth)+'px)';
        }, 5000);

    })('.hot-pics', 'ul', '.hot-pics-bar');

    (function hotTitles(el) {
        var category = document.querySelectorAll(el);
        for (var i = 0; i < category.length; i++) {
            var cate = category.item(i);
            var limit = cate.offsetLeft + cate.offsetWidth;

            var links = document.querySelectorAll(el + ':nth-child(' + (i + 1) + ') a'), len = links.length, j = len !== 0 ? len >>> 2 : -1, lastJ = j, tmpJ = lastJ;
            while (j) {
                var link = links.item(j);

                if (link.offsetLeft > limit) {
                    tmpJ = j;
                    lastJ = lastJ === j ? 0 : lastJ;
                    j = j !== lastJ ? (j + lastJ) >>> 1 : -1;
                    lastJ = tmpJ;
                    continue;
                }

                if (link.offsetLeft + link.offsetWidth > limit) {
                    break;
                }

                tmpJ = j;
                lastJ = lastJ === j ? len : lastJ;
                j = j !== lastJ ? (j + lastJ) >>> 1 : -1;
                lastJ = tmpJ;
            }

            if (j) {
                for (var k = j; k < len; k++) {
                    cate.removeChild(links.item(k));
                }
            }
        }
    })('.hot-names .category');

})();
