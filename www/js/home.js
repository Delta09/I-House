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
var passed_id = 0;
var passed_name = "";

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

        // Handle Cordova Device Ready Event
        $$(document).on('deviceready', function() {
            console.log("Home is ready!"); 
            var user = firebase.auth().currentUser;

            if(user){
                console.log("user is logged in")

                //update Profile page
                document.getElementById("name").innerHTML = user.displayName;
                var img = document.createElement("img");
                //img.src = user.photoURL;
                //img.height = 250;
                //img.width = 250;
                //document.getElementById('pic').appendChild(img);
            }
            else{
                console.log("NO user is logged in")
            }


            var id = user.uid
            var docRef = db.collection("users").doc(id);

            //Checks user
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    if(doc.data()["admin"]){
                        console.log("Admin Signed in")  
                        document.getElementById('admin').style.display = 'block';
                    }
                    else{
                        console.log("Resident Signed in")
                        var docRef = db.collection("settings").doc("GIA_Application");

                        docRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("Document data:", doc.data());
                                if(!doc.data()["GIA_Button"]){
                                    console.log("GIA Button Disabled")
                                    document.getElementById('GIA_App').style.display = 'none';
                                }
                                console.log("GIA Button Enabled")
                            } else {
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting GIA_Application:", error);
                        });
                    }


                } else {
                    console.log("No such user exists");
                }
            }).catch(function(error) {
                console.log("Error getting users:", error);
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

    } else {
        console.log('No User Signed in'); // No user is signed in.
    }

}); 

// Now we need to run the code that will be executed only for jobApp page.
myApp.onPageBeforeInit('jobApp', function (page) {
    // Do something here for "jobApp" page
    console.log("jobApp");
    var user = firebase.auth().currentUser;






    var id = user.uid
    var docRef = db.collection("users").doc(id);

    docRef.get().then(function(doc) {
        if (doc.exists) {

            //load data relevant to Admin
            if(doc.data()["admin"]){ 
                console.log("Admin Signed in")
                document.getElementById('applications').style.display = 'inline';

                //See who submitted an application
                db.collection("GIA_Applications")
                    .onSnapshot(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        //console.log("Getting application of: " + doc.id);


                        var docRef = db.collection("users").doc(doc.id);
                        var id = doc.id;

                        //DOM elements to add
                        docRef.get().then(function(doc) {
                            if (doc.exists) {

                                var name_user = doc.data()["name"];
                                var a = document.createElement("a");
                                var list = document.createElement("li");
                                var i = document.createElement("i")
                                var div = document.createElement("div");
                                var div2 = document.createElement("div");
                                var div3 = document.createElement("div");

                                console.log(doc.data()["name"])

                                docRef = db.collection("GIA_Applications").doc(doc.id);
                                var element="";
                                docRef.get().then(function(doc) {



                                    if(doc.data()["accepted"]){

                                        element = document.getElementById("accepted");
                                    }

                                    else{

                                        element = document.getElementById("waiting");

                                        a.href="application.html";
                                        i.className ="icon icon-forward";
                                    }

                                    a.className="Resident-Application";

                                    a.id=id;
                                    a.onclick=function() {
                                        console.log("Sending id: " +this.id)
                                        console.log("Sending Name: " +name_user)
                                        passed_id=this.id
                                        passed_name=name_user;
                                    };


                                    list.className ="item-content";
                                    div.className ="item-inner";
                                    div2.className ="item-title";
                                    div3.className = "item-after";

                                    var node = document.createTextNode(name_user);
                                    div3.appendChild(i)
                                    div2.appendChild(node);
                                    div.appendChild(div2);
                                    div.appendChild(div3)
                                    list.appendChild(div)
                                    a.appendChild(list)


                                    element.appendChild(a);

                                }).catch(function(error) {
                                    console.log("Error getting document:", error);
                                });









                            } else {
                                console.log("No such user: " + doc.id);
                            }
                        }).catch(function(error) {
                            console.log("Error getting Users who submitted applications:", error);
                        });

                    });
                }, function(error) {
                    console.log("Error getting documents: ", error);
                });

                $$('.start-button').on('click', function(){
                    myApp.alert('Application period started!', 'I-House')
                    db.collection("settings").doc("GIA_Application").set({
                        GIA_Button: true
                    }).then(function() {
                        console.log("GIA period successfully started");
                        document.getElementById('status').innerHTML="<b>Open</b>";})
                });

                $$('.end-button').on('click', function(){
                    myApp.alert('Application period ended!', 'I-House') 
                    db.collection("settings").doc("GIA_Application").set({
                        GIA_Button: false
                    }).then(function() {
                        console.log("GIA period successfully ended");
                        document.getElementById('status').innerHTML="<b>Closed</b>";})
                });

                var docRef = db.collection("settings").doc("GIA_Application");

                docRef.get().then(function(doc) {
                    if (doc.exists) {
                        //console.log("Document data:", doc.data());
                        if(doc.data()["GIA_Button"]){
                            document.getElementById('status').innerHTML="<b>Open</b>";
                        }
                        else{
                            document.getElementById('status').innerHTML="<b>Closed</b>";
                        }

                    } else {
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting GIA_Application:", error);
                })


                var ptrContent = $$('.pull-to-refresh-content');



            }

            //load data relevant to Resident
            else{
                console.log("Resident Signed in")

                document.getElementById('my-form').style.display = 'inline';
                document.getElementById('availability').style.display = 'inline';

                //Stores the Data to Firebase
                $$('#submitButton').on('click', function(){
                    var formData = myApp.formToJSON('#my-form'); //turns all the form fields into JSON
                    formData.accepted = false;

                    var availData = myApp.formToJSON('#availability'); //turns all the form fields into JSON
                    var availability = 0
                    for (var key in availData) {
                        availability = availability +  availData[key].length;
                    }


                    var Monday = {"10-12":false, "12-2":false, "2-4":false, "4-6":false, "6-11":false};
                    var Tuesday = {"10-12":false, "12-2":false, "2-4":false, "4-6":false, "6-11":false};
                    var Wednesday = {"10-12":false, "12-2":false, "2-4":false, "4-6":false, "6-11":false};
                    var Thursday = {"10-12":false, "12-2":false, "2-4":false, "4-6":false, "6-11":false};
                    var Friday = {"10-12":false, "12-2":false, "2-4":false, "4-6":false, "6-11":false};
                    var Saturday = {"6-11":false};
                    var Sunday = {"6-11":false} ;

                    for (var key in availData) {
                        for (time in availData[key]){

                            var slot = availData[key][time]
                            if (key == "M"){
                                Monday[slot]=true;
                            }
                            if (key == "T"){
                                Tuesday[slot]=true;
                            }
                            if (key == "W"){
                                Wednesday[slot]=true;
                            }
                            if (key == "Th"){
                                Thursday[slot]=true;
                            }
                            if (key == "F"){
                                Friday[slot]=true;
                            }
                            if (key == "S"){
                                Saturday[slot]=true;
                            }
                            if (key == "Su"){
                                Sunday[slot]=true;
                            }
                        }
                    }

                    var weeks={Monday: Monday, Tuesday:Tuesday, Wednesday:Wednesday, Thursday:Thursday, Friday:Friday, Saturday:Saturday, Sunday:Sunday, availability: availability}    

                    var GIARef = db.collection("GIA_Applications").doc(id);

                    GIARef.set(availData);

                    GIARef.set(weeks, { merge: true });

                    GIARef.set(formData, { merge: true }).then(function() {

                        console.log("Document successfully written");
                        location.href="home.html";
                    });

                });

            }

        }
        else {
            console.log("No such document!");
        }}).catch(function(error) {
        console.log("Error getting users for admin check:", error);
    });




});

