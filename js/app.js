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
    Materialize.toast(errorMessage, 4000);
  });
});

// add listener for admin logout
document.querySelector('#logout-button').addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  firebase.auth().signOut();
  var employee = document.getElementById('employeeInput');
  employee.className = 'hide';
});

// reset password
var auth = firebase.auth();
document.querySelector('#reset').addEventListener('click', function(e) {
  var emailAddress = document.getElementById('resetEmail').value;
  auth.sendPasswordResetEmail(emailAddress).then(function() {
    Materialize.toast('An email has been sent to ' + emailAddress, 4000);
    console.log('sent');
  }, function(error) {
    Materialize.toast('Something went wrong. Please contact the admin.', 4000);
    console.log(emailAddress);
  });
});

function loadCheckin() {

  displayName = firebase.auth().currentUser.displayName;

  function username(){ return firebase.database().ref('/employees/' + displayName).once('value').then( function(snapshot) {
    var myName = snapshot.val().first;
    var adminCheck = snapshot.val().admin;

    //add logout to admin modal
    var welcome = document.getElementById('welcome');
    var greeting = '<h5 id="greeting" class="grey-text text-darken-2">Hello ' + myName + '</h5>';
    var logoutButton = document.getElementById('logout-button');
    var loginButton = document.getElementById('login-button');
    var statusButton = document.getElementById('status-button');
    var greeted = document.getElementById('greeting');
    var status = document.getElementById('myStatus');

    if (typeof(greeted) != 'undefined' && greeted !== null){
      return;
    } else {
      welcome.insertAdjacentHTML('beforeend',greeting);
      loginButton.className = 'disabled btn waves-effect waves-light';
      logoutButton.className = 'btn waves-effect waves-light';
      statusButton.className = 'btn waves-effect waves-light right';
      status.className = 'col s12 l8';

      if (displayName == 'mhaenlein'){
        $('.btn').addClass('deep-purple');
      }

      if (adminCheck === true){
        var employeeInput = document.getElementById('employeeInput');
        employeeInput.className = 'input-field col s12 l6';
        var employee = document.getElementById('employee');
        var initOption = document.getElementById('initEmployee');
        initOption.value = displayName;
        initOption.selected = true;
        initOption.disabled = true;

        var employees = firebase.database().ref('/employees');
        employees.orderByChild('first').once('value', function(snapshot) {

          snapshot.forEach(function(user) {
            var id = user.key;
            var first = user.val().first;
            var last = user.val().last;

            var option = document.createElement('option');
            option.value = id;
            option.innerText = first + ' ' + last;
            employee.insertAdjacentElement('beforeend', option);

          });
          $('select').material_select();
        });
      }
    }
  });
}

username();

firebase.database().ref('/employees').once('value').then(function(snapshot){
  var employeeCount = snapshot.numChildren();
  listLength = employeeCount / 2;

// list all employees status
var employees = firebase.database().ref('/employees');
if (displayName == 'mhaenlein') {
  var order = 'first';
} else {
  var order = 'last';
}
employees.orderByChild(order).limitToFirst(Math.ceil(listLength)).on('value', function(snapshot) {
  list.innerHTML = '';
  snapshot.forEach(function(employee) {
    var list = document.getElementById('list');

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

    if (employee.val().status.details !== '' && employee.val().status.details != null && typeof(employee.val().status.details) != 'undefined') {
      var detail = '<p>' + employee.val().status.details + '</p>';
    } else {
      var detail = '';
    }

    if (employee.val().status.timestamp !== '' && employee.val().status.timestamp != null && typeof(employee.val().status.timestamp) != 'undefined') {
      var timestamp = '<span class="timestamp">Last Updated: ' + moment(employee.val().status.timestamp).fromNow() + '</span>';
    } else {
      var timestamp = '<span class="timestamp">Last Updated: Never </span>';
    }
  if (displayName == 'mhaenlein') {
    var listItem = '<div class="divider blue-grey lighten-3"></div><div class="employee-status"><h5><span class="deep-purple-text text-darken-2"> ' + employee.val().first + ' ' + employee.val().last + '</span> - ' + employee.val().status.status +
    timestamp + '</h5><p>' + returnText + returnDate + returnTime + '</p>' + detail + '</div>';
  } else {
    var listItem = '<div class="divider blue-grey lighten-3"></div><div class="employee-status"><h5><span class="blue-text text-darken-2"> ' + employee.val().first + ' ' + employee.val().last + '</span> - ' + employee.val().status.status +
    timestamp + '</h5><p>' + returnText + returnDate + returnTime + '</p>' + detail + '</div>';
  }

    list.insertAdjacentHTML('beforeend', listItem)
  });
});

employees.orderByChild(order).limitToLast(Math.floor(listLength)).on('value', function(snapshot) {
  list2.innerHTML = '';
  snapshot.forEach(function(employee) {
    var list2 = document.getElementById('list2');

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

    if (employee.val().status.details !== '' && employee.val().status.details != null && typeof(employee.val().status.details) != 'undefined') {
      var detail = '<p>' + employee.val().status.details + '</p>';
    } else {
      var detail = '';
    }

    if (employee.val().status.timestamp !== '' && employee.val().status.timestamp != null && typeof(employee.val().status.timestamp) != 'undefined') {
      var timestamp = '<span class="timestamp">Last Updated: ' + moment(employee.val().status.timestamp).fromNow() + '</span>';
    } else {
      var timestamp = '<span class="timestamp">Last Updated: Never </span>';
    }

    if (displayName == 'mhaenlein') {
      var listItem = '<div class="divider blue-grey lighten-3"></div><div class="employee-status"><h5><span class="deep-purple-text text-darken-2"> ' + employee.val().first + ' ' + employee.val().last + '</span> - ' + employee.val().status.status +
      timestamp + '</h5><p>' + returnText + returnDate + returnTime + '</p>' + detail + '</div>';
    } else {
      var listItem = '<div class="divider blue-grey lighten-3"></div><div class="employee-status"><h5><span class="blue-text text-darken-2"> ' + employee.val().first + ' ' + employee.val().last + '</span> - ' + employee.val().status.status +
      timestamp + '</h5><p>' + returnText + returnDate + returnTime + '</p>' + detail + '</div>';
    }

    list2.insertAdjacentHTML('beforeend', listItem);
  });
});
});
} // end loadCheckin

