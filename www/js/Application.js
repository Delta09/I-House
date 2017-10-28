//Initializre Framework7

var myApp = new Framework7();
 


/* Initialize views */
var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
})


var $$ = Dom7;

$$('.accordion-item').on('accordion:opened', function () {
  myApp.alert('Accordion item opened');
}); 
 
$$('.accordion-item').on('accordion:closed', function (e) {
  myApp.alert('Accordion item closed');
}); 

formData[name] = []; 
form.find('select[name="' + name + '"] option').each(function () { 
    if (this.selected) formData[name].push(this.value); });

console.log(FormData[name]);

$$(document).on('page:init', function(e) {
    var page = e.detail.page;
   if (page.name.indexOf('smart-select')>=0) {
       console.log("Greater than 0");
      $(page.container).find('input').on('change', function(){
         if (this.checked) console.log(this.value);
      })
   }

});