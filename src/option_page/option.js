chrome.storage.local.get(['online_acronyms', 'custom_acronyms'], function (res) {
	if (res.online_acronyms) {
		DB = JSON.parse(res.online_acronyms);
		Object.values(DB).forEach((source) => {
			if (source.active) {
				source.value.forEach((element) => {
					appendHTML('word_definition', element);
				});
			}
		});
	}
	if (res.custom_acronyms) {
		JSON.parse(res.custom_acronyms).forEach((element) => {
			appendHTML('word_definition', element);
		});
	}
});