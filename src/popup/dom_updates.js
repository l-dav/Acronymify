

/**
 * Append a definition element
 * @param {string} parent_id ID of the node to append definitions
 * @param {dict} element dict containing acronym attributes
 */
function appendHTML(parent_id, element, prepend = false) {
	if(!element.Meaning && !element.Hint && !element.Alternatives &&! element.url) {
		return;
	}
	
	let html_code = `<p><span>${element.Acronym}</span> : <span>${element.Meaning}</span></p>`;
	if (element.Hint) html_code += `<p style="padding-left:30px">${element.Hint}</p>`
	if (element.Alternatives) html_code += `<p style="padding-left:30px">${element.Alternatives}</p>`
	if (element.url) html_code += `<p style="padding-left:30px">${element.url}</p>`

	const div = document.createElement("div");
	div.innerHTML = html_code;
	parent = document.getElementById(parent_id);
	prepend ? parent.prepend(div) : parent.appendChild(div);
}

function appendHTMLTableChild(sourceTitle, sourceLength, sourceActive) {
	const tableBody = document.getElementById('source_table_body');
	const row = tableBody.insertRow();
	const checkboxCell = row.insertCell();
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.checked = sourceActive;
	checkbox.id = `${sourceTitle}checkbox`;
	checkbox.addEventListener('change', (event) => {
	  DB[sourceTitle].active = event.currentTarget.checked;
	  save('online_acronyms', JSON.stringify(DB));
	  update_home_placeholder_nb_entries();
	});
	checkboxCell.appendChild(checkbox);
	const titleCell = row.insertCell();
	titleCell.textContent = sourceTitle;
	const lengthCell = row.insertCell();
	lengthCell.textContent = sourceLength;
	lengthCell.id = `${sourceTitle}len`;
}

function update_table(source, len) {
	const lenEl = document.getElementById(`${source}len`);
	if (DB.hasOwnProperty(source) && lenEl) {
	  lenEl.textContent = len;
	} else {
	  appendHTMLTableChild(source, len, true);
	}
}

function update_params() {
	const mailAdd = local_config.mail_add?.trim();
	if (mailAdd) {
	  document.getElementById('suggestion_acronym').href = `mailto:${mailAdd}`;
	}
	const urlAdd = local_config.url_add?.trim();
	if (urlAdd) {
	  document.getElementById('url_add').href = urlAdd;
	}
	document.getElementById('online_url').value = local_config.acronyms_source;
	document.getElementById('first_time').style.display = get_database_length() === 0 ? 'block' : 'none';
}