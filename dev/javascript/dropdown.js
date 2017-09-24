/**!
 * File: dropdown.js
 */

var dropdowns =  Array.prototype.slice.call(document.getElementsByClassName('dropdown-button'));

dropdowns.forEach(function( dropdown ) {

  var links = Array.prototype.slice.call(document.getElementsByClassName('link'));

  dropdown.addEventListener('click', function(e){

    e.preventDefault();
    this.parentElement.classList.toggle('active');

  }, false);

  links.forEach(function( link ) {

    link.addEventListener('click', function(e){

      e.preventDefault();
      this.parentElement.parentElement.parentElement.parentElement.classList.toggle('active');

    });
  });
});
