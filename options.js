get_options();

// Saves options to chrome.storage
function save_options() {
  const username = document.getElementById('un').value;
  const password = document.getElementById('pd').value;
  // console.log("input un", username);
  // console.log("input pd", password);
  chrome.storage.sync.set({
    username,
    password
  }, get_options);
}

$("form").on('submit', function (e) {
   e.preventDefault();
   save_options();
   const usernameField = document.getElementById('un');
   const passwordField = document.getElementById('pd');
   usernameField.value="";
   passwordField.value="";
   chrome.extension.getBackgroundPage().get_options(); 
});

function get_options() {
  chrome.storage.sync.get([
    "username",
    "password"
  ], function(items) {
    if(items.username) {
      const savebtn = document.getElementById('save');
      savebtn.textContent="Update";
      const status = document.getElementById('status');
      status.textContent = 'Credentials saved.';
      // console.log(items.username);
      // console.log(items.password);
    }
    else {
      const status = document.getElementById('status');
      status.textContent = 'Credentials not saved.';
      // console.log(items.username);
      // console.log(items.password);
    }
  });
}
// document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('save').addEventListener('click',
//     save_options);