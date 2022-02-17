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
	}
};

const remove = (key) => {
	if (!isReady()) return;
	localStorage.removeItem(key);
};

const set = (key, value) => {
	if (!isReady()) return;
	localStorage.setItem(key, JSON.stringify(value));
};

const get = (key) => {
	if (!isReady()) return;
	return JSON.parse(localStorage.getItem(key));
};

export default {
	set,
	get,
	remove,
};
