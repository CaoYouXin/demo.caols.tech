/**
 * Created by cls on 2016/12/12.
 */
;(function () {

    (function closeTopAnnouncement() {
        document.querySelector('.top-announcement > .close').onclick = function (e) {
            var topAnnouncementElem = e.target.parentNode;
            topAnnouncementElem.parentNode.removeChild(topAnnouncementElem);
        };
    })();

    (function pager() {
        var nodeList = document.querySelectorAll('.page-count > ul');

        function contains(node) {
            return Array.from(nodeList).some(function (item) {
                return node === item;
            })
        }

        document.addEventListener('click', function(e) {
            var target = e.target;
            var parentNode = target.parentNode;
            if (target.tagName === 'A' && parentNode.classList.contains('page-count')) {
                parentNode.classList.add('show');
                var interval = setInterval(function () {
                    if (parentNode.offsetLeft) {
                        parentNode.classList.add('animation');
                        clearInterval(interval);
                    }
                }, 1);
            }

            if (target.tagName === 'LI' && contains(parentNode)) {
                parentNode.parentNode.firstElementChild.value = target.textContent;
                change(target.textContent);
                parentNode.parentNode.classList.remove('animation');
                parentNode.parentNode.classList.remove('show');
            }
        }, false);

        function change(newV) {
            console.log(+newV);
        }

        document.addEventListener('change', function (e) {
            change(e.target.value);
        }, false);
    })();

})();
