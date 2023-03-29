/**
 * Show acronym definition (if `result`)
 * @param {dict} result 
 */
function show_definition(result) {
	console.log(result);

	if (result[0]) result = result[0].result;
	if (result && result != '') { // if a word is selected
		console.log(result);
		
		result = result.trim(); // remove leading and trailing spaces

		document.getElementById("search_word_in_db").value = result;

		search_in_db();
	}
}