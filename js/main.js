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
    });
            
    $('#check-btn').on('click', function () {
        if(game.validateCurrentSolution()) {
            $(".error").empty().fadeOut();
            alert("Congratulations ! Your solution is correct.");
        } 
        else $(".error").text("Incorrect solution").fadeIn(0.3);
    });
            
    $("#toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        $(this).toggleClass("on");
    });
});