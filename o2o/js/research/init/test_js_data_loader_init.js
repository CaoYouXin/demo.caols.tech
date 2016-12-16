;(function () {
    'use strict';

	//yangaiche(sys.load_module)('');
    //yangaiche(sys.load_default_module)('');
    //yangaiche(sys.load_lib_module)('');

    yangaiche(sys.init)(function (t) {
        //debugger;

        var resources = {
            defineFnA: 'function a() {console.log(\'A\' + b);}',
            defineVarB: 'var b = \"b\";',
        };

        var geval = eval;

        geval(resources.defineVarB.toString());
        console.log(b);
        geval(resources.defineFnA.toString());
        a();
    });
}());