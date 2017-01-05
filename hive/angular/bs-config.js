module.exports = function (bs) {

    return {
        server: {
            middleware: {
                1: require('connect-history-api-fallback')()
            }
        },
        browser: ["chrome", "firefox"],
        // startPath: "./"
    };

};