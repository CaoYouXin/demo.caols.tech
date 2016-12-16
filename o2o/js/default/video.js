;(function () {

    'use strict';

    (function (t) {

        t.each(t('.component[data-tpl="video"]'), function (i, comp) {
            var app = t(comp).find('div[role="application"]');
            app.css('border', 'none');
            var cssSelectorAncestor = '#' + app.attr('id');

            t(comp).find('.jp-jplayer').jPlayer({
                ready: function () {
                    $(this).jPlayer('setMedia', {
                        title: 'Big Buck Bunny',
                        m4v: 'http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v',
                        ogv: 'http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv',
                        webmv: 'http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm',
                        poster: 'http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png'
                    });
                },
                cssSelectorAncestor: cssSelectorAncestor,
                swfPath: './js/lib/jplayer',
                supplied: 'webmv, ogv, m4v',
                size: {
                    width: '640px',
                    height: '360px',
                    cssClass: 'jp-video-360p'
                },
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                keyEnabled: true,
                remainingDuration: true,
                toggleDuration: true
            });
        });

    }(yangaiche(sys.$)));
}());