$(document).ready(function () {
    var game = Sudoku.getInstance();
    game.createGrid($('#grid-wrapper'));
        
    $('#export-btn').on('click', function () {
        game.exportGridToFile();
    });

    $('#import-btn').on('click', function () {
        $('#file-input').click();
    });

    $('#file-input').on('change', function () {
        game.importGridFromFile(this);
        $(this).val('');
    });
    
    $('#solve-btn').on('click', function () {
        game.solve();
    });
            
    $('#clear-btn').on('click', function () {
        game.clearGrid();
        game.refreshGrid();
    });
            
    $('#check-btn').on('click', function () {
        if(game.validateCurrentSolution()) {
            System.print("Congratulations ! Your solution is correct.", "green");
        } 
        else {
            System.print("Incorrect solution !", "Red");
        }
    });
            
    $("#toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $(this).toggleClass("on");
    });
});