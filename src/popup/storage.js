
function save(key, value) {
	console.log(`Saving ${key} with value ${value}`);
	chrome.storage.local.set({[key]: value});
}

function save_db() {
	console.log("Saving DB");
	chrome.storage.local.set({"online_acronyms": JSON.stringify(DB)});
}

/**
 * Reset addon to zero
 */
function reset_callback() {
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
		save("custom_acronyms", JSON.stringify(JSON.parse(document.getElementById("local_configuration").value)))

		document.getElementById("custom_db_loading_result").textContent = "Saving successful.";
	} catch (err) {
		console.log(err);
		document.getElementById("custom_db_loading_result").textContent = "ERROR: Error in JSON format. Please put a valid JSON format.";
	}
}