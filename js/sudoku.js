/*global $, jQuery*/
/*jslint node: true*/

'use strict';

var Sudoku = (function () {
    var instance, grid, validator;

    function Core() {
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
        this.clearGrid();
        validator = new Validator;
    }
    
    Core.prototype.exportGridToFile = function () {
        let output = "", data = null, i, j;
        for(i = 0; i < 9; i++) {
            //  output += JSON.stringify(grid[i]) + (i == 8 ? "\r\n" : ",\r\n");
            for(j = 0; j < 9; j++) {
                output += grid[i][j] + (j == 8 ? "" : " ");
            }
            output += "\r\n";
        }
        data = new Blob([output], {type: "text/plain;charset=utf-8"});
        saveAs(data, "gameboard.txt");
    };
    
    Core.prototype.importGridFromFile = function (filePath) {
        let reader = new FileReader(), input = "";
        if(filePath.files && filePath.files[0]) {
            reader.onload = function (e) {
                input = e.target.result;
                grid = input.split("\r\n").map(function(e) {
                    return e.split(" ").map(Number);
                });
                //grid = JSON.parse("[" + e.target.result + "]");
                instance.showValues();
            };
            reader.readAsText(filePath.files[0]);
        }
    };
    
    Core.prototype.createGrid = function (element) {
        var row, cell, table = $('<table>').addClass('grid');
        for (var i = 0; i < 9; i++) {
            row = $('<tr>');
            for (var j = 0; j < 9; j++) {
                cell = $('<input id="it' + ((i * 9) + j) + '" maxlength="1">');
                cell.data("coordinates", [i, j]);
                cell.on('change', function () {
                    let id = $(this).data('coordinates');
                    let val = parseInt($(this).val());
                    grid[id[0]][id[1]] = (val) ? val : 0;
                    if(validator.checkConflicts(grid, id[0], id[1], val)) {
                        $(".error").text("Conflict detected !").fadeIn(0.3);
                    }
                    else {
                        $(".error").empty().fadeOut(0.3);
                    }
                });
                row.append($('<td>').append(cell));
            }
            table.append(row);
        }
        element.append(table);
    };
    
    Core.prototype.clearGrid = function () {
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                grid[i][j] = 0;
            }
        }
        this.showValues();
        $(".error").empty().fadeOut(0.3);
    };
    
    Core.prototype.showValues = function () {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                $('#it' + ((i * 9) + j)).val(
                    grid[i][j] != 0 ? grid[i][j] : ""
                );
            }
        }
    };
    
    Core.prototype.solve = function () {
        var solver = new Solver();
        if(solver.solve(grid) && validator.checkSolution(solver.getSolution())) {
            grid = solver.getSolution();
            this.showValues();
            return true;
        }
        return false;
    };
    
    Core.prototype.validateCurrentSolution = function () {
        return validator.checkSolution(grid);
    };
       
    return {
        getInstance : function () {
            return instance || (instance = new Core());
        }
    };
}());