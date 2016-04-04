$(document).ready(function () {
    var game = Engine.getInstance();
    game.createGrid($('#page-content-wrapper'));
        
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
           alert("Correct solution !");
        }
    });
            
    $("#toggle").click(function(e) {
        e.preventDefault();
        $(this).toggleClass("on");
        $("#wrapper").toggleClass("toggled");
    });
});