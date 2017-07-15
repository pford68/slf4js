'use strict';

module.exports = function inject(logConfig) {

    logConfig = logConfig || {};
    const extend = require('object-util').extend;
    const theme = extend(require('../conf/themes.json'), logConfig.theme || {});


    return {
        append: function(logger, ...varargs){
            let type = logger.logEvent.name;
            return ['%c%s', `color: ${theme[type]}`, ...varargs];
        }
    };
};

