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

function Solver() {
    this.gridCopy = null;
}

Solver.prototype.setGrid = function (grid) {
    this.gridCopy = grid.slice();
    for(let i = 0; i < 9; i++) {
        this.gridCopy[i] = grid[i].slice();
    }
};

Solver.prototype.solve = function (grid) {
    this.setGrid(grid);
    if(this.solveField(0, 0)) {
        return this.gridCopy;
    }
    return false;
};

Solver.prototype.solveField = function (row, col) {
    if (this.gridCopy[row][col] == 0) {
        let candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        candidates.shuffle();
        for(let i = 0; i < candidates.length; i++) {
            if (this.isSafeValue(row, col, candidates[i])) {
                this.gridCopy[row][col] = candidates[i];
                if (this.nextStep(row, col)) {
                    return true;
                }
                this.gridCopy[row][col] = 0;
            }
        }
        return false;
    }
    return this.nextStep(row, col);
};

Solver.prototype.nextStep = function (row, col) {
    if(row * col == 81) return true;
    else if (row == 8) return this.solveField(0, col + 1);
    else return this.solveField(row + 1, col);
};

Solver.prototype.isSafeValue = function (row, col, val) {
    return !(
        this.usedInRowOrColumn(row, col, val) || 
        this.usedInSubGrid(row, col, val)
    );
};

Solver.prototype.usedInRowOrColumn = function (row, col, val) {
    for(let i = 0; i < 9; i++) {
        if (this.gridCopy[row][i] == val || this.gridCopy[i][col] == val) {
            return true;
        }
    }
    return false;
};

Solver.prototype.usedInSubGrid = function (row, col, val) {
    let subGrid = [parseInt(row / 3) * 3, parseInt(col / 3) * 3], i, j;
    for(i = 0; i < 3; i++) {
        for(j = 0; j < 3; j++) {
            if(this.gridCopy[subGrid[0] + i][subGrid[1] + j] == val) {
                return true;
            }
        }
    }
    return false;
};

Solver.prototype.getSolution = function () {
    return this.gridCopy;
};