(function($){
  $(function(){
    $('.modal').modal();
    $('.button-collapse').sideNav();
    $('.datepicker').pickadate({
       selectMonths: true, // Creates a dropdown to control month
       selectYears: 15 // Creates a dropdown of 15 years to control year
      });
    $('select').material_select();

  }); // end of document ready
})(jQuery); // end of jQuery name space

var status = document.querySelector('#myStatus');
status.className = 'hidden';

var time = document.querySelector('#returnTime');
var timeVal = document.querySelector('#returnDisplay');

timeVal.textContent = "12:00 PM";

time.oninput = function () {
        var hours1 = Math.floor(time.value / 60);
        var minutes1 = time.value - (hours1 * 60);

        if (hours1.length == 1) hours1 = '0' + hours1;
        if (minutes1.length == 1) minutes1 = '0' + minutes1;
        if (minutes1 == 0) minutes1 = '00';
        if (hours1 >= 12) {
            if (hours1 == 12) {
                hours1 = hours1;
                minutes1 = minutes1 + " PM";
            } else {
                hours1 = hours1 - 12;
                minutes1 = minutes1 + " PM";
            }
        } else {
            hours1 = hours1;
            minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
            hours1 = 12;
            minutes1 = minutes1;
        }

  timeVal.textContent = hours1 + ':' + minutes1;
};
