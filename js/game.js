define('game', ['jQuery', 'grid', 'system', 'validator', 'solver', 'levels', 'timer'],
function ($, Grid, System, Validator, Solver, Levels, Timer) { 'use strict';
    var viewUpdate = null;
    
    function solve() {
        if(Validator.checkGrid(Grid.get()) === false) {
            System.print("Grid is not correct !", "Red");
            return false;
        }
        if(Solver.solve(Grid.get()) && Validator.checkSolution(Solver.getSolution())) {
            Grid.set(Solver.getSolution());
            localStorage.setItem('viewNeedUpdate', true);
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
                    localStorage.setItem('viewNeedUpdate', true);
                    return true;
                } 
                else i--;
            }
        }
        console.log("Unable to generate hint. Try again.");
    };
    
    function generate(View, cells) {
        View.enableCells();
        Grid.clear();
        solve();
        Levels.cleaner(cells);
        Timer.start();
        View.disableCells();
    };                                                          
                                                              
    function init(View) {
        View.createTable($('#grid-wrapper'));
        viewUpdate = setInterval(View.update, 500);

        $('#export-btn').on('click', function () {
            System.exportGridToFile(Grid.get());
        });

        $('#import-btn').on('click', function () {
            View.enableCells();
            $('#file-input').click();
        });

        $('#file-input').on('change', function () {
            System.importGridFromFile(this);
            $(this).val('');
            setTimeout(function() {
                View.disableCells();
                Timer.start();
            }, 200);
        });

        $('#print-btn').on('click', function () {
            $('#logo').hide();
            $('#timer').hide();
            $('nav a').hide();
            setTimeout(function() {
                window.print();
                $('#logo').show();
                $('#timer').show();
                $('nav a').show();
            }, 200);
        });

        $('#easy-btn').on('click', function() {
            generate(View, 35);
        });
        
        $('#medium-btn').on('click', function() {
            generate(View, 40);
        });
        
        $('#hard-btn').on('click', function() {
            generate(View, 45);
        });
        
        $('#solve-btn').on('click', function () {
            solve();
        });

        $('#clear-btn').on('click', function () {
            View.clearTable();
            Timer.start();
        });

        $('#hint-btn').on('click', function () {
            getHint();
        });

        $('#check-btn').on('click', function () {
            if(Validator.checkSolution(Grid.get())) {
                System.print("Congratulations ! Your solution is correct.", "#0093ff");
                Timer.stop();
            } 
            else {
                System.print("Your solution is wrong !", "Red");
            }
        });
    };
    
    return {
        solve : solve,
        generate : generate,
        getHint : getHint,
        init : init
    }; 
});