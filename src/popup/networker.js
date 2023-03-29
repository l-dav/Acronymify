

function fetch_an_url(name, url) {
	console.log(url);
	try {
		fetch(url)
			.then(response => 
				response.json()
			)
			.then(response => {

				if (DB.hasOwnProperty(name)) {
					DB[name] = {"value": response['entries'], "active": DB[name]["active"]};
				} else {
					DB[name] = {"value": response['entries'], "active": true};
				}

				save_db();

				update_table(name, response['entries'].length);

				document.getElementById("online_db_loading_result").textContent = get_database_length().toString() + " entries fetched.";

				update_home_placeholder_nb_entries();

				update_params();
			})
			.catch(err => {
				console.log(err);
				document.getElementById("online_db_loading_result").textContent = "ERROR: online source fetching failed (check URL or CORS policy).";
			});
	} catch (err) {
		console.log(err);
		document.getElementById("online_db_loading_result").textContent = "ERROR: Error in JSON format. Please put a valid JSON format.";
	}
}


/**
 * Fetch online source
 */
function fetch_callback() {
	// Show that we are loading ...
	document.getElementById("online_db_loading_result").textContent = "...";

	try {
		local_config["acronyms_source"] = document.getElementById("online_url").value;

		save("local_config", JSON.stringify(local_config));

		fetch(local_config["acronyms_source"])
			.then(response => 
				response.json()
			)
			.then(response => {

				console.log(response);

				if (response.hasOwnProperty('entries')) {
					// old format => convert to new one and invent a title

					response["sources"] = [{"name": local_config["acronyms_source"].split('/').pop(), "source": local_config["acronyms_source"]}];
					console.log(response);
				}

				response["sources"].forEach(url => {
					console.log(url);
					console.log(url["name"]);
					console.log(url["source"]);
					fetch_an_url(url["name"], url["source"]);
				});

				
				if (response["url_add"]) {
					local_config["url_add"] = response["url_add"];
				}
				if (response["mail_add"]) {
					local_config["mail_add"] = response["mail_add"];
				}

				console.log(local_config);

				save("local_config", JSON.stringify(local_config));
				update_params();
			})
			.catch(err => {
				console.log(err);
				document.getElementById("online_db_loading_result").textContent = "ERROR: online source fetching failed (check URL or CORS policy).";
			});
	} catch (err) {
		console.log(err);
		document.getElementById("online_db_loading_result").textContent = "ERROR: Error in JSON format. Please put a valid JSON format.";
	}
}