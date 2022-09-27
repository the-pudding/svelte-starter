let hasStorage;

const isReady = () => {
	if (hasStorage !== undefined) return hasStorage;

	try {
		const storage = window["localStorage"];
		const x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		hasStorage = true;
	} catch (e) {
		hasStorage = false;
	} finally {
		return hasStorage;
	}
};

const remove = (key) => {
	if (!isReady()) return;
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.log(err);
	}
};

const set = (key, value) => {
	if (!isReady()) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		console.log(err);
	}
};

const get = (key) => {
	if (!isReady()) return;
	try {
		return JSON.parse(localStorage.getItem(key));
	} catch (err) {
		console.log(err);
		return undefined;
	}
};

export default {
	set,
	get,
	remove,
};
