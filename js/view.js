'use strict';

define('view', ['system', 'grid', 'validator'], function(System, Grid, Validator) {
    function createTable(element) {
        var row, table = $('<table>').addClass('grid');
        for (let i = 0; i < 9; i++) {
            row = $('<tr>');
            for (let j = 0; j < 9; j++) {
                row.append($('<td>').append(createGridCell(i, j)));
            }
            table.append(row);
        }
        element.append(table);  
    };
    
    function createGridCell(x, y) {
        var cell = $('<input id="it' + ((x * 9) + y) + '" type="tel" maxlength="1">');
        cell.data("X", x).data("Y", y);
        cell.on('change', setCellValue);
        cell.on('keydown', clearCell);
        return cell;
    };
    
    function setCellValue() {
        var x   = $(this).data('X')
        ,   y   = $(this).data("Y")
        ,   val = parseInt($(this).val());
    
        if(!isNaN(val)) {
            console.log('ok');
            Grid.setField(x, y, val);
            if(Validator.checkConflicts(Grid.get(), x, y, val)) {
                System.print('Conflict detected !', 'Red');
                $(this).css('text-shadow', '0 0 0 Red');
            }
        }
        else {
            Grid.setField(x, y, 0);
            $(this).css('text-shadow', '0 0 0 Black').val('');
        }
    };
    
    function clearCell() {
        $(this).css('text-shadow', '0 0 0 Black').val('');
        Grid.setField($(this).data('X'), $(this).data('Y'), 0);
    };
    
    function update() {
        var needUpdate = localStorage.getItem('viewNeedUpdate');
        if(needUpdate === 'true') {
            var grid = Grid.get();
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    $('#it' + ((i * 9) + j)).val(grid[i][j] ? grid[i][j] : '');
                }
            }
            localStorage.setItem('viewNeedUpdate', false);
        }
    };
    
    function clearTable() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                let handle = $('#it' + ((i * 9) + j));
                if(!handle.prop("disabled")) {
                    handle.val('').css('text-shadow', '0 0 0 Black');
                    Grid.setField(i, j, 0);
                }
            }
        }  
    };
    
    function disableCells() {
        for(let i = 0; i < 9; i++) {
             for(let j = 0; j < 9; j++) {
                 if(grid[i][j] != 0) {
                     $('#it' + ((i * 9) + j)).prop("disabled", true);
                 }
             }
        }  
    };
    
    function enableCells() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                $('#it' + ((i * 9) + j)).prop("disabled", false);
            }
        }
    };
    
    return {
        createTable : createTable,
        clearTable : clearTable,
        enableCells : enableCells,
        disableCells : disableCells,
        update : update
    };
});