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
    
    function get() {
        return grid;
    }
    
    function set(newGrid) {
        grid = newGrid;  
    };
    
    function clear() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                grid[i][j] = 0;
            }
        }   
    };
    
    function setField(x, y, value) {
        grid[x][y] = value; 
    };
    
    function fieldIsEmpty(x, y) {
        return grid[x][y] == 0;
    };
    
    return {
        get : get,
        set : set,
        clear : clear,
        fieldIsEmpty : fieldIsEmpty,
        setField : setField
    };
});