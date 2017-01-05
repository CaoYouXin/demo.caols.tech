'use strict';

var through = require('through-gulp');

module.exports = function () {

    return through(function (file, encoding, cb) {
        var contents = file.contents.toString();
        console.log(contents);

        file.contents = new Buffer(contents.replace(/function [a-z]*\(.*?\) \{([\s\S\n]*?)}/mg, function ($0, $1, $2, $3) {
            // console.log('args : ', arguments);

            var flag = false;

            $1 = $1.replace(/(?:[^;])*?return (\{?[\s\S\n]*?[};]+?)/mg, function ($00, $01, $02, $03) {

                flag = true;

                $01 = $01.substr(0, $01.indexOf(';') === -1 ? $01.length : $01.indexOf(';'));

                return $01;
            });

            if (flag) {
                return '() => (' + $1 + ')';
            } else {
                return '() => {' + $1 + '}';
            }

        }).replace(/\(.*?\)\s*?=>\s*?\{(?:[^;])*?return (\{?[\s\S\n]*?[};]+?)[\s\n]*?}/mg, function ($0, $1, $2, $3) {

            return '() => (' + $1 + ')';
        // }).replace(srcRegExp, function ($0, $1, $2, $3) {
        //     return 'src='+$1+'http://image.caols.tech/'+$2+$3;
        // }).replace(dataUrlRegExp, function ($0, $1, $2, $3) {
        //     return 'data-url='+$1+'http://image.caols.tech/'+$2+$3;
        }));

        this.push(file);
        cb();
    }, null, null);
};