document.querySelector('#status-button').addEventListener('click', function(){
// add listener for status update
var employees = firebase.database().ref('/employees');

employees.orderByKey().equalTo(displayName).once('value', function(snapshot) {
  snapshot.forEach(function(snap) {

      console.log(snap.val());
      console.log(displayName);
      var adminCheck = snap.val().admin;
      var status = document.getElementById('status').value;
      var returnTime = document.getElementById('returnDisplay').innerText;
      var returnDate = document.getElementById('returnDate').value;
      var details = document.getElementById('detail').value;
      var person = document.getElementById('employee').value;
      var statusData = {
        status: status,
        returnTime: returnTime,
        returnDate: returnDate,
        details: details,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      var updates = {};
      if (adminCheck === true) {
        updates['employees/' + person + '/status'] = statusData;
      } else {
        updates['employees/' + displayName + '/status'] = statusData;
      }

      document.getElementById("updateForm").reset();
      document.getElementById("returnDisplay").innerText = '';

      return firebase.database().ref().update(updates);
    });
  });
});

// Set states for Admin/anonymous
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    var thisUser = firebase.auth().currentUser;
    console.log(thisUser.displayName);
    // check for display name
    if (thisUser.displayName == null) {
      var email = thisUser.email;
      var username = email.split('@')[0];
      thisUser.updateProfile({
        displayName: username
      }).then(function() {
        // Update successful.
        loadCheckin();
      }, function(error) {
        // An error happened.
      });
    } else if (thisUser.displayName == 'mhaenlein') {
      var banner = document.getElementById('banner');
      banner.className = "deep-purple z-depth-1";
      var footer = document.getElementById('footer');
      footer.className = 'page-footer deep-purple';
      $('.btn').addClass('deep-purple');
      loadCheckin();
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
    var list2 = document.getElementById('list2');

    list.innerHTML = '';
    list2.innerHTML = '';

    if (typeof(greeting) != 'undefined' && greeting !== null) {
      welcome.removeChild(greeting);
      loginButton.className = 'btn waves-effect waves-light';
      logoutButton.className = 'disabled btn waves-effect waves-light';
      statusButton.className = 'disabled btn waves-effect waves-light right';
      status.className = 'hide col s12 l8';
    } else {
      return;
    }

    document.getElementById("adminForm").reset();

  }
});
