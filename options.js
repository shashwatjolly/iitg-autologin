document.addEventListener('DOMContentLoaded', function() {
    update_options()
    function save_options() {
        const username = document.getElementById('un').value;
        const password = document.getElementById('pd').value;
        chrome.storage.sync.set({
            username:username,
            password:password
        }, update_options);
    }
    document.getElementById('save').addEventListener('click',()=>{
        save_options();
        const usernameField = document.getElementById('un');
        const passwordField = document.getElementById('pd');
        usernameField.value="";
        passwordField.value="";
        chrome.runtime.sendMessage({action:"login"});
    })
    function update_options() {
    chrome.storage.sync.get([
        "username",
        "password"
    ], function(items) {
        if(items.username) {
        const savebtn = document.getElementById('save');
        savebtn.textContent="Update";
        const status = document.getElementById('status');
        status.textContent = 'Credentials saved.';
        }
        else {
        const status = document.getElementById('status');
        status.textContent = 'Credentials not saved.';
        }
    });
    }
});