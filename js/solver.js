'use strict';

function Solver(validator) {
    this.validator = validator;
    this.gridCopy = null;
    this.candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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

Solver.prototype.stepIntoNextField = function (row, col) {
    if(row == 8 && col == 8) return true;
    else if (row == 8) return this.solveField(0, col + 1);
    else return this.solveField(row + 1, col);
};

Solver.prototype.solveField = function (row, col) {
    if (this.gridCopy[row][col] == 0) {
        this.candidates.shuffle();
        for(let i = 0; i < this.candidates.length; i++) {
            this.gridCopy[row][col] = this.candidates[i];
            if (!this.validator.checkConflicts(
                    this.gridCopy, row, col, this.candidates[i]
            ) && this.stepIntoNextField(row, col)) {
                return true;
            } 
            else this.gridCopy[row][col] = 0;
        }
        return false;
    } 
    return this.stepIntoNextField(row, col);
};

Solver.prototype.solveSingleField = function (grid, row, col) {
    if (grid[row][col] == 0) {
        this.candidates.shuffle();
        for(let i = 0; i < this.candidates.length; i++) {
            grid[row][col] = this.candidates[i];
            if (!this.validator.checkConflicts(grid, row, col, this.candidates[i])) {
                return true;
            } 
            else grid[row][col] = 0;
        }
        return false;
    }
}

Solver.prototype.getSolution = function () {
    return this.gridCopy;
};