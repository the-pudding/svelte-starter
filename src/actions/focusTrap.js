// params = { disable: false, onEscape: () => {} }
// keeps keyboard focus inside node while enabled, and hands focus back to
// whatever was focused before when it is disabled. pair it with inert on the
// background content so the rest of the page is out of reach too.

const SELECTOR = [
	"a[href]",
	"button",
	"input",
	"textarea",
	"select",
	"details",
	"[tabindex]"
].join(", ");

export default function focusTrap(node, params) {
	let current = params;
	let active = false;
	let previous;
	let restoring = false;

	// query every time: which elements are focusable changes as the ui does
	// (disabled nav buttons, conditionally rendered content, etc.)
	const focusable = () =>
		[...node.querySelectorAll(SELECTOR)].filter(
			(el) =>
				!el.disabled &&
				el.getAttribute("tabindex") !== "-1" &&
				el.getAttribute("aria-hidden") !== "true" &&
				!el.closest("[inert]") &&
				el.getClientRects().length > 0
		);

	const onKeydown = (e) => {
		if (e.key === "Escape" && current?.onEscape) {
			e.preventDefault();
			current.onEscape();
			return;
		}

		if (e.key !== "Tab") return;

		const els = focusable();
		if (!els.length) return;

		const first = els[0];
		const last = els[els.length - 1];

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	// backstop: if focus lands outside some other way, pull it back in
	const onFocusin = (e) => {
		if (!active || restoring || node.contains(e.target)) return;
		const els = focusable();
		(els[0] || node).focus();
	};

	const add = () => {
		if (active) return;
		active = true;
		previous = document.activeElement;
		node.addEventListener("keydown", onKeydown);
		document.addEventListener("focusin", onFocusin);

		// wait a frame: node is usually still display:none this tick
		requestAnimationFrame(() => {
			if (!active) return;
			const els = focusable();
			(els[0] || node).focus();
		});
	};

	const remove = () => {
		if (!active) return;
		active = false;
		node.removeEventListener("keydown", onKeydown);
		document.removeEventListener("focusin", onFocusin);

		const target = previous;
		previous = undefined;
		if (!target) return;

		// wait a frame so the background has shed its inert attribute
		restoring = true;
		requestAnimationFrame(() => {
			if (target.isConnected) target.focus();
			restoring = false;
		});
	};

	const setup = (p) => {
		if (p?.disable) remove();
		else add();
	};

	// so the node itself can hold focus if it has no focusable children
	const hadTabindex = node.hasAttribute("tabindex");
	if (!hadTabindex) node.setAttribute("tabindex", "-1");

	setup(current);

	return {
		update(params) {
			current = params;
			setup(current);
		},

		destroy() {
			remove();
			if (!hadTabindex) node.removeAttribute("tabindex");
		}
	};
}
