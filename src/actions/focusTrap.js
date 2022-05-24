// params = { disable: false }

export default function focusTrap(node, params) {
	const elements = ["a", "button", "input", "textarea", "select", "details", "[tabindex]:not([tabindex='-1'])"];
	let firstFocusable;
	let lastFocusable;
	let active;

	const moveFocusToTop = (e) => {
		if (e.key === "Tab" && !e.shiftKey) {
			e.preventDefault();
			firstFocusable.focus();
		}
	};

	const moveFocusToBottom = (e) => {
		if (e.key === "Tab" && e.shiftKey) {
			e.preventDefault();
			lastFocusable.focus();
		}
	};

	const add = () => {
		if (firstFocusable) firstFocusable.addEventListener("keydown", moveFocusToBottom);
		if (lastFocusable) lastFocusable.addEventListener("keydown", moveFocusToTop);
		active = true;
	};

	const remove = () => {
		if (firstFocusable) firstFocusable.removeEventListener("keydown", moveFocusToBottom);
		if (lastFocusable) lastFocusable.removeEventListener("keydown", moveFocusToTop);
		active = false;
	};

	const setup = (p) => {
		if (active && p && p.disable) remove();
		else if (!active && !p || (p && !p.disable)) add();
	};

	const query = elements.join(", ");
	const focusableElements = [...node.querySelectorAll(query)];

	firstFocusable = focusableElements.shift();
	lastFocusable = focusableElements.pop();

	setup(params);

	return {
		update(params) {
			setup(params);
		},

		destroy() {
			remove();
		}
	};
}