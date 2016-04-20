/*global $, jQuery*/
/*jslint node: true*/

'use strict';

Array.prototype.shuffle = function () {
    let input = this, i, randomIndex, itemAtIndex;
    for (i = input.length - 1; i >= 0; i--) {
        randomIndex = Math.floor(Math.random() * (i + 1)); 
        itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
};

// Tutaj znajdują się metody zarządzające komunikatami oraz zegarem.
// Ta klasa zarządza local storage.
var System = (function () {
    var currentErrTimeout = 0;
    
    return {
        print : function (message, color = 'Black', timeout = 2000) {
            clearTimeout(currentErrTimeout);
            $(".message").hide().css("color", color).text(message).fadeIn(200);
            currentErrTimeout = setTimeout( function() { 
                $(".message").fadeOut(1000); }, timeout
            );
        }
    };
}());

var Sudoku = (function () {
    var instance, grid, validator, solver;

    function Engine() {
        grid = [
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
        validator = new Validator;
        solver = new Solver(validator);
        this.refreshGrid();
    }
    
    Engine.prototype.createGrid = function (element) {
        var row, table = $('<table>').addClass('grid'), i, j;
        for (i = 0; i < 9; i++) {
            row = $('<tr>');
            for (j = 0; j < 9; j++) {
                row.append($('<td>').append(this.createGridCell(i, j)));
            }
            table.append(row);
        }
        element.append(table);
    };
    
    Engine.prototype.createGridCell = function (i, j) {
        var cell;
        cell = $('<input id="it' + ((i * 9) + j) + '" type="tel" maxlength="1">');
        cell.data("X", i).data("Y", j);
        cell.on('keydown', this.clearField);
        cell.on('change', this.setNewValue);
        return cell;
    };
    
    Engine.prototype.setNewValue = function () {
        var x = $(this).data('X'), y = $(this).data("Y");
        var val = parseInt($(this).val());
        if(!isNaN(val)) {
            grid[x][y] = val;
            if(validator.checkConflicts(grid, x, y, val)) {
                System.print('Conflict detected !', 'Red');
                $(this).css('text-shadow', '0 0 0 Red');
            }
        }
        else {
            instance.clearField();
        }
    };
    
    Engine.prototype.clearField = function () {
        $(this).val('').css('text-shadow', '0 0 0 Black');
        grid[$(this).data('X')][$(this).data("Y")] = 0;
    };
    
    Engine.prototype.clearDigitsSetByUser = function () {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                let handle = $('#it' + ((i * 9) + j));
                if(!handle.prop("disabled")) {
                    handle.val('').css('text-shadow', '0 0 0 Black');
                    grid[i][j] = 0;
                }
            }
        }
    };
    
    Engine.prototype.clearGrid = function () {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                $('#it' + ((i * 9) + j)).prop("disabled", false);
                grid[i][j] = 0;
            }
        }
    };
    
    Engine.prototype.refreshGrid = function () {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                $('#it' + ((i * 9) + j)).val(
                    grid[i][j] ? grid[i][j] : ''
                );
            }
        }
    };
    
    Engine.prototype.solve = function () {
        if(solver.solve(grid) && validator.checkSolution(solver.getSolution())) {
            grid = solver.getSolution();
            this.refreshGrid();
            return true;
        }
        return false;
    };
    
    Engine.prototype.validateCurrentSolution = function () {
        return validator.checkSolution(grid);
    };
       
    Engine.prototype.exportGridToFile = function () {
        var output = "", data = null, i, j;
        for(i = 0; i < 9; i++) {
            for(j = 0; j < 9; j++) {
                output += grid[i][j] + (j == 8 ? "" : " ");
            }
            output += "\r\n";
        }
        data = new Blob([output], {type: "text/plain;charset=utf-8"});
        saveAs(data, "gameboard.txt");
    };
    
    Engine.prototype.importGridFromFile = function (filePath) {
        var reader = new FileReader(), input = "";
        if(filePath.files && filePath.files[0]) {
            reader.onload = function (e) {
                grid = e.target.result.split("\r\n").map(function(e) {
                    return e.split(" ").map(Number);
                });
                instance.refreshGrid();
                instance.disableCells();
            };
            reader.readAsText(filePath.files[0]);
        }
    };
    
    Engine.prototype.disableCells = function () {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if(grid[i][j] != 0) {
                    $('#it' + ((i * 9) + j)).prop("disabled", true);
                }
            }
        }
    };
    
    return {
        getInstance : function () {
            return instance || (instance = new Engine());
        }
    };
}());