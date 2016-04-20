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
    
    $('#print-btn').on('click', function () {
        $("#toggle").click();
        window.print(); 
    });
    
    $('#solve-btn').on('click', function () {
        game.solve();
    });
            
    $('#clear-btn').on('click', function () {
        game.clearDigitsSetByUser();
        game.refreshGrid();
    });
            
    $('#hint-btn').on('click', function () {
        game.getHint();
    });
    
    $('#check-btn').on('click', function () {
        if(game.validateCurrentSolution()) {
            System.print("Congratulations ! Your solution is correct.", "#0093ff");
        } 
        else {
            System.print("Your solution is wrong !", "Red");
        }
    });
            
    $("#toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $(this).toggleClass("on");
    });
});