/*global $, jQuery*/
/*jslint node: true*/

'use strict';

var Grid = (function () {
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
}());

var System = (function () {
    var currentMsgTimeout = 0;
    
    return {
        print : function (message, color = 'Black', timeout = 2000) {
            clearTimeout(currentMsgTimeout);
            $(".message").hide().css("color", color).text(message).fadeIn(200);
            currentMsgTimeout = setTimeout( function() { 
                $(".message").fadeOut(1000); }, timeout
            );
        },
        
        exportGridToFile : function () {
            var output = "", grid = Grid.get();
            for(let i = 0; i < 9; i++) {
                for(let j = 0; j < 8; j++) {
                    output += grid[i][j] + " ";
                }
                output += grid[i][8] + "\r\n";
            }
            saveAs(new Blob([output], {type: "text/plain"}), "file.txt");
        },
        
        importGridFromFile : function (filePath) {
            var reader = new FileReader(), input = "";
            if(filePath.files && filePath.files[0]) {
                reader.onload = function (e) {
                    Grid.set(
                        e.target.result.split("\r\n").map(function(e) {
                            return e.split(" ").map(Number);
                        })
                    );
                    View.updateFromGrid();
                };
                reader.readAsText(filePath.files[0]);
            }
        }
    };
}());

var Validator = (function () {
    var checksum = 362880;
    
    function checkSubGrid(solution, row, col) {
        let gridsum = 1;
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                gridsum *= solution[row + i][col + j];
            }
        }
        return gridsum == checksum;
    };
    
    return {
        checkConflicts : function (grid, row, col, val) {
            var inRow = 0, inCol = 0, inSubGrid = 0; 
            var subGrid = [parseInt(row / 3) * 3, parseInt(col / 3) * 3];
            for(let i = 0; i < 9; i++) {
                if(grid[row][i] == val) inRow++;
                if(grid[i][col] == val) inCol++;
            }
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    if(grid[subGrid[0] + i][subGrid[1] + j] == val) {
                        inSubGrid++;
                    }
                }
            }
            return (inRow > 1 || inCol > 1 || inSubGrid > 1);
        },
                 
        checkGrid : function (grid) {
            var val = 0;
            for(let i = 0; i < 9; i++) {
                for(let j = 0; j < 9; j++) {
                    val = grid[i][j];
                    if(val && this.checkConflicts(grid, i, j , val))
                        return false;
                }
            }
            return true;
        },
        
        checkSolution : function (solution) {
            var rowsum = 1, colsum = 1;
            for(let i = 0; i < 9; i++) {
                rowsum = colsum = 1;
                for(let j = 0; j < 9; j++) {
                    rowsum *= solution[i][j];
                    colsum *= solution[j][i];
                    if(i % 3 == 0 && j % 3 == 0 && !checkSubGrid(solution, i, j)) {
                        return false;
                    }
                }
                if(rowsum != checksum || colsum != checksum) {
                    return false;
                }
            }
            return true;
        }
    };
}());

var Solver = (function () {
    var gridCopy = null, candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    Array.prototype.shuffle = function () {
        var randomIndex, itemAtIndex;
        for (let i = this.length - 1; i >= 0; i--) {
            randomIndex = Math.floor(Math.random() * (i + 1)); 
            itemAtIndex = this[randomIndex];
            this[randomIndex] = this[i];
            this[i] = itemAtIndex;
        }
        return this;
    };
    
    function setGrid(grid) {
        gridCopy = grid.slice();
        for(let i = 0; i < 9; i++) {
            gridCopy[i] = grid[i].slice();
        }  
    };
    
    function stepIntoNextField(row, col) {
        if(row == 8 && col == 8) return true;
        else if (row == 8) return solveField(0, col + 1);
        else return solveField(row + 1, col);
    };
        
    function solveField(row, col) {
        if (gridCopy[row][col] == 0) {
            candidates.shuffle();
            for(let i = 0; i < candidates.length; i++) {
                gridCopy[row][col] = candidates[i];
                if (!Validator.checkConflicts(gridCopy, row, col, candidates[i])
                    && stepIntoNextField(row, col)) {
                    return true;
                }
                else gridCopy[row][col] = 0;
            }
            return false;
        } 
        return stepIntoNextField(row, col);
    };
    
    return {
        solve : function (grid) {
            setGrid(grid);
            if(solveField(0, 0)) {
                return gridCopy;
            }
            return false;
        },
          
        getSolution : function () {
            return gridCopy;
        }
    };
}());

