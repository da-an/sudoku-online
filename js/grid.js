'use strict';

define('grid', function() {
    var grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    
    return {
        get : function () {
            return grid;
        },
        
        set : function (newGrid) {
            grid = newGrid;
        },
        
        clear : function () {
            for(let i = 0; i < 9; i++) {
                for(let j = 0; j < 9; j++) {
                    grid[i][j] = 0;
                }
            }
        },
        
        setField : function (x, y, value) {
            grid[x][y] = value;
        },
        
        fieldIsEmpty : function (x, y) {
            return grid[x][y] == 0;
        }
    };
});