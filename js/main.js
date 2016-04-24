'use strict';

require.config({
    paths: {
        'jQuery': 'ext/jquery.min',
        'filesaver': 'ext/filesaver.min'
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});

require(['jQuery', 'game', 'view'], function($, Game, View) {
    $(document).ready(function () {
        Game.init(View);
    });
});