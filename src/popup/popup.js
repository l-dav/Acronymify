
// Show version
document.getElementById("version").textContent = 'Version ' + browser.runtime.getManifest().version;

// Show author
document.getElementById("author").textContent = 'Author: ' + browser.runtime.getManifest().author;

// Show keyboard shortcut
document.getElementById("keyboard_shortcut").textContent = browser.runtime.getManifest().commands._execute_browser_action.suggested_key.default;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions


// save data to local storage
function save_data(url, local_config, db) {
	if (url) browser.storage.local.set({url: url});

	if (local_config) browser.storage.local.set({local_config: local_config});
	
	if (db) browser.storage.local.set({db: db});

	browser.storage.local.set({case_sensitive: document.getElementById("case_sensitive_option").checked});
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
		"acronyms_source" : "https://truc.muche/file.json" ,
		"url_add" : "https://truc.muche/pr" ,
		"mail_add" : "truc@much.com" ,
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
	result = result[0];
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
		document.getElementById("online_db_loading_result").textContent = DB['entries'].length + " entries loaded.";
	}
}

function reset() {
	// clear storage
	browser.storage.local.clear();

	// reload popup
	browser.runtime.reload();
}

function refresh_local_configuration() {
	// Show that we are loading ...
	document.getElementById("online_db_loading_result").textContent = "...";

	try {
		local_config = JSON.parse(document.getElementById("local_configuration").value);

		// Fetch online ressource
		fetch(local_config["acronyms_source"])
		.then(response => response.json())
		.then(response => {
			document.getElementById("local_configuration").value = JSON.stringify(local_config, null, 2);

			save_data(false, JSON.stringify(local_config, null, 2), JSON.stringify(response, null, 2));

			document.getElementById("online_db_loading_result").textContent = response['entries'].length + " entries fetched.";
			browser.runtime.reload();
		})
		.catch(
			document.getElementById("online_db_loading_result").textContent = "ERROR: Error while fetching online DB. Please check your source URL."
		);

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add click listener


// call reset function onclick
document.getElementById("reset_params").onclick = reset;

// save checkbox value
document.getElementById("case_sensitive_option").onclick = save_data;

// triggered when we want to save our modifications ; our acronyms
document.getElementById("refresh_local_configuration_button").onclick = refresh_local_configuration

// search in DB
document.getElementById("search_in_db").onclick = search_in_db


// Execute a function when the user presses a key on the keyboard
document.getElementById("search_word_in_db").addEventListener("keypress", function(event) {
	// If the user presses the "Enter" key on the keyboard
	if (event.key === "Enter") {
	  // Cancel the default action, if needed
	  //event.preventDefault();
	  // Trigger the button element with a click
	  //document.getElementById("myBtn").click();
	  search_in_db();
	}
  }); 


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// load storage data

var DB = new Object();

browser.storage.local.get() // get all stored data, key/value
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
			// One-liner to get the current selected word on the page
			const getWindowSelection = "window.getSelection() != '' ? window.getSelection().toString() : false;";

			// When the popup is loaded, execute the script in the main page and get result
			browser.tabs.executeScript({code: getWindowSelection}).then(onExecuted);
		}

		// update the case sensitivity checkbox with the storage
		if (res.case_sensitive != undefined)
			document.getElementById("case_sensitive_option").checked = res.case_sensitive;
	});
