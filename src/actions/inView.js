/**
 * This action executes a callback on node entering/exiting the viewport.
 * params: { cb }
 * example:
 * <p use:inView={(v) => console.log(v)}>
 */

export default function inView(node, cb) {
	const options = { root: null };
	const callback = cb ? cb : () => {}; 
	const onChangeVisibility = (e) => callback(e[0].isIntersecting);
	const observer = new IntersectionObserver(onChangeVisibility, options);;
	
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}