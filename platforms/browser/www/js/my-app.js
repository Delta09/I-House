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


const docRef = firestore.doc("users/username");
const user = document.querySelector("#user");
const password = document.querySelector("#password");
const loginButton = document.querySelector("#login");

loginButton.addEventListener("click", function(){
    const username = user.value;
    console.log("I am going to save " + username + " to FireStore");
    docRef.set({
        user: username
    }).then(function(){
            console.log("Saved");
    }).catch(function (error){
        console.log("Got an error: ", error);
    });
})   