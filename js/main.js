'use strict';

require.config({
    paths: {
        'jQuery': 'ext/jquery.min',
        'filesaver': 'ext/filesaver.min'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
    }
});

require(['jQuery', 'game'], function($, Game) {
    $(document).ready(function () {
        Game.init();
    });
});