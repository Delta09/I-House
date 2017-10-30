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

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


$$('.open-login').on('click', function () {
  myApp.loginScreen();
});

// Now we need to run the code that will be executed only for jobApp page.
myApp.onPageInit('jobApp', function (page) {
    // Do something here for "jobApp" page
    console.log("jobApp");
});

// Now we need to run the code that will be executed only for schedule page.
myApp.onPageInit('schedule', function (page) {
    // Do something here for "schedule" page
    console.log("schedule");
    
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