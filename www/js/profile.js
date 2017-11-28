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
var $$ = Dom7;

myApp.addView('.view-main',{
    main: true,
    dynamicNavbar: true
});


var user = firebase.auth().currentUser;
    
var name, email, photoUrl, uid, emailVerified;
    if (user != null) {
        name = user.displayName;
        console.log(name);
        document.getElementById("name").innerHTML = name;
    }

$$(document).on('deviceready', function() {
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