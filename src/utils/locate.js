/* USAGE:
locate(test = false).then(data => {

}).catch(err => {

});
*/

const TEST_DATA = {
	testing: "This is localhost testing data",
	city: "Lee",
	country: "US",
	hostname: "cpe-74-76-154-164.nycap.res.rr.com",
	ip: "74.76.154.164",
	loc: "42.3043,-73.2482",
	org: "AS11351 Charter Communications Inc",
	postal: "01238",
	region: "Massachusetts",
	timezone: "America/New_York",
}

const MAX_TIME = 4000;

function lookup(test = false) {
	if (test) return Promise.resolve(TEST_DATA);
	const url = `https://ipinfo.io?token=6f0f9c88db028a`;
	return new Promise((resolve, reject) => {
		fetch(url).then((response) => {
			if (response.ok) response.json().then(resolve).catch(reject);
			else reject(new Error(response.status));
		});
	});
}

function init() {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => reject(new Error('timeout')), MAX_TIME);
		lookup()
			.then((data) => {
				clearTimeout(timeout);
				resolve(data);
			})
			.catch(reject);
	});
}

export default init;
