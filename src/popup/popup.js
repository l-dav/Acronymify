
// Show version
document.getElementById("version").textContent = 'Version ' + chrome.runtime.getManifest().version;

// Show author
document.getElementById("author").textContent = 'Author: ' + chrome.runtime.getManifest().author;

// Show keyboard shortcut
document.getElementById("keyboard_shortcut").textContent = chrome.runtime.getManifest().commands._execute_action.suggested_key.default;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions


/**
 * Save params to local storage
 * @param {string} local_config    JSON string containing `acronyms_source`, `url_add`, `mail_add`
 * @param {string} custom_acronyms JSON string containing local acronyms
 * @param {string} online_acronyms JSON string containing acronyms defined from an online source
 */
function save_data(local_config, custom_acronyms, online_acronyms) {
	if (local_config)     chrome.storage.local.set({local_config: local_config});
	
	if (custom_acronyms)  chrome.storage.local.set({custom_acronyms: custom_acronyms});

	if (online_acronyms)  chrome.storage.local.set({online_acronyms: online_acronyms});

	chrome.storage.local.set({case_sensitive: document.getElementById("case_sensitive_option").checked});
}


/**
 * Append a definition element
 * @param {string} parent_id ID of the node to append definitions
 * @param {dict} element
 */
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


/**
 * Return default JSON configuration
 * @returns string 
 */
