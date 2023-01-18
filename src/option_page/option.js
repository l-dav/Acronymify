//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions


// append a definition element
function appendHTML(parent_id, element) {
	let html_code = `
		<hr>
		<p><span style="font-weight:bold;">${element.Acronym}</span> : <span>${element.Meaning}</span></p>
		<p style="padding-left:30px">${element.Hint}</p>
		<p style="padding-left:30px">${element.Alternatives}</p>
		<p style="padding-left:30px">${element.url}</p>
	`;

	var div = document.createElement("div");
	div.innerHTML = html_code;
	document.getElementById(parent_id).appendChild(div);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// load storage data

browser.storage.local.get() // get local storage
	.then((res) => {
		// load DB from local storage. Initialize the variable DB.
		if (res.db != undefined) 
			JSON.parse(res.db)['entries'].forEach(element => {
				appendHTML("word_definition", element);
			});

		if (res.local_config)
			JSON.parse(res.local_config)['custom_entries'].forEach(element => {
				appendHTML("word_definition", element);
			});
	});