var View = (function () {
    
    function createGridCell(x, y) {
        var cell = $('<input id="it' + ((x * 9) + y) + '" type="tel" maxlength="1">');
        cell.data("X", x).data("Y", y);
        cell.on('change', setCellValue);
        cell.on('keydown', clearCell);
        return cell;
    };
    
    function setCellValue() {
        var x = $(this).data('X'), y = $(this).data("Y")
        ,val = parseInt($(this).val());
        
        if(!isNaN(val)) {
            Grid.setField(x, y, val);
            if(Validator.checkConflicts(Grid.get(), x, y, val)) {
                System.print('Conflict detected !', 'Red');
                $(this).css('text-shadow', '0 0 0 Red');
            }
        }
        else {
            clearCell();
        }
    };
    
    function clearCell() {
        $(this).val('').css('text-shadow', '0 0 0 Black');
        Grid.setField($(this).data('X'), $(this).data('Y'), 0);
    };
    
    return {
        createGridTable : function (element) {
            var row, table = $('<table>').addClass('grid');
            for (let i = 0; i < 9; i++) {
                row = $('<tr>');
                for (let j = 0; j < 9; j++) {
                    row.append($('<td>').append(createGridCell(i, j)));
                }
                table.append(row);
            }
            element.append(table); 
        },
        
        disableCells : function () {
            for(let i = 0; i < 9; i++) {
                for(let j = 0; j < 9; j++) {
                    if(grid[i][j] != 0) {
                        $('#it' + ((i * 9) + j)).prop("disabled", true);
                    }
                }
            }
        },
        
        clearCells : function () {
            for(let i = 0; i < 9; i++) {
                for(let j = 0; j < 9; j++) {
                    let handle = $('#it' + ((i * 9) + j));
                    if(!handle.prop("disabled")) {
                        handle.val('').css('text-shadow', '0 0 0 Black');
                        Grid.setField(i, j, 0);
                    }
                }
            }
        },
        
        updateFromGrid : function () {
            var grid = Grid.get();
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    $('#it' + ((i * 9) + j)).val(grid[i][j] ? grid[i][j] : '');
                }
            }
        }
    };
}());

var Game = (function () {
    return {
        solve : function () {
            if(Validator.checkGrid(Grid.get()) == false) {
                System.print("Grid is not correct !", "Red");
                return false;
            }
            if(Solver.solve(Grid.get()) && Validator.checkSolution(Solver.getSolution())) {
                Grid.set(Solver.getSolution());
                View.updateFromGrid();
                return true;
            }
            return false;
        },

        getHint : function () {
            var row, col, i, tempGrid = Solver.solve(Grid.get());
            if(tempGrid !== false) {
                for(i = 0; i < 100; i++) {
                    row = Math.floor(Math.random() * 9);
                    col = Math.floor(Math.random() * 9);
                    if(Grid.fieldIsEmpty(row, col)) {
                        Grid.setField(row, col, tempGrid[row][col]);
                        View.updateFromGrid();
                        return true;
                    }
                }
            }
            console.log("Unable to generate hint. Try again.");   
        },

        init : function () {
            View.createGridTable($('#grid-wrapper'));

            $("#toggle").click(function(e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
                $(this).toggleClass("on");
            });

            $('#export-btn').on('click', function () {
                System.exportGridToFile(Grid.get());
            });

            $('#import-btn').on('click', function () {
                $('#file-input').click();
            });

            $('#file-input').on('change', function () {
                System.importGridFromFile(this);
                $(this).val('');
            });

            $('#print-btn').on('click', function () {
                $("#toggle").click();
                window.print();
            });

            $('#solve-btn').on('click', function () {
                Game.solve();
            });

            $('#clear-btn').on('click', function () {
                View.clearCells();
            });

            $('#hint-btn').on('click', function () {
                Game.getHint();
            });

            $('#check-btn').on('click', function () {
                if(Validator.checkSolution(Grid.get())) {
                    System.print("Congratulations ! Your solution is correct.", "#0093ff");
                } 
                else {
                    System.print("Your solution is wrong !", "Red");
                }
            });
        } 
    };
}());