;(function () {
    'use strict';

    //yangaiche(sys.load_module)();
    yangaiche(sys.load_default_module)('location');
    yangaiche(sys.load_default_module)('back');

    console.log(parseFloat(0));

    /**********************************************************/
    /*红黑树(平衡树)排序                                      */
    /**********************************************************/
    var red = 1;
    var black = 0;

    //结点
    function RB_Node(val) {
        this.left = null;                  //左结点
        this.right = null;                  //右结点
        this.parent = null;                 //父结点

        this.color = red;                   //结点的颜色

        this.value = val.value;             //值结点
        this.target = val;

        //取得叔父结点
        this.Uncle = function () {
            if (this.parent == this.Grandpa().left) return this.Grandpa().right;

            return this.Grandpa().left;
        };

        //取得祖父结点
        this.Grandpa = function () {
            return this.parent.parent;
        };
    }

    //树
    function RB_Tree() {
        this.header = null;          //头结点
        this.output_string = "";

        //插入结点
        this.InsertNode = function (val) {
            var node = new RB_Node(val);
            var target_pos = this.header;

            var parent = null;
            var be_in_left = true;

            //查找插入位置
            while (null != target_pos) {
                parent = target_pos;
                if (this.compare(node, target_pos))   //插入右树
                {
                    target_pos = target_pos.right;
                    be_in_left = false;
                }
                else                      //插入左子树
                {
                    target_pos = target_pos.left;
                    be_in_left = true;
                }
            }

            node.parent = parent;

            if (parent) {
                if (be_in_left) {
                    //alert(val + "插到" + parent.value + "的左子树");
                    parent.left = node;
                } else {
                    //alert(val + "插到" + parent.value + "的右子树");
                    parent.right = node;
                }
            }
            else {
                this.header = node;
            }

            //调整颜色值或结构
            this.adjustPath(node);
        };

        this.compare = function (l, r) {
            return parseFloat(l.value) > parseFloat(r.value);
        };

        this.adjustPath = function (node) {
            var w = null;
            //var s = "node =" + node + "; header = " + this.header + "node == header is " + (node == this.header);
            //s += "/r/n node.value=" + node.value + ", node.parent = " + node.parent;
            //if (node.parent != null)
            //    s += "node.parent.color = " + node.parent.color;
            //alert(s);

            while (node != this.header && node.parent.color == red) {
                //alert("going...");
                //如果为左子树
                if (node.parent == node.Grandpa().left) {
                    //alert("going...1a");
                    w = node.Uncle();
                    if (w != null && red == w.color)   //如果叔父结点为红色的，则只需将叔父和父结点置为黑色，祖父结点置为红色，然后祖父结点的父结点可能为红色，则违反了规则，需要继续调整
                    {
                        //alert("going...1b");
                        w.color = black;
                        node.parent.color = black;
                        node.Grandpa().color = red;
                        node = node.Grandpa();
                    }
                    else {
                        //如果node为右子树
                        if (node == node.parent.right) {
                            //alert("going...1c");
                            node = node.parent;

                            //alert("before roate_left node = " + node.value + " node.parent = " + node.parent.value + " node.Grandpa().value = "+node.Grandpa().value)
                            this.rotate_left(node);
                            // alert("after roate_left node = " + node.value + " node.parent = " + node.parent.value + " node.Grandpa().value = "+node.Grandpa().value)
                        }

                        //alert("going...1d");
                        node.parent.color = black;
                        node.Grandpa().color = red;
                        //alert("before roate_right node = " + node.value + " node.Grandpa() = " + node.Grandpa().value)
                        this.rotate_right(node.Grandpa());
                        //alert("after roate_left node = " + node.value + " node.parent = " + node.parent.value)
                    }
                }
                else      //为右子树
                {
                    //alert("going...2a");

                    w = node.Uncle();

                    if (w != null && red == w.color)   //如果叔父结点为红色的，则只需将叔父和父结点置为黑色，祖父结点置为红色，然后祖父结点的父结点可能为红色，则违反了规则，需要继续调整
                    {
                        //alert("going...2b");
                        w.color = black;
                        node.parent.color = black;
                        node.Grandpa().color = red;
                        node = node.Grandpa();
                    }
                    else {
                        //如果node为右子树
                        if (node == node.parent.left) {
                            //alert("going...2c");
                            node = node.parent;
                            this.rotate_right(node);
                        }

                        //alert("going...2d");

                        node.parent.color = black;
                        node.Grandpa().color = red;
                        this.rotate_left(node.Grandpa());
                    }
                }
            }

            this.header.color = black;
        };

        //输出
        this.Traverse = function () {
            var array = [];
            this.traverse_tree(array, this.header);
            return array;
        };

        this.traverse_tree = function (array, node) {
            if (node == null) return;

            this.traverse_tree(array, node.left);

            //this.output_string += node.value + " ";
            array.push(node.target);

            this.traverse_tree(array, node.right);
        };

        //左旋转结点
        this.rotate_left = function (node) {
            var parent = node.parent;
            var right = node.right;

            //alert("in rotate_left " + right);// + " right.left" + right.left + "right.right" + right.right);

            var rleft = right.left;


            //将node子树作为右子树的左子树,并将右子树的左子树做为node的右子树
            right.left = node;
            node.parent = right;
            node.right = rleft;

            //将右子树代替node
            if (parent != null) {
                if (node == parent.left)  //如果原来是左子树
                    parent.left = right;
                else
                    parent.right = right;
            }
            right.parent = parent;

            //将右子树的原左子树挂到原root下
            if (rleft)
                rleft.parent = node;
            if (parent == null)
                this.header = right;
        };


        //右旋转结点
        this.rotate_right = function (node) {
            var parent = node.parent;
            var left = node.left;
            //alert("in rotate_right: node.value" + node.value + " left = " + left);// + " right.left" + right.left + "right.right" + right.right);
            var lright = left.right;

            //将node挂到左子树的右子树
            left.right = node;
            node.parent = left;
            node.left = lright;
            //将左子树代替node
            if (parent)
                if (parent.left == node)
                    parent.left = left;
                else
                    parent.right = left;
            left.parent = parent;
            //将左子树的原右子树挂到原root下
            if (lright)
                lright.parent = node;
            if (parent == null)
                this.header = left;
        }
    }

    yangaiche(sys.init)(function (t) {
        // 定义变量

        // 功能代码
        yangaiche(ls.location.set)({});
        
        // t('#result').height(t(window).height() - 460);
        var opts = {
            direction: 'vertical',
            //scrollbar: '.swiper-scrollbar',
            slidesPerView: 'auto',
            slidesPerColumnFill: 'row',
            scrollbarHide: false,
            centeredSlides: false,
            spaceBetween: 0,
            grabCursor: true,
            freeMode: false,
            observer: true
        };
        var swiper = new Swiper('.swiper-container', opts);

        var map = new BMap.Map('map', {minZoom: 15, maxZoom: 18});            // 创建Map实例
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 18);
        map.setCurrentCity('北京市');

        var myKeys = ['地标', '小区', '停车场', '道路'];
        var bounds = map.getBounds();
        var radius = map.getDistance(
            new BMap.Point(bounds.Ee, bounds.De),
            new BMap.Point(bounds.Ee, bounds.Ie)
        );
        console.log(radius);
        var page_gapacity = 30;
        var local = new BMap.LocalSearch(map, {
            renderOptions: {map: map, autoViewport: false, selectFirstResult: false},
            pageCapacity: page_gapacity,
            onSearchComplete: function (data) {
                var precessed_data = new RB_Tree();
                var center = map.getCenter();
                t.each(data, function (j, ah) {
                    t.each(ah.wr, function (i, datum) {
                        datum.value = map.getDistance(center, datum.point);
                        precessed_data.InsertNode(datum);
                    });
                });
                var traverse = precessed_data.Traverse();
                console.log(traverse);

                var tpl_fn = Handlebars.compile(t('#location_selector_tpl').text());
                var e = tpl_fn(traverse);
                console.log('locs', e);
                t('#result').html(e);
                swiper.update();

                setTimeout(function () {
                    window.top.document.querySelector('iframe').style.height = document.body.offsetHeight * window.mobileUtil.bodyScale + 'px';
                    window.top.$('.iframe').getNiceScroll().resize();
                }, 500);
            },
            onMarkersSet: function (array) {
                for (var i = 0; i < array.length; i++) {
                    var obj = array[i];
                    obj.marker.hide();
                }
            }
        });
        local.searchNearby(myKeys, map.getCenter(), radius);

        function research() {
            local.searchNearby(myKeys, map.getCenter(), radius);
        }

        map.addEventListener('dragend', research);
        map.addEventListener('touchend', research);

        t('#result').on('click', '.line', function () {
            var $this = t(this);

            yangaiche(ls.location.set)({
                longitude: $this.attr('data-longitude'),
                latitude: $this.attr('data-latitude'),
                name: $this.children('.text').text().replace(/(^\s*)|(\s*$)/g, ''),
                address: $this.children('.subtext').text().replace(/(^\s*)|(\s*$)/g, '')
            });

            yangaiche(ls.back.set_back_to_his)(yangaiche(ls.back.get_parent_of_this)());
        });

        // 添加定位控件
        var geolocationControl = new BMap.GeolocationControl(/*{enableAutoLocation: true}*/);
        geolocationControl.addEventListener("locationSuccess", function (e) {
            // 定位成功事件
            local.searchNearby(myKeys, e.point, radius);
            map.setCenter(e.point);
        });
        geolocationControl.addEventListener("locationError", function (e) {
            // 定位失败事件
            alert(e.message);
        });
        map.addControl(geolocationControl);
        geolocationControl.location();

        var autoComplete = new BMap.Autocomplete({
            location: '北京市',
            input: 'search_input',
            onSearchComplete: function (e) {
                console.log(e);
            }
        });

        var locator = new BMap.LocalSearch(map, {
            onSearchComplete: function (data) {
                if (data.wr.length > 0) {
                    var point = data.wr[0].point;
                    local.searchNearby(myKeys, point, radius);
                    map.setCenter(point);
                }
            }
        });

        autoComplete.addEventListener('onconfirm', function (e) {
            var _value = e.item.value,
                location = _value.province + _value.city + _value.district + _value.street + _value.streetNumber + _value.business;
            locator.search(location);
        });

        t('#search button').click(function () {
            locator.search(t('#search_input').val());
        });
    });
}());