// Now we need to run the code that will be executed only for schedule page.
myApp.onPageInit('schedule', function (page) {
    // Do something here for "schedule" page
    console.log("schedule");


    var user = firebase.auth().currentUser;


    var id = user.uid
    var docRef = db.collection("users").doc(id);

    docRef.get().then(function(doc) {
        if (doc.exists) {

            //load data relevant to Admin
            if(doc.data()["admin"]){ 
                console.log("Admin Signed in")
                document.getElementById('adminz').style.display = 'block';

                var accepted_users=[];
                var query = [];


                $$('#generate').on('click', function(){
                    new Promise(function(resolve) {
                        resolve();
                        accepted_users = sortUsers();
                    }).then(function() {
                        console.log(accepted_users);
                    });


                    new Promise(function(resolve) {
                        resolve();
                        query = assign();
                    }).then(function() {
                        console.log(query);
                    });






                });
            }

            //load data relevant to Resident
            else{
                console.log("Resident Signed in")
                document.getElementById('resident').style.display = 'block';

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

            }

        }
        else {
            console.log("No such document!");
        }}).catch(function(error) {
        console.log("Error getting users for admin check:", error);
    });


    function sortUsers(){
        var arr =[];
        var GIARef = db.collection("GIA_Applications");

        GIARef.orderBy("availability")
            .get()
            .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var id = doc.id;
                arr.push(id);

            });
        })
            .catch(function(error) {
            //console.log("Error getting documents: ", error);
        });
        return arr;

    }



    function assign(){
        var arr =[];
        var GIARef = db.collection("GIA_Applications");
        var query = GIARef.where("M", "", 0);
        // Create a query against the collection.
        query.get()
            .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var id = doc.id;
                arr.push(id);

            });
        })
            .catch(function(error) {
            //console.log("Error getting documents: ", error);
        });;
        return arr;


    }




});

myApp.onPageInit('addResident', function (page) {
    // Do something here for "Add Resident" page
    console.log("Add Resident");
});

myApp.onPageBeforeInit('GIAapplication', function (page) {
    // Do something here for "Application" page
    console.log("User Application");
    console.log("Passed_id: " + passed_id);
    var id = passed_id;
    var name = passed_name;
    var data ={};
    document.getElementById("title").innerHTML = passed_name;

    const docRef = db.collection("GIA_Applications").doc(id);


    docRef.get().then(function(doc) {

        if (doc.exists) {

            data = doc.data();
            myApp.formFromJSON('#their-form', data);
            var GIA = "";
            if (doc.data()["GIASelected1"] == "OA"){
                console.log("OA");
                GIA = "Office Aid"
            }
            else{
                GIA = "Evening Receptionist"
            }
            document.getElementById("GIA").innerHTML = GIA;

        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });



    $$('#acceptButton').on('click', function(){
        db.collection("GIA_Applications").doc(id).set({
            accepted: true
        }, { merge: true });

        var myNode = document.getElementById("waiting")
        console.log(myNode)

        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        
        myNode = document.getElementById("accepted")

        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        

    });

    $$('#rejectButton').on('click', function(){
        db.collection("GIA_Applications").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });


        var child = document.getElementsByClassName("Resident-Application")
        child.parentNode.removeChild(child);
    });


});