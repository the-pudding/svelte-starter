//adapted from https://userunes.com/usefetcher
import { csvParse } from "d3";

export const useFetcher = (initialUrl, options) => {
	let url = $state(initialUrl);
	let data = $state(null);
	let loading = $state(true);
	let error = $state();

	const setLoading = (isLoading = true) => {
		loading = isLoading;
		if (isLoading === true) {
			error = null;
			data = null;
		}
	};

	const fetchData = async () => {
		try {
			const res = await fetch(url, options);
			if (!res.ok)
				throw new Error(`Unexpected error occurred (status ${res.status})`);

			let data;
			if (url.includes(".csv")) {
				const csv = await res.text();
				data = csvParse(csv);
			} else data = await res.json();
			return [null, data];
		} catch (e) {
			const { errorMessage = "Unexpected error eccurred" } = e;
			return [errorMessage, null];
		}
	};

	const handleUrlChange = async (currentUrl) => {
		setLoading(true);

		const [err, response] = await fetchData();
		if (currentUrl !== url) return;

		if (err) {
			setLoading(false);
			error = err;
			return;
		}

		setLoading(false);
		data = response;
	};

	$effect(() => {
		handleUrlChange(url);
	});

	return {
		get data() {
			return data;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get url() {
			return url;
		},
		set url(newUrl) {
			if (url !== newUrl) url = newUrl;
		}
	};
};

export default useFetcher;
