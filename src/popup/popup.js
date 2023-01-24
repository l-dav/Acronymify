
// Show version
document.getElementById("version").textContent = 'Version ' + chrome.runtime.getManifest().version;

// Show author
document.getElementById("author").textContent = 'Author: ' + chrome.runtime.getManifest().author;

// Show keyboard shortcut
document.getElementById("keyboard_shortcut").textContent = chrome.runtime.getManifest().commands._execute_action.suggested_key.default;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions


// save data to local storage
function save_data(url, local_config, db) {
	if (url) chrome.storage.local.set({url: url});

	if (local_config) chrome.storage.local.set({local_config: local_config});
	
	if (db) chrome.storage.local.set({db: db});

	chrome.storage.local.set({case_sensitive: document.getElementById("case_sensitive_option").checked});
}


// append a definition element
function appendHTML(parent_id, element) {
	let html_code = `
		<p><span>${element.Acronym}</span> : <span>${element.Meaning}</span></p>
		<p style="padding-left:30px">${element.Hint}</p>
		<p style="padding-left:30px">${element.Alternatives}</p>
		<p style="padding-left:30px">${element.url}</p>
	`;

	var div = document.createElement("div");
	div.innerHTML = html_code;
	document.getElementById(parent_id).appendChild(div);
}


// return default JSON configuration file, as string
function get_default_config() {
	return `{
		"acronyms_source" : "https://raw.githubusercontent.com/l-dav/Acronymify/new_interface/acronyms/computer.json",
		"url_add" : "https://your_server.com/pr",
		"mail_add" : "your@mail.com",
		"custom_entries" : [{
			"Acronym": "your_acronym",
			"Meaning": "your_full_meaning",
			"Hint": "your_definition",
			"Alternatives": "your_alternatives",
			"url": "your_url"
		}]
	}`;
}


function onExecuted(result) {
	console.log(result);

	if (result[0]) result = result[0].result;
	if (result != '') { // if a word is selected
		document.getElementById("main_page").style.display = "none";
		document.getElementById("word_definition").style.display = "block";
		
		result = result.trim(); // remove leading and trailing spaces

		case_sensitive = document.getElementById("case_sensitive_option").checked;

		// loop and show all elements that match the wanted acronym 'result'
		let found_entry = false;
		DB['entries'].forEach(element => {
			if (case_sensitive) {
				if (element['Acronym'] === result) {
					appendHTML("word_definition", element);
					found_entry = true;
				}
			} else {
				if (element['Acronym'].toUpperCase() === result.toUpperCase()) {
					appendHTML("word_definition", element);
					found_entry = true;
				}
			}
		});

		// if no entry was found, then we show the user that we don't know this word.
		if (!found_entry) {
			document.getElementById("word_definition").textContent = "Unknown word: " + result;
		}
	} else {
		// document.getElementById("online_db_loading_result").textContent = DB['entries'].length + " entries loaded.";
		document.getElementById("search_word_in_db").placeholder = "Search DB (" + DB['entries'].length + " entries)";
	}
}


function reset() {
	// clear storage
	chrome.storage.local.clear();

	// reload popup
	chrome.runtime.reload();
}


function refresh_local_configuration() {
	// Show that we are loading ...
	document.getElementById("online_db_loading_result").textContent = "...";

	try {
		local_config = JSON.parse(document.getElementById("local_configuration").value);
		save_data(false, JSON.stringify(local_config, null, 2), false);

		fetch(local_config["acronyms_source"])
			.then(response => 
				response.json()
			)
			.then(response => {
				document.getElementById("local_configuration").value = JSON.stringify(local_config, null, 2);

				save_data(false, false, JSON.stringify(response, null, 2));

				document.getElementById("online_db_loading_result").textContent = response['entries'].length + " entries fetched.";
				chrome.runtime.reload();
			})
			.catch(_ => {
				document.getElementById("online_db_loading_result").textContent = "WARNING: saving OK, but online source fetching failed.";
			});
	} catch (err) {
		document.getElementById("online_db_loading_result").textContent = "ERROR: Error in JSON format. Please put a valid JSON format.";
	}
}


function search_in_db() {
	let word = document.getElementById("search_word_in_db").value;
	document.getElementById("word_definition_search").innerHTML = "";

	case_sensitive = document.getElementById("case_sensitive_option").checked;

	// loop and show all elements that match the wanted acronym 'result'
	let found_entry = false;
	DB['entries'].forEach(element => {
		if (case_sensitive) {
			if (element['Acronym'] === word) {
				appendHTML("word_definition_search", element);
				found_entry = true;
			}
		} else {
			if (element['Acronym'].toUpperCase() === word.toUpperCase()) {
				appendHTML("word_definition_search", element);
				found_entry = true;
			}
		}
	});

	// if no entry was found, then we show the user that we don't know this word.
	if (!found_entry) {
		document.getElementById("word_definition_search").textContent = "Unknown word: " + word;
	}

}


function load_option_page() {
	chrome.runtime.openOptionsPage();
}


