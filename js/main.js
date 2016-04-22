$(document).ready(function () {
    View.createGridTable($('#grid-wrapper'));
        
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
        Sudoku.solve();
    });
            
    $('#clear-btn').on('click', function () {
        Grid.clear();
        View.updateFromGrid();
    });
            
    $('#hint-btn').on('click', function () {
        Sudoku.getHint();
    });
    
    $('#check-btn').on('click', function () {
        if(Validator.checkSolution(Grid.get())) {
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