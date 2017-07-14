'use strict';

module.exports = function inject(logConfig) {

    const utils = require('../LogUtils')(logConfig);
    const extend = require('object-util').extend;
    const theme = extend(require('../conf/themes.json'), logConfig.theme || {});
    const formatArguments = utils.formatArguments;
    const colors = require('colors');
    colors.setTheme(theme);


    return {
        append: function(logger, ...varargs){
            let type = logger.logEvent.name;
            const colorize = colors[type.toUpperCase()];
            return colorize(formatArguments(logger, ...varargs));
        }
    }
};
