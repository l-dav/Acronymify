/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                               _  __       
     /\                                       (_)/ _|      
    /  \   ___ _ __ ___  _ __  _   _ _ __ ___  _| |_ _   _ 
   / /\ \ / __| '__/ _ \| '_ \| | | | '_ ` _ \| |  _| | | |
  / ____ \ (__| | | (_) | | | | |_| | | | | | | | | | |_| |
 /_/    \_\___|_|  \___/|_| |_|\__, |_| |_| |_|_|_|  \__, |
                                __/ |                 __/ |
                               |___/                 |___/ 

Website: https://github.com/l-dav/Acronymify
*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Starting Acronymify popup");

// Show version
document.getElementById("version").textContent = 'Version ' + chrome.runtime.getManifest().version;

// Show author
document.getElementById("author").textContent = 'Author: ' + chrome.runtime.getManifest().author;

// Show keyboard shortcut
document.getElementById("keyboard_shortcut").textContent = chrome.runtime.getManifest().commands._execute_browser_action.suggested_key.default;

/**
 * Return default JSON configuration
 * @returns string 
 */
function get_default_config() {
	return `{
		"acronyms_source" : "https://raw.githubusercontent.com/l-dav/Acronymify/master/acronyms/computer.json",
		"url_add" : "https://github.com/l-dav/Acronymify/pulls",
		"mail_add" : "l.davidovski@technologyandstrategy.com"
	}`;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global variables

// Store all acronyms
var DB = {};
var local_config = JSON.parse(get_default_config());

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions

/**
 * Load option page
 */
function load_option_page() {
	chrome.runtime.openOptionsPage();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add click listeners


// call reset function onclick
document.getElementById("reset_params").onclick = reset_callback;

// fetch online source
document.getElementById("fetch").onclick = fetch_callback;

// save checkbox value
document.getElementById("case_sensitive_option").onclick = function() {
	save("case_sensitive", document.getElementById("case_sensitive_option").checked);
};

// search in DB
document.getElementById("search_in_db").onclick                       = search_in_db

// load option page onclick
document.getElementById("load_option_page").onclick                   = load_option_page

// save custom acronyms
document.getElementById("refresh_local_configuration_button").onclick = save_custom_words;

// Execute a function when the user presses a key on the keyboard
document.getElementById("search_word_in_db").addEventListener("keypress", function(event) {
	// If the user presses the "Enter" key on the keyboard
	if (event.key === "Enter") search_in_db();
});

// Execute a function when the user presses a key on the keyboard
document.getElementById("online_url").addEventListener("keypress", function(event) {
	// If the user presses the "Enter" key on the keyboard
	if (event.key === "Enter") fetch_callback();
});


/**
 * Change to the given page ID
 * @param {string} id page ID
 */
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add click listeners

document.getElementById("menu_home").onclick                          = function() { changepage("home");   };
document.getElementById("menu_online").onclick                        = function() { changepage("online"); };
document.getElementById("menu_custom").onclick                        = function() { changepage("custom"); };
document.getElementById("menu_options").onclick                       = function() { changepage("options");};
document.getElementById("menu_about").onclick                         = function() { changepage("about");  };
document.getElementById("menu_help").onclick                          = function() { changepage("help");   };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// load storage data

chrome.storage.local.get(null, function(items) {
	document.getElementById("main_page").style.display = "block";

    console.log("Successfully loaded local storage values. Storage:");
    console.log(items);

	// Load online acronyms
	if (items["online_acronyms"]) {
		console.log("setting online sources");
		DB = JSON.parse(items["online_acronyms"]);
		Object.keys(DB).forEach(source => {
			// update_table(source, DB[source]["value"].length);
			appendHTMLTableChild(source, DB[source]["value"].length, DB[source]["active"]);
		});
	}

	// Load custom acronyms
	if (items.hasOwnProperty("custom_acronyms")) {
		custom_acronyms = JSON.parse(items["custom_acronyms"]);
		// DB = DB.concat(custom_acronyms);
		DB["custom"] = {"value": custom_acronyms, "active": true};
		document.getElementById("local_configuration").value = JSON.stringify(custom_acronyms, null, 2);
	} else {
		custom_acronyms = false;
	}

	// load local config (url add & mail add) ; from storage, or from default config
	if (items.local_config != undefined) local_config = JSON.parse(items.local_config);
	
	update_params();

	// if our DB is not empty (if we have entries), we check if a word is selected
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var tab = tabs[0];
		console.log(`Current tab: ${tab.url}`);
		if (tab && !tab.url.startsWith('chrome') && !tab.url.startsWith('about:')) { // Sanity check
			const getWindowSelection = "window.getSelection() != '' ? window.getSelection().toString() : false;";

			chrome.tabs.executeScript(tab.id,{
				code: getWindowSelection
			},show_definition);
			
		} else {
			show_definition(false);
		}
	});

	// update the case sensitivity checkbox with the storage
	console.log(`Option case sensitive: ${items.case_sensitive}`);
	if (items.case_sensitive != undefined)
		document.getElementById("case_sensitive_option").checked = items.case_sensitive;

	update_home_placeholder_nb_entries();

	document.getElementById('search_word_in_db').focus();
});
