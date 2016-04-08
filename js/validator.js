'use strict';

function Validator() {
    
}

Validator.prototype.checkConflicts = function (grid, row, col, val) {
    let inRow = 0, inCol = 0, inSubGrid = 0, subGrid = [parseInt(row / 3) * 3, parseInt(col / 3) * 3];
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
};

Validator.prototype.gridIsCorrect = function (grid) {
    let val = 0;
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            val = grid[i][j];
            if(val && this.checkConflicts(grid, i, j , val))
                return false;
        }
    }
    return true;
};

Validator.prototype.checkSolution = function (solution) {
    let checksum = 362880, rowsum = 1, colsum = 1, gridsum = 1, i, j;
        for(i = 0; i < 9; i++) {
            rowsum = colsum = 1;
            for(j = 0; j < 9; j++) {
                rowsum *= solution[i][j];
                colsum *= solution[j][i];
                if( i % 3 == 0 && j % 3 == 0) {
                    gridsum = this.checkSubGrid(solution, i, j);
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

Validator.prototype.checkSubGrid = function (solution, row, col) {
    let gridsum = 1;
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            gridsum *= solution[row + i][col + j];
        }
    }
    return gridsum;    
};