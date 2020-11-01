chrome.runtime.onInstalled.addListener(function (details) {
  chrome.runtime.openOptionsPage();
});

console.log("AutoLogin Started");
chrome.browserAction.setIcon({path: "iconDisconnected.png"});		

var username;
var password;

function get_options() {
  chrome.storage.sync.get([
    "username",
    "password"
  ], function(items) {
    if(items.username) {
      username = items.username;
      password = items.password;
      start();
    }
    else {
      console.log("AutoLogin credentials not saved");
      return;
    }
  });
}

function start() {
	$.ajax({		// logout first
        url: "https://agnigarh.iitg.ac.in:1442/logout?030403030f050d06",
        type: "GET",
        success: function() {
        	$.ajax({
				url: "https://agnigarh.iitg.ac.in:1442/login?",
				type: "GET",
				success: login,
				error: function(error) {
					console.log(error);
					start();
				}
			});
        },
        error: function(error) {
          console.log(error);
          start();
        }
  	});
}

function login(result) {
	console.log(result);
	const magic = $(result).find('[name="magic"]').attr("value");
	const Tredir = $(result).find('[name="4Tredir"]').attr("value");
	console.log(magic);
	console.log(Tredir);
	const payload = {'4Tredir': Tredir, 'magic': magic, 'username': username, 'password': password};
	$.ajax({		// now login
		url: "https://agnigarh.iitg.ac.in:1442",
		data: payload,
		type: "POST",
		success: keepalive,
		error: function(error) {
			console.log(error);
			start();
		}
	});
	
}

function keepalive(result) {
	console.log(result);
	if(result.search("logged in as")!=-1) {
		chrome.browserAction.setIcon({path: "iconConnected.png"});
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
		// $.ajax({
	 //        url: "https://agnigarh.iitg.ac.in:1442/logout?030403030f050d06",
	 //        type: "GET",
	 //        success: start,
	 //        error: function(error) {
	 //          console.log(error);
	 //        }
  //     	});
	}
	const url = $(result).text().split("location.href=")[1].split("\"")[1];
	console.log(url);
	if(url) {
		$.ajax({
			url,
			type: "GET",
			success: function(result) {
				console.log("AutoLogin Refreshed")
				chrome.browserAction.setIcon({path: "iconConnected.png"});
				iconWatch(url);
			},
			error: function(error) {
				console.log(error);
				chrome.browserAction.setIcon({path: "iconDisconnected.png"});
			}
		});
	}
}

function iconWatch(url) {
	setInterval(function(){
		if(url) {
			$.ajax({
				url,
				type: "GET",
				success: function(result) {
					chrome.browserAction.setIcon({path: "iconConnected.png"});
				},
				error: function(error) {
					chrome.browserAction.setIcon({path: "iconDisconnected.png"});
				}
			});
		}
	}, 2000);
}

get_options();