function get_default_config() {
	return `{
		"acronyms_source" : "https://raw.githubusercontent.com/l-dav/Acronymify/master/acronyms/computer.json",
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


/**
 * Set the placeholder of `search_word_in_db` with the correct value of number of words in the DB
 */
function setNbWordInDB() {
	chrome.storage.local.get() // get all stored data, key/value
		.then((res) => {
			DB = [];
			if (res.custom_acronyms != undefined) DB = DB.concat(JSON.parse(res.custom_acronyms));
			if (res.online_acronyms != undefined) DB = DB.concat(JSON.parse(res.online_acronyms));
			document.getElementById("search_word_in_db").placeholder = "Search DB (" + DB.length + " entries)";
		});
}


/**
 * Show acronym definition (if `result`)
 * @param {dict} result 
 */
function show_definition(result) {
	console.log(result);

	if (result[0]) result = result[0].result;
	if (result != '') { // if a word is selected
		document.getElementById("main_page").style.display = "none";
		document.getElementById("word_definition").style.display = "block";
		
		result = result.trim(); // remove leading and trailing spaces

		case_sensitive = document.getElementById("case_sensitive_option").checked;

		// loop and show all elements that match the wanted acronym 'result'
		let found_entry = false;
		DB.forEach(element => {
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
	}
}


/**
 * Reset addon to zero
 */
function reset() {
	// clear storage
	chrome.storage.local.clear();

	// reload popup
	chrome.runtime.reload();
}


/**
 * Save custom words
 */
function save_custom_words() {
	try {
		save_data(false, JSON.stringify(JSON.parse(document.getElementById("local_configuration").value), null, 2), false);
		console.log(JSON.parse(document.getElementById("local_configuration").value));

		document.getElementById("online_db_loading_result").textContent = "Saving successful.";

		setNbWordInDB();
	} catch (err) {
		console.log(err);
		document.getElementById("online_db_loading_result").textContent = "ERROR: Error in JSON format. Please put a valid JSON format.";
	}
}


/**
 * Search a word
 */
function search_in_db() {
	let word = document.getElementById("search_word_in_db").value;
	document.getElementById("word_definition_search").innerHTML = "";

	case_sensitive = document.getElementById("case_sensitive_option").checked;

	// loop and show all elements that match the wanted acronym 'result'
	let found_entry = false;
	DB.forEach(element => {
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


/**
 * Load option page
 */
function load_option_page() {
	chrome.runtime.openOptionsPage();
}


/**
 * Fetch online source
 */
function fetch_url() {
	// Show that we are loading ...
	document.getElementById("online_db_loading_result").textContent = "...";

	try {
		local_config["acronyms_source"] = document.getElementById("online_url").value;

		save_data(JSON.stringify(local_config, null, 2), false, false);

		fetch(local_config["acronyms_source"])
			.then(response => 
				response.json()
			)
			.then(response => {

				console.log(response);

				local_config["url_add"] = response["url_add"];
				local_config["mail_add"] = response["mail_add"];

				console.log(local_config);

				save_data(JSON.stringify(local_config, null, 2), false, JSON.stringify(response['entries'], null, 2));

				document.getElementById("online_db_loading_result").textContent = response['entries'].length + " entries fetched.";

				setNbWordInDB();
			})
			.catch(err => {
				console.log(err);
				document.getElementById("online_db_loading_result").textContent = "ERROR: online source fetching failed (check URL or CORS policy).";
			});
	} catch (err) {
		console.log(err);
		document.getElementById("online_db_loading_result").textContent = "ERROR: Error in JSON format. Please put a valid JSON format.";
	}
}


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


// call reset function onclick
document.getElementById("reset_params").onclick                       = reset;

// fetch online source
document.getElementById("fetch").onclick                              = fetch_url;

// save checkbox value
document.getElementById("case_sensitive_option").onclick              = save_data;

// search in DB
document.getElementById("search_in_db").onclick                       = search_in_db

// load option page onclick
document.getElementById("load_option_page").onclick                   = load_option_page

// save custom acronyms
document.getElementById("refresh_local_configuration_button").onclick = save_custom_words;

document.getElementById("menu_home").onclick                          = function() { changepage("home");   };
document.getElementById("menu_config").onclick                        = function() { changepage("config"); };
document.getElementById("menu_options").onclick                       = function() { changepage("options");};
document.getElementById("menu_about").onclick                         = function() { changepage("about");  };
document.getElementById("menu_help").onclick                          = function() { changepage("help");   };

// Execute a function when the user presses a key on the keyboard
document.getElementById("search_word_in_db").addEventListener("keypress", function(event) {
	// If the user presses the "Enter" key on the keyboard
	if (event.key === "Enter") search_in_db();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// load storage data

var DB = [];
var local_config = JSON.parse(get_default_config());

chrome.storage.local.get() // get all stored data, key/value
	.then((res) => {

		// load DB from local storage. Load acronyms from local storage.
		if (res.custom_acronyms != undefined) DB = DB.concat(JSON.parse(res.custom_acronyms));
		if (res.online_acronyms != undefined) DB = DB.concat(JSON.parse(res.online_acronyms));
		

		// load local config (url add & mail add) ; from storage, or from default config
		if (res.local_config != undefined) local_config = JSON.parse(res.local_config);
		
		// check the key 'mail_add' (email this mail to make suggestions)
		// if (local_config.hasOwnProperty("mail_add"))
		document.getElementById("suggestion_acronym").href = "mailto:" + local_config['mail_add'];
		
		// check the key 'url_add' (url to the Git repo)
		// if (local_config.hasOwnProperty("url_add"))
		document.getElementById("url_add").href = local_config['url_add'];
		
		if (res.custom_acronyms) custom_acronyms = JSON.parse(res.custom_acronyms);
		else custom_acronyms = local_config["custom_entries"];
		
		// update our textarea with the config
		document.getElementById("online_url").value = local_config["acronyms_source"];
		document.getElementById("local_configuration").value = JSON.stringify(custom_acronyms, null, 2);

		// if our DB is not empty (if we have entries), we check if a word is selected
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var tab = tabs[0];
			console.log("tab.url");
			console.log(tab.url);
			if (tab && !tab.url.startsWith('chrome') && !tab.url.startsWith('about:')) { // Sanity check
				chrome.scripting.executeScript({
					target: {
						tabId: tab.id,
						},
						func: () => {
						return window.getSelection() != '' ? window.getSelection().toString() : false;
						},
					}).then((res) => show_definition(res));
			} else {
				show_definition(false);
			}
		});

		// update the case sensitivity checkbox with the storage
		if (res.case_sensitive != undefined)
			document.getElementById("case_sensitive_option").checked = res.case_sensitive;
		
		setNbWordInDB();


		if (res.local_config == undefined) {
			changepage("config");
			document.getElementById("first_time").style.display = "block";
		}
});
