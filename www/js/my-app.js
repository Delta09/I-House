// Initialize app
var myApp = new Framework7();


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBrr_lD4Lf7Pk-MrChtF14EbHK8H7muCqs",
    authDomain: "i-house-c01f2.firebaseapp.com",
    databaseURL: "https://i-house-c01f2.firebaseio.com",
    projectId: "i-house-c01f2",
    storageBucket: "i-house-c01f2.appspot.com",
    messagingSenderId: "182315859672"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
myApp.addView('.view-main',{
    main: true,
    dynamicNavbar: true
});


firebase.auth().onAuthStateChanged(function(user) { // user is undefined if no user signed in
    if (user) {
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log('Email now: ', email) // User is signed in.
    } else {
        console.log('No User Signed in'); // No user is signed in.
    }
});


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    var user = firebase.auth().currentUser;
    
    if (user != null) {
        console.log(name);
        document.getElementById("name").innerHTML = user.displayName;
        var img = document.createElement("img");
        img.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
        img.height = 250;
        img.width = 250;
        document.getElementById('pic').appendChild(img);
        
    }
    
    $$('.sign-in').on('click', function(){
        var email = document.getElementsByName('email')[0].value;
        var password =  document.getElementsByName('password')[0].value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser){
            console.log("No issue");
            location.href = "home.html";
        })
            .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Sign-In error: ', errorCode);
        });

    });

    $$('.sign-out').on('click', function(){
        console.log('Signing Out');
        firebase.auth().signOut()
            .then(function() {
            console.log('Signed-Out');
            location.href = "index.html";
        })
            .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Sign-Out error: ', errorCode);
        });

    });
    
});

// Now we need to run the code that will be executed only for jobApp page.
myApp.onPageInit('jobApp', function (page) {
    // Do something here for "jobApp" page
    console.log("jobApp");

    //Stores the Data to Firebase
    const docRef = firestore.doc("users/test/data/application");

    $$('.form-to-data').on('click', function(){
        var formData = myApp.formToJSON('#my-form'); //turns all the eform fields into JSON
        alert(JSON.stringify(formData));
        myApp.alert('Thank you for submitting your GIA Application!', 'I-House') 

        console.log("Saving: " + formData);
        docRef.set({
            application: formData
        })


    }); 
});

// Now we need to run the code that will be executed only for schedule page.
myApp.onPageInit('schedule', function (page) {
    // Do something here for "schedule" page
    console.log("schedule");

    //This is all for the Calendar Page, it is on the Framework7 website
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];

    var calendarInline = myApp.calendar({
        container: '#calendar-inline-container',
        value: [new Date()],
        weekHeader: false,
        toolbarTemplate: 
        '<div class="toolbar calendar-custom-toolbar">' +
        '<div class="toolbar-inner">' +
        '<div class="left">' +
        '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
        '</div>' +
        '<div class="center"></div>' +
        '<div class="right">' +
        '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
        '</div>' +
        '</div>' +
        '</div>',
        onOpen: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            $$('.calendar-custom-toolbar .left .link').on('click', function () {
                calendarInline.prevMonth();
            });
            $$('.calendar-custom-toolbar .right .link').on('click', function () {
                calendarInline.nextMonth();
            });
        },
        onMonthYearChangeStart: function (p) {
            $$('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
        }
    });


});