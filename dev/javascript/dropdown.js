/**!
 * File: dropdown.js
 */

var dropdowns =  Array.prototype.slice.call(document.getElementsByClassName('dropdown-button'));

dropdowns.forEach(function( dropdown ) {

    var links = Array.prototype.slice.call(document.getElementsByClassName('link'));

    dropdown.addEventListener('click', function(e){

        e.preventDefault();
        var targetId = this.parentElement.id;
        document.getElementById(targetId).classList.toggle('active');


    }, false);

    links.forEach(function( link ) {

        link.addEventListener('click', function(e){

            e.preventDefault();
            var targetId = this.parentElement.parentElement.parentElement.parentElement.id;
            console.log(targetId);
            document.getElementById(targetId).classList.remove('active');

        });
    });
});
