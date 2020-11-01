chrome.storage.sync.get([
  "username",
  "password"
], function(items) {
  if(items.username) {
    $("#msg").hide();
    $('#logout').on('click', function() {
      $.ajax({
        url: "https://agnigarh.iitg.ac.in:1442/logout?030403030f050d06",
        type: "GET",
        success: function() {
          chrome.browserAction.setIcon({path: "iconDisconnected.png"});
        },
        error: function(error) {
          console.log(error);
        }
      });
    });   
    $('#login').on('click', function() {
      chrome.extension.getBackgroundPage().get_options();
    }); 
  }
  else {
    $("#login").hide();
    $("#logout").hide();
  }
});

$('#changecred').on('click', function() {
  chrome.runtime.openOptionsPage();
}); 