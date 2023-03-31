/**
 * Save a key-value pair in local storage.
 * @param {string} key - The key to be saved.
 * @param {string} value - The value to be saved.
 */
const save = (key, value) => {
	chrome.storage.local.set({ [key]: value });
};

/**
 * Save the online acronyms database in local storage.
 */
const save_db = () => {
	chrome.storage.local.set({ "online_acronyms": JSON.stringify(DB) });
};

/**
 * Reset the extension to its initial state by clearing local storage and reloading the popup.
 */
const reset_callback = () => {
	chrome.storage.local.clear();
	chrome.runtime.reload();
};

/**
 * Save custom words entered by the user.
 */
const save_custom_words = () => {
	try {
		const customAcronyms = JSON.parse(document.getElementById("local_configuration").value);
		save("custom_acronyms", JSON.stringify(customAcronyms));
		document.getElementById("custom_db_loading_result").textContent = "Saving successful.";
	} catch (err) {
		console.error(err);
		document.getElementById("custom_db_loading_result").textContent = "ERROR: Invalid JSON format. Please enter valid JSON data.";
	}
};