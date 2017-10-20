/**!
 * File: modal.js
 */

var modalButtons =  Array.prototype.slice.call(document.getElementsByClassName('modal-button'));

modalButtons.forEach(function( button ) {

  button.addEventListener('click', function(e){

      e.preventDefault();
      var modalId = this.getAttribute('data-toggle');
      console.log( modalId );
      var modal = document.getElementById(modalId)
      modal.classList.toggle('active');

  }, false);

});
