define('levels', ['grid'], function (Grid) { 'use strict';
    function cleanerEasy(erased) {
        var row, col, i;
     for(i = 0; i < erased; i++){
         row=Math.floor(Math.random()*9);
         col=Math.floor(Math.random()*9);
         if (!Grid.fieldIsEmpty(row,col)){
             Grid.setField(row,col,0);
         }
         else i--;
     }
    };
   return {
        cleanerEasy : cleanerEasy
    };
});