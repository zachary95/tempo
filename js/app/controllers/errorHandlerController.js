/**
 * ErrorHandler
 * Handle errors
 *
 * @class ErrorHandler
 * @since 0.1.0
 * @constructor
 */
var ErrorHandler = function() {
  this.errorPane = $('.errorPane');
  this.errorMsg  = this.errorPane.find('.errorPane__message');
};

/**
 * It just BLOW THE APP AWAY AND DISPLAY A BLACK ON WHITE ERROR MESSAGE.
 *
 * @method killTheApp
 * @param {String} errMsg - Message to display
 */
ErrorHandler.prototype.killTheApp = function(errMsg) {
  this.errorMsg.html(errMsg);
  this.errorPane.addClass('isShown');

  $('#main').remove();
};