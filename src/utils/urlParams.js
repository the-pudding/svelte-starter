function get(key) {
	const name = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
	const results = regex.exec(window.location.search);
	return results === null
		? ""
		: decodeURIComponent(results[1].replace(/\+/g, " "));
}

function set(key, value) {
	const baseUrl = [
		window.location.protocol,
		"//",
		window.location.host,
		window.location.pathname
	].join("");
	const urlQueryString = document.location.search;
	const newParam = `${key}=${value}`;
	let params = `?${newParam}`;

	// If the "search" string exists, then build params from it
	if (urlQueryString) {
		const updateRegex = new RegExp(`([\?&])${key}[^&]*`);
		const removeRegex = new RegExp(`([\?&])${key}=[^&;]+[&;]?`);

		// Remove param if value is empty
		if (typeof value === "undefined" || value === null || value === "") {
			params = urlQueryString.replace(removeRegex, "$1");
			params = params.replace(/[&;]$/, "");
		} else if (urlQueryString.match(updateRegex) !== null) {
			// If param exists already, update it
			params = urlQueryString.replace(updateRegex, `$1${newParam}`);
		} else {
			// Otherwise, add it to end of query string
			params = `${urlQueryString}&${newParam}`;
		}
	}

	// no parameter was set so we don't need the question mark
	params = params === "?" ? "" : params;

	window.history.replaceState({}, "", `${baseUrl}${params}`);
}

export default { get, set };
