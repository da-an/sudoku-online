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

require(['jQuery', 'game', 'view'], function($, Game, View) { 'use strict';
    $(document).ready(function () {
        Game.init(View);
        Game.generate(View, 35);
    });
});