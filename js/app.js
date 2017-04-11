// Initialize Firebase
var config = {
  apiKey: "AIzaSyC1ucfyNAcYHPpLjtxul6NPMu5JEI2TiR4",
  authDomain: "iconeng-2cbda.firebaseapp.com",
  databaseURL: "https://iconeng-2cbda.firebaseio.com",
  projectId: "iconeng-2cbda",
  storageBucket: "iconeng-2cbda.appspot.com",
  messagingSenderId: "328083825507"
};
firebase.initializeApp(config);

// Add listener for user login
document.querySelector('#submit').addEventListener('click', function(e) {

      e.preventDefault();
      e.stopPropagation();
      var email = document.querySelector('#email').value;
      var password = document.querySelector('#password').value
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
  });
});

function loadCheckin() {

  var displayName = firebase.auth().currentUser.displayName;
  function username(){ return firebase.database().ref('/employees/' + displayName).once('value').then( function(snapshot) {
                  var myName = snapshot.val().first;

              //add logout to admin modal
                  var welcome = document.getElementById('welcome');
                  var greeting = '<h5 id="greeting">Hello ' + myName + '</h5>';
                  var logoutButton = document.getElementById('logout-button');
                  var loginButton = document.getElementById('login-button');
                  var statusButton = document.getElementById('status-button');
                  var greeted = document.getElementById('greeting');
                  var status = document.getElementById('myStatus');

                if (typeof(greeted) != 'undefined' && greeted !== null){
                  return;
                } else {
                  welcome.insertAdjacentHTML('beforeend',greeting);
                  loginButton.className = 'disabled btn waves-effect waves-light cyan darken-2';
                  logoutButton.className = 'btn waves-effect waves-light cyan darken-2';
                  statusButton.className = 'btn waves-effect waves-light cyan darken-2 right';
                  status.className = 'col s12 l8';
                }
              });
            }

              username().then( function() {
      // add listener for admin logout
      document.querySelector('#logout-button').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            firebase.auth().signOut();
          });
      });

      // add listener for status update
      document.querySelector('#status-button').addEventListener('click', function(){

          var status = document.getElementById('status').value;
          var returnTime = document.getElementById('returnDisplay').innerText;
          var returnDate = document.getElementById('returnDate').value;
          var details = document.getElementById('detail').value;
          var statusData = {
            status: status,
            returnTime: returnTime,
            returnDate: returnDate,
            details: details
          };

          var updates = {};
          updates['employees/' + displayName + '/status'] = statusData;

          document.getElementById("updateForm").reset();
          document.getElementById("returnDisplay").innerText = '';

          return firebase.database().ref().update(updates);
      });

      // list all employees status
      var employees = firebase.database().ref('/employees');
      employees.orderByChild('last').on('value', function(snapshot) {
        list.innerHTML = '';
        snapshot.forEach(function(employee) {
          var list = document.getElementById('list');
          console.log(employee.val().status.returnTime);

          if (employee.val().status.returnTime !== '' && employee.val().status.returnTime !== null && typeof(employee.val().status.returnTime) != 'undefined' || employee.val().status.returnDate !== '' && employee.val().status.returnDate !== null && typeof(employee.val().status.returnDate) != 'undefined') {
            var returnText = 'Returning ';
          } else {
            var returnText = '';
          }

          if (employee.val().status.returnTime !== '' && employee.val().status.returnTime !== null && typeof(employee.val().status.returnTime) != 'undefined') {
            var returnTime = ' at ' + employee.val().status.returnTime;
          } else {
            var returnTime = '';
          }

          if (employee.val().status.returnDate !== '' && employee.val().status.returnDate !== null && typeof(employee.val().status.returnDate) != 'undefined') {
            var returnDate = employee.val().status.returnDate;
          } else {
            var returnDate = '';
          }

          if (employee.val().status.detail !== '' && employee.val().status.detail !=+ null && typeof(employee.val().status.detail) != 'undefined') {
            var detail = '<p>' + employee.val().status.detail + '</p>';
          } else {
            var detail = '';
          }

          var listItem = '<div class="divider"></div><div><h5> ' + employee.val().first + ' ' + employee.val().last + ' - ' + employee.val().status.status +
                         '</h5><p>' + returnText + returnDate + returnTime + '</p>' + detail + '</div>';

          list.insertAdjacentHTML('beforeend', listItem)
      });
    });
  }; // end loadCheckin

// Set states for Admin/anonymous
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    var user = firebase.auth().currentUser;
    // check for display name
    if (user.displayName == null) {
      var email = user.email;
      var username = email.split('@')[0];
      user.updateProfile({
        displayName: username
      }).then(function() {
        // Update successful.
      }, function(error) {
        // An error happened.
      }).then(loadCheckin());
    } else {
      loadCheckin()
    }

  } else {

// remove admin tools
    var welcome = document.getElementById('welcome');
    var greeting = document.getElementById('greeting');
    var logoutButton = document.getElementById('logout-button');
    var loginButton = document.getElementById('login-button');
    var statusButton = document.getElementById('status-button');
    var status = document.getElementById('myStatus');
    var list = document.getElementById('list');

    list.innerHTML = '';

    if (typeof(greeting) != 'undefined' && greeting !== null) {
      welcome.removeChild(greeting);
      loginButton.className = 'btn waves-effect waves-light cyan darken-2';
      logoutButton.className = 'disabled btn waves-effect waves-light cyan darken-2';
      statusButton.className = 'disabled btn waves-effect waves-light cyan darken-2 right';
      status.className = 'hidden col s12 l8';
    } else {
      return;
    }

    document.getElementById("adminForm").reset();

  }
});
