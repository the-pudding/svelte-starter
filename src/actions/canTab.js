// params = { disable: false }

export default function focusTrap(node, params) {
	const elements = ["a", "button", "input", "textarea", "select", "details", "[tabindex]:not([tabindex='-1'])"];

	const setup = (p) => {
		focusableElements.forEach(el => {
			if (p && p.disable) el.setAttribute("tabindex", -1);
			else el.removeAttribute("tabindex");
		});
	};

	const query = elements.join(", ");
	const focusableElements = [...node.querySelectorAll(query)];

	setup(params);

	return {
		update(params) {
			setup(params);
		},

		destroy() {
			focusableElements.forEach(el => el.removeAttribute("tabindex"));
		}
	};
}