async function fetchUrl(name, url) {
	console.log(url);
  
	try {
	  const response = await fetch(url);
	  const data = await response.json();
  
	  if (DB.hasOwnProperty(name)) {
		DB[name] = { value: data.entries, active: DB[name]["active"] };
	  } else {
		DB[name] = { value: data.entries, active: true };
	  }
  
	  save_db();
  
	  update_table(name, data.entries.length);
  
	  document.getElementById("online_db_loading_result").textContent = `${get_database_length()} entries fetched.`;
  
	  update_home_placeholder_nb_entries();
  
	  update_params();
	} catch (err) {
	  console.log(err);
	  if (err.name === "SyntaxError") {
		document.getElementById("online_db_loading_result").textContent =
		  "ERROR: Error in JSON format. Please put a valid JSON format.";
	  } else {
		document.getElementById("online_db_loading_result").textContent =
		  "ERROR: online source fetching failed (check URL or CORS policy).";
	  }
	}
  }
  
  async function fetch_callback() {
	const onlineUrl = document.getElementById("online_url").value;
	document.getElementById("online_db_loading_result").textContent = "...";
  
	try {
	  local_config["acronyms_source"] = onlineUrl;
	  save("local_config", JSON.stringify(local_config));
  
	  const response = await fetch(onlineUrl);
	  const data = await response.json();
  
	  if (data.hasOwnProperty("entries")) {
		data["sources"] = [
		  { name: onlineUrl.split("/").pop(), source: onlineUrl },
		];
	  }
  
	  for (const source of data.sources) {
		await fetchUrl(source.name, source.source);
	  }
  
	  if (data.url_add) {
		local_config.url_add = data.url_add;
	  }
  
	  if (data.mail_add) {
		local_config.mail_add = data.mail_add;
	  }
  
	  save("local_config", JSON.stringify(local_config));
	  update_params();
	} catch (err) {
	  console.log(err);
	  if (err.name === "SyntaxError") {
		document.getElementById("online_db_loading_result").textContent =
		  "ERROR: Error in JSON format. Please put a valid JSON format.";
	  } else {
		document.getElementById("online_db_loading_result").textContent =
		  "ERROR: online source fetching failed (check URL or CORS policy).";
	  }
	}
  }