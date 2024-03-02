document.addEventListener('DOMContentLoaded', function() {
    var button1 = document.getElementById('login');
    var button2 = document.getElementById('logout');
    var button3 = document.getElementById('changecred');

    button1.addEventListener('click', function() {
        chrome.runtime.sendMessage({action:"login"});
    });

    button2.addEventListener('click', function() {
        chrome.runtime.sendMessage({action:"logout"});
    });

    button3.addEventListener('click', function() {
        // Action for Button 3
        chrome.runtime.openOptionsPage();
    });
});
