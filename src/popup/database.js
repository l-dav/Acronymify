// handle database functions


/**
 * Set the placeholder of `search_word_in_db` with the correct value of number of words in the DB
 */
function update_home_placeholder_nb_entries() {
	document.getElementById("search_word_in_db").placeholder = "Search DB (" + get_database_length() + " entries)";
}


function get_database_length(include_only_selected = true) {
	total = 0;
	Object.keys(DB).forEach(source => {
		if ((include_only_selected && DB[source]["active"]) || !(include_only_selected))
			total += DB[source]["value"].length;
	});
	return total;
}


/**
 * Search a word
 */
function search_in_db() {
	let word = document.getElementById("search_word_in_db").value;
	document.getElementById("word_definition_search").innerHTML = "";

	word = word.trim();

	case_sensitive = document.getElementById("case_sensitive_option").checked;
	autocomplete = document.getElementById("auto_completion_option").checked;

	// loop and show all elements that match the wanted acronym 'result'
	let found_entry = false;
	Object.keys(DB).forEach(source => {
		if (DB[source]["active"]) {
			DB[source]["value"].forEach(element => {
				if (case_sensitive && autocomplete) {
					if (element['Acronym'] === word) {
						appendHTML("word_definition_search", element, prepend=true);
						found_entry = true;
					}
					else if (element['Acronym'].startsWith(word)) {
						appendHTML("word_definition_search", element);
						found_entry = true;
					}
				} else if (!case_sensitive && autocomplete) {
					if (element['Acronym'].toUpperCase() === word.toUpperCase()) {
						appendHTML("word_definition_search", element, prepend=true);
						found_entry = true;
					}
					else if (element['Acronym'].toUpperCase().startsWith(word.toUpperCase())) {
						appendHTML("word_definition_search", element);
						found_entry = true;
					}
				} else if (case_sensitive && !autocomplete) {
					if (element['Acronym'] === word) {
						appendHTML("word_definition_search", element);
						found_entry = true;
					}
				} else if (!case_sensitive && !autocomplete) {
					if (element['Acronym'].toUpperCase() === word.toUpperCase()) {
						appendHTML("word_definition_search", element);
						found_entry = true;
					}
				} else {
					console.log("If you read this line, there is a problem in the program.");
				}
			});
		}
	});

	// if no entry was found, then we show the user that we don't know this word.
	if (!found_entry) {
		document.getElementById("word_definition_search").textContent = "Unknown word: " + word;
	}
}