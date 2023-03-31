//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// load storage data

chrome.storage.local.get(null, function(res) {
	if (res.online_acronyms != undefined) {
		DB = JSON.parse(res["online_acronyms"]);
		Object.keys(DB).forEach(source => {
			DB[source]["value"].forEach(element => {
				appendHTML("word_definition", element);
			});
		});
	}

	if (res.custom_acronyms)
		JSON.parse(res.custom_acronyms).forEach(element => {
			appendHTML("word_definition", element);
		});
});
