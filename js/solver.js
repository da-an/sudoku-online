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
    this.validator = new Validator;
}

Solver.prototype.setGrid = function (grid) {
    this.gridCopy = grid.slice();
    for(let i = 0; i < 9; i++) {
        this.gridCopy[i] = grid[i].slice();
    }
};

Solver.prototype.solve = function (grid) {
    if(this.validator.gridIsCorrect(grid)) {
        this.setGrid(grid);
        if(this.solveField(0, 0)) {
            return this.gridCopy;
        }
        return false;
    } 
    else {
        $(".error").text("Unable to solve puzzle !").fadeIn(0.3);
        return false;  
    }
};

Solver.prototype.solveField = function (row, col) {
    if (this.gridCopy[row][col] == 0) {
        let candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        candidates.shuffle();
        for(let i = 0; i < candidates.length; i++) {
            this.gridCopy[row][col] = candidates[i];
            if (!this.validator.checkConflicts(this.gridCopy, row, col, candidates[i]) && this.nextStep(row, col)) {
                return true;
            } 
            else this.gridCopy[row][col] = 0;
        }
        return false;
    } 
    return this.nextStep(row, col);
};

Solver.prototype.nextStep = function (row, col) {
    if(row == 8 && col == 8) return true;
    else if (row == 8) return this.solveField(0, col + 1);
    else return this.solveField(row + 1, col);
};

Solver.prototype.getSolution = function () {
    return this.gridCopy;
};