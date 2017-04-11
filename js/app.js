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

      var employees = firebase.database().ref('/employees');
      employees.orderByChild('last').on('value', function(snapshot) {
        snapshot.forEach(function(employee) {
          var list = document.getElementById('list');
          var listItem = '<div class="divider"></div><div><h5> ' + employee.val().first + ' ' + employee.val().last + ' - ' + employee.val().status + '</h5><p>Stuff</p></div>';

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
