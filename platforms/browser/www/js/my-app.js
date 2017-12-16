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
var db = firebase.firestore();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
myApp.addView('.view-main',{
    main: true,
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Login is ready!"); 


    var user = firebase.auth().currentUser;

    $$('.sign-in').on('click', function(){
        var email = document.getElementsByName('email')[0].value;
        var password =  document.getElementsByName('password')[0].value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser){
            location.href = "home.html";
        })
            .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Sign-In error: ', errorCode);
        });

    });  
});

    
            