'use strict';

define('game', function(require) {
    var $       = require('jQuery')
    ,Grid       = require('grid')
    ,View       = require('view')
    ,System     = require('system')
    ,Validator  = require('validator')
    ,Solver     = require('solver');
    
    function solve() {
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
    };
    
    function getHint() {
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
    };
    
    return {
        solve : solve,

        getHint : getHint,

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
                solve();
            });

            $('#clear-btn').on('click', function () {
                View.clearCells();
            });

            $('#hint-btn').on('click', function () {
                getHint();
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
});