import { readable } from 'svelte/store';

export default previous = (store) => {
	let previous = null;

	return readable(null, set => {
		return store.subscribe(current => {
			set(previous);
			previous = current;
		});
	});
};