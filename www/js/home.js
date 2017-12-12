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

firebase.auth().onAuthStateChanged(function(user) { 

    // user is undefined if no user signed in
    if (user) {
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        var admin = user.admin;
        console.log('User name: ' + displayName)

    } else {
        console.log('No User Signed in'); // No user is signed in.
    }

}); 



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Home is ready!"); 
    var user = firebase.auth().currentUser;

    var id = user.uid
    const docRef = db.collection("users").doc(id);

     docRef.get().then(function(doc) {
        if (doc.exists) {


            if(doc.data()["admin"]){
                console.log("Admin Signed in")
                document.getElementById('admin').style.display = 'block';
            }
            else{
                console.log("Resident Signed in")
            }


        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });




if(user){
    console.log("user is logged in")

    //update Profile page
    document.getElementById("name").innerHTML = user.displayName;
    var img = document.createElement("img");
    img.src = user.photoURL;
    img.height = 250;
    img.width = 250;
    document.getElementById('pic').appendChild(img);
}


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
    var user = firebase.auth().currentUser;


    var id = user.uid
    const docRef = db.collection("users").doc(id);

    docRef.get().then(function(doc) {
        if (doc.exists) {


            if(doc.data()["admin"]){
                console.log("Admin Signed in")
                document.getElementById('applications').style.display = 'inline';

                db.collection("GIA_Applications").get()
                    .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log(doc.id, " => ", doc.data());
                    });
                })
                    .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });





            }
            else{
                console.log("Resident Signed in")

                document.getElementById('my-form').style.display = 'inline';

                //Stores the Data to Firebase

                $$('.form-to-data').on('click', function(){
                    var formData = myApp.formToJSON('#my-form'); //turns all the eform fields into JSON
                    alert(JSON.stringify(formData));
                    myApp.alert('Thank you for submitting your GIA Application!', 'I-House') 

                    console.log("Saving: " + formData);
                    console.log("UID: " + id);
                    db.collection("GIA_Applications").doc(id).set(formData).then(function() {
                        console.log("Document successfully written");
                    });

                });

            }


        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
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

myApp.onPageInit('addResident', function (page) {
    // Do something here for "Add Resident" page
    console.log("Add Resident");

});