async function requestPermissions() {

	function onResponse(response) {
		if (response) {
			console.log("Permission was granted");
			document.body.style.display = "block";
			refresh_local_configuration();
		} else {
			console.log("Permission was refused");
		}

		return chrome.permissions.getAll();
	}

	const permissionsToRequest = {
		origins: ["<all_urls>"]
	}

	document.body.style.display = "none";
	const response = await chrome.permissions.request(permissionsToRequest);
	await onResponse(response);
}


async function hide_popup_and_ask_permission() {

	function onResponse(response) {
		if (response) {
			console.log("Permission was granted");
		} else {
			console.log("Permission was refused");
		}

		return chrome.permissions.getAll();
	}

	const permissionsToRequest = {
		origins: ["<all_urls>"]
	}

	document.body.style.display = "none";
	const response = await chrome.permissions.request(permissionsToRequest);
	await onResponse(response);
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add click listener


// call reset function onclick
document.getElementById("reset_params").onclick = reset;

// save checkbox value
document.getElementById("case_sensitive_option").onclick = save_data;

// search in DB
document.getElementById("search_in_db").onclick = search_in_db

// load option page onclick
document.getElementById("load_option_page").onclick = load_option_page


// request permission if needed
// chrome.permissions.getAll()
// 	.then((res) =>  {
// 		if (res.origins.length == 0) 	document.getElementById("default_config").style.display = "none";
// 		else  						 	document.getElementById("ask_permissions").style.display = "none";
// 	});

document.getElementById("refresh_local_configuration_button22").onclick = hide_popup_and_ask_permission;

chrome.permissions.getAll()
	.then((res) =>  {
		if (res.origins.length == 0) 	document.getElementById("refresh_local_configuration_button").onclick = requestPermissions;
		else  						 	document.getElementById("refresh_local_configuration_button").onclick = refresh_local_configuration;
	});

// Execute a function when the user presses a key on the keyboard
document.getElementById("search_word_in_db").addEventListener("keypress", function(event) {
	// If the user presses the "Enter" key on the keyboard
	if (event.key === "Enter") search_in_db();
  }); 


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// load storage data

var DB = new Object();

chrome.storage.local.get() // get all stored data, key/value
	.then((res) => {

		// load DB from local storage. Initialize the variable DB.
		if (res.db != undefined) DB = JSON.parse(res.db);
		else DB['entries'] = [];

		// load local config ; from storage or else from default config
		if (res.local_config != undefined) local_config = JSON.parse(res.local_config);
		else local_config = JSON.parse(get_default_config());
		
		// check the key 'mail_add' (email this mail to make suggestions)
		if (local_config.hasOwnProperty("mail_add"))
			document.getElementById("suggestion_acronym").href = "mailto:" + local_config['mail_add'];
		
		// check the key 'url_add' (url to the Git repo)
		if (local_config.hasOwnProperty("url_add"))
			document.getElementById("url_add").href = local_config['url_add'];
		
		// Check for the key 'custom_entries' and concat to the other entries
		if (local_config.hasOwnProperty("custom_entries"))
			DB['entries'] = DB['entries'].concat(local_config['custom_entries']);
		
		// update our textarea with the config
		document.getElementById("local_configuration").value = JSON.stringify(local_config, null, 2);

		// if our DB is not empty (if we have entries), we check if a word is selected
		if (Object.keys(DB).length !== 0) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				var tab = tabs[0];
				if (tab) { // Sanity check
					chrome.scripting.executeScript({
						target: {
							tabId: tab.id,
						  },
						  func: () => {
							return window.getSelection() != '' ? window.getSelection().toString() : false;
						  },
						}).then((res) => onExecuted(res));
				}
			  });
		}

		// update the case sensitivity checkbox with the storage
		if (res.case_sensitive != undefined)
			document.getElementById("case_sensitive_option").checked = res.case_sensitive;



		if (res.local_config == undefined) {
			chrome.permissions.getAll()
				.then((res) =>  {
					if (res.origins.length == 0) {
						console.log("skjdhfjd");
						document.getElementById("default_config").style.display = "none";
					} else {
						console.log("vvvvvvvvvvvvvvvvvvv");
						document.getElementById("ask_permissions").style.display = "none";
					}
				});

			changepage("config");
			document.getElementById("first_time").style.display = "block";
			document.getElementById("scrollmenu").style.display = "none";
		} else {
			document.getElementById("ask_permissions").style.display = "none";
		}
});


///////////////////////////////////////////////


document.getElementById("menu_home").onclick = function() {changepage("home");};
document.getElementById("menu_config").onclick = function() {changepage("config");};
document.getElementById("menu_options").onclick = function() {changepage("options");};
document.getElementById("menu_about").onclick = function() {changepage("about");};

function changepage(id) {
	var slides = document.getElementsByClassName("part");
	for (var i = 0; i < slides.length; i++) {
		slides.item(i).style.display = "none";
	}

	var slides = document.getElementsByClassName("menuItem");
	for (var i = 0; i < slides.length; i++) {
		slides.item(i).classList.remove("selected");
	}

	document.getElementById("menu_" + id).classList.add("selected");
	document.getElementById(id).style.display = "block";
}
