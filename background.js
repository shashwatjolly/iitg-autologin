chrome.runtime.onInstalled.addListener(function() {
    chrome.runtime.openOptionsPage();
});
var username;
var password;
chrome.action.setIcon({path: "iconDisconnected.png"});		
function getcred(){
    chrome.storage.sync.get([
        "username",
        "password"
      ], function(result) {
        if(result.username) {
            username = result.username;
            password = result.password;
            start();
        }
        else {
            console.log("AutoLogin credentials not saved");
            return;
        }
    });
}
function start() {
    fetch("https://agnigarh.iitg.ac.in:1442/logout?",{
        method:'GET',
    })
    .then(res=>{
        if(!res.ok){
            alert("Logout Unsuccessful");
            start();
        }
    })
    .then(()=>{
        fetch("https://agnigarh.iitg.ac.in:1442/login?")
        .then(response=>{
            if(!response.ok){
                alert("Login Unsuccessful");
                start();
            }
            return response.text();
        })
        .then(data => {
            // console.log(data);
            var magic = data.split('name="magic" value="')[1].substring(0,16);
            var tredir = "https://agnigarh.iitg.ac.in:1442/login?"
            login(magic,tredir);
        })
        .catch(error => {
            console.error("Error fetching website data:",error);
            start();
        })
    }).catch(error => {
        console.log(error);
        start();
    })
}

function login(magic,tredir){
    const payload = {'4Tredir': tredir, 'magic': magic, 'username': username, 'password': password};
    let formData = new URLSearchParams();
    formData.append('4Tredir', tredir);
    formData.append('magic', magic);
    formData.append('username',username);
    formData.append('password', password);
    fetch("https://agnigarh.iitg.ac.in:1442",{
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formData
    }).then((response)=>{
        return response.text();
    }).then((response)=>{
        chrome.action.setIcon({path: "iconConnected.png"});
        keepalive(response);
    }).catch(error=>{
        console.log(error);
        start();
    });
}

function keepalive(result){
    console.log(result);
    var url = "https://agnigarh.iitg.ac.in:1442/keepalive?"
    if(result.search("logged in as")!=-1) {
		chrome.action.setIcon({path: "iconConnected.png"});
	}
	if(result.search("Firewall authentication failed")!=-1) {
		chrome.notifications.create({
	      "type": "basic",
	      "title": "Incorrect Credentials!",
	      "iconUrl": "icon.png",
	      "message": "Credentials entered for AutoLogin are incorrect. Please change credentials and try again."
	    });
	    return;
	}
	if(result.search("concurrent authentication")!=-1) {
		chrome.notifications.create({
	      "type": "basic",
	      "title": "Concurrent limit reached!",
	      "iconUrl": "icon.png",
	      "message": "Maybe you are logged in somewhere else too."
	    });
	    return;
	}
    setInterval(function(){
        if(url) {
            fetch(url).then(response=>{
                if(!response.ok){
                    chrome.action.setIcon({path: "iconDisconnected.png"});
                }else{
                    chrome.action.setIcon({path: "iconConnected.png"});
                }
            }).catch(error=>{
                console.log(error);
                chrome.action.setIcon({path: "iconDisconnected.png"});
            })
        }
    }, 600000);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "login") {
        getcred();
    }else if(message.action === "logout"){
        fetch("https://agnigarh.iitg.ac.in:1442/logout?").then(response=>{
            if(response.ok){
                chrome.action.setIcon({path: "iconDisconnected.png"});
            }
        }).catch(error=>{
            console.log(error);
        });
    }
});
