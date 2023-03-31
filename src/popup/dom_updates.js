

/**
 * Append a definition element
 * @param {string} parent_id ID of the node to append definitions
 * @param {dict} element dict containing acronym attributes
 * @param {bool} prepend boolean to insert element either at the beginning or at the end of 'element'
 */
function appendHTML(parent_id, element, prepend = false) {
	if (!element.Meaning && !element.Hint && !element.Alternatives && !element.url) {
		return;
	}

	// Remove HTML tags
	if (element.Acronym) element.Acronym = element.Acronym.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '');
	if (element.Meaning) element.Meaning = element.Meaning.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '');
	if (element.Hint) element.Hint = element.Hint.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '');
	if (element.Alternatives) element.Alternatives = element.Alternatives.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '');
	if (element.url) element.url = element.url.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '');

	const parent = document.getElementById(parent_id);
	const div = document.createElement("div");
	const spanAcronym = document.createElement("span");
	const spanMeaning = document.createElement("span");
	const pHint = document.createElement("p");
	const pAlternatives = document.createElement("p");
	const pUrl = document.createElement("p");

	spanAcronym.innerText = element.Acronym;
	spanMeaning.innerText = element.Meaning;
	pHint.innerText = element.Hint;
	pAlternatives.innerText = element.Alternatives;
	pUrl.innerText = element.url;

	spanAcronym.style.fontWeight = "bold";
	div.style.paddingTop = "10px";

	div.appendChild(spanAcronym);
	div.appendChild(document.createTextNode(" : "));
	div.appendChild(spanMeaning);

	if (element.Hint) {
		pHint.style.paddingLeft = "30px";
		div.appendChild(pHint);
	}

	if (element.Alternatives) {
		pAlternatives.style.paddingLeft = "30px";
		div.appendChild(pAlternatives);
	}

	if (element.url) {
		pUrl.style.paddingLeft = "30px";
		div.appendChild(pUrl);
	}

	if (prepend) {
		parent.insertBefore(div, parent.firstChild);
	} else {
		parent.appendChild(div);
	}
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