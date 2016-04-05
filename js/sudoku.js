/*global $, jQuery*/
/*jslint node: true*/

'use strict';

var Sudoku = (function () {
    var instance, grid;

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
                    grid[id[0]][id[1]] = (val != NaN) ? val : 0;
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
    };
    
    Core.prototype.count = function () {
        var nValues = 0;
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                if(grid[i][j] != 0) {
                    nValues++;
                }
            }
        }
        return nValues;
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
        if(solver.solve(grid) && this.validateSudokuSolution(solver.getSolution())) {
            grid = solver.getSolution();
            this.showValues();
            return true;
        }
        return false;
    };
     
    Core.prototype.generatePuzzle = function (nFields) {
        this.clearGrid();
        var solver = new Solver(), row, col, oldValue, visited = [];
        grid = solver.solve(grid);
        
        while(this.count() != nFields) {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
            for(var i = 0; i < visited.length; i++) {
                if(visited[i] === [row, col]) {
                    continue;
                }
            }
            visited.push([row, col]);
            oldValue = grid[row][col];
            grid[row][col] = 0;
            if(!validateSudokuSolution(solver.solve(grid))) {
                grid[row][col] = oldValue;
            }
        }
        this.showValues();
    };
    
    Core.prototype.validateSudokuSolution = function(solution) {
        var checksum = 362880, rowsum = 1, colsum = 1, gridsum = 1, i, j;
        for(i = 0; i < 9; i++) {
            rowsum = colsum = 1;
            for(j = 0; j < 9; j++) {
                rowsum *= solution[i][j];
                colsum *= solution[j][i];
                if( i % 3 == 0 && j % 3 == 0) {
                    gridsum = this.validateSubGrid(solution, i, j);
                    if(gridsum != checksum) {
                        return false;
                    }
                    gridsum = 1;
                }
            }
            if(rowsum != checksum || colsum != checksum) {
                return false;
            }
        }
        return true;
    };
    
    Core.prototype.validateSubGrid = function (solution, row, col) {
        var gridsum = 1;
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                gridsum *= solution[row + i][col + j];
            }
        }
        return gridsum;
    };
    
    Core.prototype.validateCurrentSolution = function () {
        return this.validateSudokuSolution(grid);
    };
    
    return {
        getInstance : function () {
            return instance || (instance = new Core());
        }
    };
}());