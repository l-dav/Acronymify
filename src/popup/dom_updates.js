

/**
 * Append a definition element
 * @param {string} parent_id ID of the node to append definitions
 * @param {dict} element dict containing acronym attributes
 */
function appendHTML(parent_id, element, prepend = false) {

	// if we have an element without any attributes, don't display it
	if(!element.Meaning && !element.Hint && !element.Alternatives &&! element.url) {
		return;
	}
	
	let html_code = `<p><span>${element.Acronym}</span> : <span>${element.Meaning}</span></p>`;

	if (element.Hint)
		html_code += `<p style="padding-left:30px">${element.Hint}</p>`
	if (element.Alternatives)
		html_code += `<p style="padding-left:30px">${element.Alternatives}</p>`
	if (element.url)
		html_code += `<p style="padding-left:30px">${element.url}</p>`

	var div = document.createElement("div");
	div.innerHTML = html_code;

	if (prepend) {
		document.getElementById(parent_id).prepend(div);
	}
	else {
		document.getElementById(parent_id).appendChild(div);
	}
}


function appendHTMLTableChild(source_title, source_length, source_active) {
	var new_row = document.getElementById("source_table_body").insertRow();

	var newCell0 = new_row.insertCell();
	const checkbox = document.createElement("input");
	checkbox.type = 'checkbox';
    checkbox.checked = source_active;
    checkbox.id = source_title + "checkbox";
    checkbox.addEventListener('change', (event) => {
        DB[source_title]["active"] = event.currentTarget.checked;
		save("online_acronyms", JSON.stringify(DB));
		update_home_placeholder_nb_entries();
      })
	newCell0.appendChild(checkbox);

	var newCell1 = new_row.insertCell();
	newCell1.textContent = source_title;

	var newCell2 = new_row.insertCell();
	newCell2.textContent = source_length;
	newCell2.id = source_title + "len";

	new_row.classList.add("mdl-data-table__row");
	newCell1.classList.add("mdl-data-table__cell--non-numeric");
}


function update_table(source, len) {
	// update sources table if necessary
	var inside = DB.hasOwnProperty(source) && document.getElementById(source + "len");

	if (inside) {
		document.getElementById(source + "len").textContent = len;
	} else {
		appendHTMLTableChild(source, len, true);
	}
}


function update_params() {
	// check the key 'mail_add' (email this mail to make suggestions)
	document.getElementById("suggestion_acronym").href = "mailto:" + local_config['mail_add'];
	
	// check the key 'url_add' (url to the Git repo)
	document.getElementById("url_add").href = local_config['url_add'];
	
	// update our textarea with the config
	document.getElementById("online_url").value = local_config["acronyms_source"];

	if (get_database_length() == 0) {
		document.getElementById("first_time").style.display = "block";
	} else {
		document.getElementById("first_time").style.display = "none";
	}
}