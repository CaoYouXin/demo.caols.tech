;(function () {

    'use strict';

	yangaiche(sys.load_default_module)('qiniu_helper');
    yangaiche(sys.load_default_module)('activity_comp_editor');
    yangaiche(sys.load_default_module)('http');
    yangaiche(sys.load_default_module)('form');
    yangaiche(sys.load_default_module)('obj_util');

    yangaiche(sys.init)(function (t) {
        var do_nothing_ret_false = function () {
            return false;
        };
        t('#sth-on-the-dimmer').click(do_nothing_ret_false).mousedown(do_nothing_ret_false);

        function show_delete($component) {
            var $delete_comp_btn = t('#sth-on-the-control');

            if ('placeholder' === $component.attr('data-tpl')) {
                hide_delete();
                return;
            }

            $delete_comp_btn.css('left', ($component.offset().left - 30) + 'px');
            $delete_comp_btn.css('top', $component.offset().top + 'px');

            $delete_comp_btn.attr('data-rel', $component.attr('id'));

            $delete_comp_btn.css('display', 'block');

            $delete_comp_btn.unbind('click').click(function () {
                var confirm_delete_comp = confirm('确定删除么？');
                if (confirm_delete_comp) {
                    yangaiche(app.activity_comp_editor.delete_comp)(t(this).attr('data-rel'));
                    hide_delete();
                }
            });
        }

        function hide_delete() {
            t('#sth-on-the-control').css('display', 'none');
        }

        function bind_delete() {
            t('#editor .component')
                .unbind('mouseenter')
                .unbind('mousemove')
                .mouseenter(function () {
                    show_delete(t(this));
                })
                .mousemove(function () {
                    show_delete(t(this));
                });
            t('#right').unbind('scroll').scroll(hide_delete);
        }

        function post_handler(id, data_tpl, data) {
            if ('image' === data_tpl) {
                var $source = data;
                yangaiche(app.qiniu_helper.bind)(id, function (source, data) {
                    $source.background = 'url("' + data.data.raw_url + '") no-repeat center';
                    var image = new Image();
                    image.src = data.data.raw_url;
                    image.onload = function () {
                        $source.height = (image.height);
                        $source.inner_html = '';
                        yangaiche(app.activity_comp_editor.refresh)();
                    };
                });
            }
        }

        function place_a_comp(e, $sth_top) {
            var done = false;

            function _place($comp) {
                if (!done) {
                    var id = parseInt($comp.attr('id').match(/editor_component_(\d+)/)[1]);
                    var data_tpl = $sth_top.attr('data-tpl');

                    yangaiche(app.activity_comp_editor.insert_before)(id, data_tpl, post_handler);

                    done = true;
                }
            }

            t.each(t('#editor').find('.component'), function (i, comp) {
                var $comp = t(comp);
                if (!done && ($comp.offset().top + $comp.height()) > e.pageY) {
                    _place($comp);
                }
            });

            t('body').unbind('mousemove').unbind('mouseup');
            $sth_top.remove();
        }

        function pick_a_comp(e) {
            if (!yangaiche(sys.exist)(app.activity_comp_editor.current_js_suit)) {
                alert('请先选择一个JS套件');
                return;
            }

            var suitable_js_suits = app.activity_comp_editor.comp_tpls[t(this).attr('data-tpl')].suitable_js_suits;
            var current_js_suit = parseInt(app.activity_comp_editor.current_js_suit);
            var fit = false;
            t.each(suitable_js_suits, function (i, js_suit) {
                if (js_suit === current_js_suit) {
                    fit = true;
                }
            });
            if (!fit) {
                alert('当前套件不支持该组件');
                return;
            }

            t('body').append('<div id="sth-on-the-top"></div>');

            var $this = t(this),
                width = $this.width(),
                height = $this.css('padding-bottom').match(/(\d+)/)[1],
                $sth_top = t('#sth-on-the-top');
            $sth_top.width(width);
            $sth_top.height(height);
            $sth_top.css('background', $this.css('background'));
            $sth_top.html($this.html());

            console.log($sth_top);

            $sth_top.attr('data-tpl', $this.attr('data-tpl'));

            function stick(e) {
                $sth_top.css('left', (e.pageX - width / 2) + 'px');
                $sth_top.css('top', (e.pageY - height / 2) + 'px');
            }

            stick(e);

            $sth_top.css('display', 'block');

            t('body').mousemove(stick);

            t('body').mouseup(function (e) {
                place_a_comp(e, $sth_top);
            });
        }

        function unimplemented() {
            alert('还没有实现');
            return false;
        }

        t('#js-suit-list-add').click(unimplemented);
        t('#comp-list-add').click(unimplemented);

        yangaiche(app.activity_comp_editor.init)(t('#comp-list'), t('#js-suit-list'), function () {
            t('.comp.btn').mousedown(pick_a_comp);
            t('.tweak.btn').mousedown(unimplemented);

            t('.js-suit.btn').click(function () {
                var confirmed = confirm('确定切换魔板么？一切都要重新开始...');
                if (!confirmed) {
                    return;
                }

                app.activity_comp_editor.current_js_suit = t(this).attr('data-rel');
                yangaiche(app.activity_comp_editor.reset)();
                yangaiche(app.activity_comp_editor.refresh)();
                t('#js-suit-list').find('.btn').css('opacity', '0.6');
                t(this).css('opacity', '1');
            });

            t('#comp-list').css('padding-bottom', (40 * parseInt((app.activity_comp_editor.comp_tpls.count + 1) / 2) + 4) + '%');
            t('#js-suit-list').css('padding-bottom', (40 * parseInt((app.activity_comp_editor.js_suit_tpls.count + 1) / 2) + 4) + '%');
        }, function () {
            bind_delete();

            t('#js-suit-list').find('.btn').css('opacity', '0.6');
            t('.js-suit.btn[data-rel="' + app.activity_comp_editor.current_js_suit + '"]').css('opacity', '1');
        });

        t('#editor').mouseenter(function () {
            t(this).find('.component').addClass('deactivated');
        }).mouseleave(function () {
            t(this).find('.component').removeClass('deactivated');
        });

        t('#activity-submit').click(function () {
            t('input[name="code"]').val(app.activity_comp_editor.current_page_code);
            t('input[name="id"]').val(app.activity_comp_editor.current_activity_id);

            t('#sth-on-the-dimmer').show();
            t('#sth-on-the-form').show();
        });

        t('#activity-add').click(function () {
            var params = yangaiche(app.form.to_obj)('#activity-add-form'),
                components = yangaiche(app.activity_comp_editor.get_components)();

            console.log(params);
            console.log(components);

            if (components.length <= 0) {
                alert('请先设计界面');
                return;
            }

            var need_param = false;
            yangaiche(app.obj_util.is_missing_key)(params, function (key) {
                if ('id' !== key) {
                    alert('请完善信息，现' + key + '为空');
                    need_param = true;
                }
            });
            if (need_param) {
                return;
            }

            params.single_user_times = parseInt(params.single_user_times);
            if (isNaN(params.single_user_times)) {
                alert('单个用户使用次数必须为整数');
                return;
            }

            params.amount = parseInt(params.amount);
            if (isNaN(params.amount)) {
                alert('数量必须为整数');
                return;
            }

            params.price = parseFloat(params.price);
            if (isNaN(params.price)) {
                alert('价格必须为数字');
                return;
            }

            params.product_id = 999;
            console.log(params);
            yangaiche(app.http.post_request)('/v1/api/activity/create', params, function (data) {
                console.log(data);
                yangaiche(app.http.post_request)('/v1/api/h5template/update.json', {
                    page_code: data.code,
                    rendered_page: {
                        js_suit: {
                            id: parseInt(app.activity_comp_editor.current_js_suit)
                        },
                        rendered_html: yangaiche(app.activity_comp_editor.render)(components),
                        external_sale_configs: '{}'
                    }
                }, function (inner_data) {
                    console.log(inner_data);
                    alert('添加成功' + inner_data.page_code);
                    t('#sth-on-the-form').hide();
                    t('#sth-on-the-dimmer').hide();
                });
            }, function (error) {
                console.log(error);
                alert('添加失败' + JSON.stringify(error));
            });
        });

        t('#activity-exist-add').click(function () {
            var params = yangaiche(app.form.to_obj)('#activity-add-form'),
                components = yangaiche(app.activity_comp_editor.get_components)(),
                external_sale_configs = '{}';

            console.log(params);
            console.log(components);

            if (components.length <= 0) {
                alert('请先设计界面');
                return false;
            }

            if (!yangaiche(sys.exist)(params.code) || params.code === '') {
                alert('请正确填写Code');
                return false;
            }

            if (yangaiche(sys.exist)(params.share_config)) {
                try {
                    var externalSaleConfigs = params.share_config.toString();

                    JSON.parse(externalSaleConfigs);

                    external_sale_configs = externalSaleConfigs;
                } catch (e) {
                    alert('请正确填写分享配置【思宇专用】');
                    return false;
                }
            }

            yangaiche(app.http.post_request)('/v1/api/h5template/update.json', {
                id: params.id,
                page_code: params.code,
                rendered_page: {
                    js_suit: {
                        id: parseInt(app.activity_comp_editor.current_js_suit)
                    },
                    rendered_html: yangaiche(app.activity_comp_editor.render)(components),
                    external_sale_configs: external_sale_configs
                }
            }, function (data) {
                console.log(data);
                alert('修改成功' + data.page_code);
                t('#sth-on-the-form').hide();
                t('#sth-on-the-dimmer').hide();
            });
        });

        t('#activity-cancel').click(function () {
            t('#sth-on-the-form').hide();
            t('#sth-on-the-dimmer').hide();
        });

        function start_working() {
            t('#sth-on-the-welcome').hide();
            t('#sth-on-the-dimmer').hide();
        }

        t('#activity-new').click(start_working);

        yangaiche(app.http.get_request)('/v1/api/h5template/get_codes.json', function (data) {
            console.log(data);

            t('#existing_activities_wrapper').empty().html(Handlebars.compile(t('#existing_activities').text())(data));

            t('.open-activity').click(function () {
                var page_code = t(this).attr('data-rel');

                yangaiche(app.http.get_request)('/v1/api/h5template/get_page_by_code.json?code=' + page_code, function (data) {

                    var host = window.location.href.match(/(http:\/\/.*?\/.*?)\/.*/)[1];
                    var url = host + '/activity.html?page_code=' + page_code;

                    function normal() {
                        window.open(url);
                    }

                    function special() {
                        window.open(url + '&page_type=xcdl');
                    }

                    if (parseInt(data.js_suit.id) === 3) {
                        special();
                    } else {
                        normal();
                    }

                }, function (error) {
                    yangaiche(app.show_msg.show)(error.message || JSON.stringify(error));
                });
            });

            t('.edit-activity').click(function () {
                var page_code = t(this).attr('data-rel');
                yangaiche(app.http.get_request)('/v1/api/h5template/get_page_by_code.json?code=' + page_code, function (data) {
                    console.log(data);

                    yangaiche(app.activity_comp_editor.reverse_render)(data.rendered_html, post_handler);
                    app.activity_comp_editor.current_activity_id = data.id;
                    app.activity_comp_editor.current_js_suit = data.js_suit.id;
                    app.activity_comp_editor.current_page_code = page_code;
                    yangaiche(app.activity_comp_editor.refresh)();
                    start_working();
                });
            });
        });

    });
}());