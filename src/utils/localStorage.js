let hasStorage;

const checkStorage = (type) => {
	try {
		const storage = window[type];
		const x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch (e) {
		return false;
	}
};

const remove = (key) => {
	if (!hasStorage) return;
	localStorage.removeItem(key);
};

const set = (key, value) => {
	if (!hasStorage) return;
	localStorage.set(key, JSON.stringify(value));
};

const get = (key) => {
	if (!hasStorage) return;
	return JSON.parse(localStorage.get(key));
};

const clear = (items = []) => {
	items.forEach(remove);
};

const setup = (reset) => {
	hasStorage = checkStorage("localStorage");
	if (reset) clear(reset);
};

export default {
	setup,
	set,
	get,
	remove,
	clear
};
