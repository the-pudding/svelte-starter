'use strict';

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe,
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

/* --------------------------------------------
 *
 * Return a truthy value if is zero
 *
 * --------------------------------------------
 */
function canBeZero (val) {
	if (val === 0) {
		return true;
	}
	return val;
}

function makeAccessor (acc) {
	if (!canBeZero(acc)) return null;
	if (Array.isArray(acc)) {
		return d => acc.map(k => {
			return typeof k !== 'function' ? d[k] : k(d);
		});
	} else if (typeof acc !== 'function') { // eslint-disable-line no-else-return
		return d => d[acc];
	}
	return acc;
}

/* --------------------------------------------
 *
 * Calculate the extents of desired fields
 * Returns an object like:
 * `{x: [0, 10], y: [-10, 10]}` if `fields` is
 * `[{field:'x', accessor: d => d.x}, {field:'y', accessor: d => d.y}]`
 *
 * --------------------------------------------
 */
function calcExtents (data, fields) {
	if (!Array.isArray(data) || data.length === 0) return null;
	const extents = {};
	const fl = fields.length;
	let i;
	let j;
	let f;
	let val;
	let s;

	if (fl) {
		for (i = 0; i < fl; i += 1) {
			const firstRow = fields[i].accessor(data[0]);
			extents[fields[i].field] = Array.isArray(firstRow) ? firstRow : [firstRow, firstRow];
		}
		const dl = data.length;
		for (i = 0; i < dl; i += 1) {
			for (j = 0; j < fl; j += 1) {
				f = fields[j];
				val = f.accessor(data[i]);
				s = f.field;
				if (Array.isArray(val)) {
					const vl = val.length;
					for (let k = 0; k < vl; k += 1) {
						if (val[k] !== undefined) {
							if (val[k] < extents[s][0]) {
								extents[s][0] = val[k];
							}
							if (val[k] > extents[s][1]) {
								extents[s][1] = val[k];
							}
						}
					}
				} else if (val !== undefined) {
					if (val < extents[s][0]) {
						extents[s][0] = val;
					}
					if (val > extents[s][1]) {
						extents[s][1] = val;
					}
				}
			}
		}
	} else {
		return null;
	}
	return extents;
}

/* --------------------------------------------
 * If we have a domain from settings, fill in
 * any null values with ones from our measured extents
 * otherwise, return the measured extent
 */
function partialDomain (doughmain, directive) {
	if (Array.isArray(directive) === true) {
		return directive.map((d, i) => {
			if (d === null) {
				return doughmain[i];
			}
			return d;
		});
	}
	return doughmain;
}

function calcDomain (s) {
	return function domainCalc ([$extents, $domain]) {
		return $extents ? partialDomain($extents[s], $domain) : $domain;
	};
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function ticks(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;

  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

function initRange(domain, range) {
  switch (arguments.length) {
    case 0: break;
    case 1: this.range(domain); break;
    default: this.range(range).domain(domain); break;
  }
  return this;
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  copy: function(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? new Rgb(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? new Rgb((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(")
      + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.b) || 0))
      + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(")
        + (this.h || 0) + ", "
        + (this.s || 0) * 100 + "%, "
        + (this.l || 0) * 100 + "%"
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

function constant(x) {
  return function() {
    return x;
  };
}

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}

var rgb$1 = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;

  return rgb$1;
})(1);

function numberArray(a, b) {
  if (!b) b = [];
  var n = a ? Math.min(b.length, a.length) : 0,
      c = b.slice(),
      i;
  return function(t) {
    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}

function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

function genericArray(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
}

function date(a, b) {
  var d = new Date;
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

function object(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = interpolate(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function string(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

function interpolate(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant(b)
      : (t === "number" ? interpolateNumber
      : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
      : b instanceof color ? rgb$1
      : b instanceof Date ? date
      : isNumberArray(b) ? numberArray
      : Array.isArray(b) ? genericArray
      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
      : interpolateNumber)(a, b);
}

function interpolateRound(a, b) {
  return a = +a, b = +b, function(t) {
    return Math.round(a * (1 - t) + b * t);
  };
}

function constant$1(x) {
  return function() {
    return x;
  };
}

function number(x) {
  return +x;
}

var unit = [0, 1];

function identity(x) {
  return x;
}

function normalize(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : constant$1(isNaN(b) ? NaN : 0.5);
}

function clamper(a, b) {
  var t;
  if (a > b) t = a, a = b, b = t;
  return function(x) { return Math.max(a, Math.min(b, x)); };
}

// normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
function bimap(domain, range, interpolate) {
  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
  if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
  else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
  return function(x) { return r0(d0(x)); };
}

function polymap(domain, range, interpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate(range[i], range[i + 1]);
  }

  return function(x) {
    var i = bisectRight(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target
      .domain(source.domain())
      .range(source.range())
      .interpolate(source.interpolate())
      .clamp(source.clamp())
      .unknown(source.unknown());
}

function transformer() {
  var domain = unit,
      range = unit,
      interpolate$1 = interpolate,
      transform,
      untransform,
      unknown,
      clamp = identity,
      piecewise,
      output,
      input;

  function rescale() {
    var n = Math.min(domain.length, range.length);
    if (clamp !== identity) clamp = clamper(domain[0], domain[n - 1]);
    piecewise = n > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
  }

  scale.invert = function(y) {
    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
  };

  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
  };

  scale.rangeRound = function(_) {
    return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? true : identity, rescale()) : clamp !== identity;
  };

  scale.interpolate = function(_) {
    return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function(t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}

function continuous() {
  return transformer()(identity, identity);
}

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function formatDecimal(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

function exponent(x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
}

function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}

function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
  this.align = specifier.align === undefined ? ">" : specifier.align + "";
  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === undefined ? undefined : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === undefined ? "" : specifier.type + "";
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width === undefined ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
      + (this.trim ? "~" : "")
      + this.type;
};

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function formatTrim(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

var prefixExponent;

function formatPrefixAuto(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}

function formatRounded(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

var formatTypes = {
  "%": function(x, p) { return (x * 100).toFixed(p); },
  "b": function(x) { return Math.round(x).toString(2); },
  "c": function(x) { return x + ""; },
  "d": function(x) { return Math.round(x).toString(10); },
  "e": function(x, p) { return x.toExponential(p); },
  "f": function(x, p) { return x.toFixed(p); },
  "g": function(x, p) { return x.toPrecision(p); },
  "o": function(x) { return Math.round(x).toString(8); },
  "p": function(x, p) { return formatRounded(x * 100, p); },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
  "x": function(x) { return Math.round(x).toString(16); }
};

function identity$1(x) {
  return x;
}

var map = Array.prototype.map,
    prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

function formatLocale(locale) {
  var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
      currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
      currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
      decimal = locale.decimal === undefined ? "." : locale.decimal + "",
      numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
      percent = locale.percent === undefined ? "%" : locale.percent + "",
      minus = locale.minus === undefined ? "-" : locale.minus + "",
      nan = locale.nan === undefined ? "NaN" : locale.nan + "";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type;

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision === undefined ? 6
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Perform the initial formatting.
        var valueNegative = value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

        // Trim insignificant zeros.
        if (trim) value = formatTrim(value);

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;

        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}

var locale;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

function precisionFixed(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}

function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
}

function precisionRound(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
}

function tickFormat(start, stop, count, specifier) {
  var step = tickStep(start, stop, count),
      precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };

  scale.nice = function(count) {
    if (count == null) count = 10;

    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = tickIncrement(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = tickIncrement(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = tickIncrement(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear$1() {
  var scale = continuous();

  scale.copy = function() {
    return copy(scale, linear$1());
  };

  initRange.apply(scale, arguments);

  return linearish(scale);
}

function transformPow(exponent) {
  return function(x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}

function transformSqrt(x) {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
}

function transformSquare(x) {
  return x < 0 ? -x * x : x * x;
}

function powish(transform) {
  var scale = transform(identity, identity),
      exponent = 1;

  function rescale() {
    return exponent === 1 ? transform(identity, identity)
        : exponent === 0.5 ? transform(transformSqrt, transformSquare)
        : transform(transformPow(exponent), transformPow(1 / exponent));
  }

  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, rescale()) : exponent;
  };

  return linearish(scale);
}

function pow() {
  var scale = powish(transformer());

  scale.copy = function() {
    return copy(scale, pow()).exponent(scale.exponent());
  };

  initRange.apply(scale, arguments);

  return scale;
}

function sqrt() {
  return pow.apply(null, arguments).exponent(0.5);
}

var defaultScales = {
	x: linear$1,
	y: linear$1,
	z: linear$1,
	r: sqrt
};

/* --------------------------------------------
 *
 * Returns a modified scale domain by in/decreasing
 * the min/max by taking the desired difference
 * in pixels and converting it to units of data.
 * Returns an array that you can set as the new domain.
 *
 * --------------------------------------------
 */
function padScale (scale, padding) {
	if (typeof scale.range !== 'function') {
		throw new Error('Scale method `range` must be a function');
	}
	if (typeof scale.domain !== 'function') {
		throw new Error('Scale method `domain` must be a function');
	}
	if (!Array.isArray(padding)) {
		return scale.domain();
	}

	const domain = scale.domain();

	const range = scale.range();
	const domainExtent = domain[1] - domain[0];

	const w = Math.abs(range[1] - range[0]);

	const paddedDomain = domain.slice();
	const pl = padding.length;
	for (let i = 0; i < pl; i += 1) {
		const sign = i === 0 ? -1 : 1;
		const isTime = Object.prototype.toString.call(domain[i]) === '[object Date]';

		const perc = padding[i] / w;
		const paddingAdjuster = domainExtent * perc;
		const d = (isTime ? domain[i].getTime() : domain[i]);
		const adjustedDomain = d + paddingAdjuster * sign;
		paddedDomain[i] = isTime ? new Date(adjustedDomain) : adjustedDomain;
	}
	return paddedDomain;
}

/* eslint-disable no-nested-ternary */
function calcBaseRange(s, width, height, reverse) {
	const config = {
		x: reverse === true ? [width, 0] : [0, width],
		y: reverse === true ? [height, 0] : [0, height],
		z: reverse === true ? [width, 0] : [0, width],
		r: reverse === true ? [25, 1] : [1, 25],
	};
	return config[s];
}

function getDefaultRange(s, width, height, reverse, range) {
	return !range
		? calcBaseRange(s, width, height, reverse)
		: typeof range === 'function'
			? range({ width, height })
			: range;
}

function createScale (s) {
	return function scaleCreator ([$scale, $extents, $domain, $padding, $nice, $reverse, $width, $height, $range, baseRange]) {
		if ($extents === null) {
			return null;
		}

		const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range);

		const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();

		/* --------------------------------------------
		 * On creation, `$domain` will already have any nulls filled in
		 * But if we set it via the context it might not, so rerun it through partialDomain
		 */
		scale
			.domain(partialDomain($extents[s], $domain))
			.range(defaultRange);

		if ($padding) {
			scale.domain(padScale(scale, $padding));
		}

		if ($nice === true) {
			if (typeof scale.nice === 'function') {
				scale.nice();
			} else {
				console.error(`Layer Cake warning: You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`);
			}
		}

		return scale;
	};
}

function createGetter ([$acc, $scale]) {
	return d => {
		const val = $acc(d);
		if (Array.isArray(val)) {
			return val.map(v => $scale(v));
		}
		return $scale(val);
	};
}

var defaultReverses = {
	x: false,
	y: true,
	z: false,
	r: false
};

/* node_modules/layercake/src/LayerCake.svelte generated by Svelte v3.19.1 */

const css = {
	code: ".layercake-container,.layercake-container *{box-sizing:border-box}.layercake-container.svelte-1sz872l{width:100%;height:100%}",
	map: "{\"version\":3,\"file\":\"LayerCake.svelte\",\"sources\":[\"LayerCake.svelte\"],\"sourcesContent\":[\"<script>\\n\\timport { setContext } from 'svelte';\\n\\timport { writable, derived } from 'svelte/store';\\n\\n\\timport makeAccessor from './utils/makeAccessor.js';\\n\\timport calcExtents from './lib/calcExtents.js';\\n\\timport calcDomain from './helpers/calcDomain.js';\\n\\timport createScale from './helpers/createScale.js';\\n\\timport createGetter from './helpers/createGetter.js';\\n\\timport defaultScales from './settings/defaultScales.js';\\n\\timport defaultReverses from './settings/defaultReverses.js';\\n\\n\\texport let width = undefined;\\n\\texport let height = undefined;\\n\\n\\texport let containerWidth = width || 350;\\n\\texport let containerHeight = height || 250;\\n\\n\\t/* --------------------------------------------\\n\\t * Parameters\\n\\t * Values that computed properties are based on and that\\n\\t * can be easily extended from config values\\n\\t *\\n\\t */\\n\\texport let x = undefined;\\n\\texport let y = undefined;\\n\\texport let z = undefined;\\n\\texport let r = undefined;\\n\\texport let custom = {};\\n\\texport let data = [];\\n\\texport let xDomain = undefined;\\n\\texport let yDomain = undefined;\\n\\texport let zDomain = undefined;\\n\\texport let rDomain = undefined;\\n\\texport let xNice = false;\\n\\texport let yNice = false;\\n\\texport let zNice = false;\\n\\texport let rNice = false;\\n\\texport let xReverse = defaultReverses.x;\\n\\texport let yReverse = defaultReverses.y;\\n\\texport let zReverse = defaultReverses.z;\\n\\texport let rReverse = defaultReverses.r;\\n\\texport let xPadding = undefined;\\n\\texport let yPadding = undefined;\\n\\texport let zPadding = undefined;\\n\\texport let rPadding = undefined;\\n\\texport let xScale = defaultScales.x;\\n\\texport let yScale = defaultScales.y;\\n\\texport let zScale = defaultScales.y;\\n\\texport let rScale = defaultScales.r;\\n\\texport let xRange = undefined;\\n\\texport let yRange = undefined;\\n\\texport let zRange = undefined;\\n\\texport let rRange = undefined;\\n\\texport let padding = {};\\n\\texport let flatData = undefined;\\n\\n\\t/* --------------------------------------------\\n\\t * Preserve a copy of our passed in settings before we modify them\\n\\t * Return this to the user's context so they can reference things if need be\\n\\t * Add the active keys since those aren't on our settings object.\\n\\t * This is mostly an escape-hatch\\n\\t */\\n\\tconst originalSettings = {};\\n\\t$: if (x) originalSettings.x = x;\\n\\t$: if (y) originalSettings.y = y;\\n\\t$: if (z) originalSettings.z = z;\\n\\t$: if (r) originalSettings.r = r;\\n\\t$: if (xDomain) originalSettings.xDomain = xDomain;\\n\\t$: if (yDomain) originalSettings.yDomain = yDomain;\\n\\t$: if (zDomain) originalSettings.zDomain = zDomain;\\n\\t$: if (rDomain) originalSettings.rDomain = rDomain;\\n\\t$: if (xRange) originalSettings.xRange = xRange;\\n\\t$: if (yRange) originalSettings.yRange = yRange;\\n\\t$: if (zRange) originalSettings.zRange = zRange;\\n\\t$: if (rRange) originalSettings.rRange = rRange;\\n\\n\\t/* --------------------------------------------\\n\\t * Make store versions of each parameter\\n\\t * Prefix these with `_` to keep things organized\\n\\t */\\n\\tconst _containerWidth = writable();\\n\\tconst _containerHeight = writable();\\n\\tconst _x = writable();\\n\\tconst _y = writable();\\n\\tconst _z = writable();\\n\\tconst _r = writable();\\n\\tconst _custom = writable();\\n\\tconst _data = writable();\\n\\tconst _xDomain = writable();\\n\\tconst _yDomain = writable();\\n\\tconst _zDomain = writable();\\n\\tconst _rDomain = writable();\\n\\tconst _xNice = writable();\\n\\tconst _yNice = writable();\\n\\tconst _zNice = writable();\\n\\tconst _rNice = writable();\\n\\tconst _xReverse = writable();\\n\\tconst _yReverse = writable();\\n\\tconst _zReverse = writable();\\n\\tconst _rReverse = writable();\\n\\tconst _xPadding = writable();\\n\\tconst _yPadding = writable();\\n\\tconst _zPadding = writable();\\n\\tconst _rPadding = writable();\\n\\tconst _xScale = writable();\\n\\tconst _yScale = writable();\\n\\tconst _zScale = writable();\\n\\tconst _rScale = writable();\\n\\tconst _xRange = writable();\\n\\tconst _yRange = writable();\\n\\tconst _zRange = writable();\\n\\tconst _rRange = writable();\\n\\tconst _padding = writable();\\n\\tconst _flatData = writable();\\n\\n\\t$: _containerWidth.set(containerWidth);\\n\\t$: _containerHeight.set(containerHeight);\\n\\t$: _x.set(makeAccessor(x));\\n\\t$: _y.set(makeAccessor(y));\\n\\t$: _z.set(makeAccessor(z));\\n\\t$: _r.set(makeAccessor(r));\\n\\t$: _xDomain.set(xDomain);\\n\\t$: _yDomain.set(yDomain);\\n\\t$: _zDomain.set(zDomain);\\n\\t$: _rDomain.set(rDomain);\\n\\t$: _custom.set(custom);\\n\\t$: _data.set(data);\\n\\t$: _xNice.set(xNice);\\n\\t$: _yNice.set(yNice);\\n\\t$: _zNice.set(zNice);\\n\\t$: _rNice.set(rNice);\\n\\t$: _xReverse.set(xReverse);\\n\\t$: _yReverse.set(yReverse);\\n\\t$: _zReverse.set(zReverse);\\n\\t$: _rReverse.set(rReverse);\\n\\t$: _xPadding.set(xPadding);\\n\\t$: _yPadding.set(yPadding);\\n\\t$: _zPadding.set(zPadding);\\n\\t$: _rPadding.set(rPadding);\\n\\t$: _xScale.set(xScale);\\n\\t$: _yScale.set(yScale);\\n\\t$: _zScale.set(zScale);\\n\\t$: _rScale.set(rScale);\\n\\t$: _xRange.set(xRange);\\n\\t$: _yRange.set(yRange);\\n\\t$: _zRange.set(zRange);\\n\\t$: _rRange.set(rRange);\\n\\t$: _padding.set(padding);\\n\\t$: _flatData.set(flatData || data);\\n\\n\\t/* --------------------------------------------\\n\\t * Create derived values\\n\\t * Suffix these with `_d`\\n\\t */\\n\\tconst activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {\\n\\t\\treturn [\\n\\t\\t\\t{ field: 'x', accessor: $x },\\n\\t\\t\\t{ field: 'y', accessor: $y },\\n\\t\\t\\t{ field: 'z', accessor: $z },\\n\\t\\t\\t{ field: 'r', accessor: $r }\\n\\t\\t].filter(d => d.accessor);\\n\\t});\\n\\n\\tconst padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {\\n\\t\\tconst defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };\\n\\t\\treturn Object.assign(defaultPadding, $padding);\\n\\t});\\n\\n\\tconst box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {\\n\\t\\tconst b = {};\\n\\t\\tb.top = $padding.top;\\n\\t\\tb.right = $containerWidth - $padding.right;\\n\\t\\tb.bottom = $containerHeight - $padding.bottom;\\n\\t\\tb.left = $padding.left;\\n\\t\\tb.width = b.right - b.left;\\n\\t\\tb.height = b.bottom - b.top;\\n\\t\\tif (b.width < 0 && b.height < 0) {\\n\\t\\t\\tconsole.error('[LayerCake] Target div has negative width and height. Did you forget to set a width or height on the container?');\\n\\t\\t} else if (b.width < 0) {\\n\\t\\t\\tconsole.error('[LayerCake] Target div has a negative width. Did you forget to set that CSS on the container?');\\n\\t\\t} else if (b.height < 0) {\\n\\t\\t\\tconsole.error('[LayerCake] Target div has negative height. Did you forget to set that CSS on the container?');\\n\\t\\t}\\n\\t\\treturn b;\\n\\t});\\n\\n\\tconst width_d = derived([box_d], ([$box]) => {\\n\\t\\treturn $box.width;\\n\\t});\\n\\n\\tconst height_d = derived([box_d], ([$box]) => {\\n\\t\\treturn $box.height;\\n\\t});\\n\\n\\t/* --------------------------------------------\\n\\t * Calculate extents by taking the extent of the data\\n\\t * and filling that in with anything set by the user\\n\\t */\\n\\tconst extents_d = derived([_flatData, activeGetters_d], ([$flatData, $activeGetters]) => {\\n\\t\\treturn calcExtents($flatData, $activeGetters);\\n\\t});\\n\\n\\tconst xDomain_d = derived([extents_d, _xDomain], calcDomain('x'));\\n\\tconst yDomain_d = derived([extents_d, _yDomain], calcDomain('y'));\\n\\tconst zDomain_d = derived([extents_d, _zDomain], calcDomain('z'));\\n\\tconst rDomain_d = derived([extents_d, _rDomain], calcDomain('r'));\\n\\n\\tconst xScale_d = derived([_xScale, extents_d, xDomain_d, _xPadding, _xNice, _xReverse, width_d, height_d, _xRange], createScale('x'));\\n\\tconst xGet_d = derived([_x, xScale_d], createGetter);\\n\\n\\tconst yScale_d = derived([_yScale, extents_d, yDomain_d, _yPadding, _yNice, _yReverse, width_d, height_d, _yRange], createScale('y'));\\n\\tconst yGet_d = derived([_y, yScale_d], createGetter);\\n\\n\\tconst zScale_d = derived([_zScale, extents_d, zDomain_d, _zPadding, _zNice, _zReverse, width_d, height_d, _zRange], createScale('z'));\\n\\tconst zGet_d = derived([_z, zScale_d], createGetter);\\n\\n\\tconst rScale_d = derived([_rScale, extents_d, rDomain_d, _rPadding, _rNice, _rReverse, width_d, height_d, _rRange], createScale('r'));\\n\\tconst rGet_d = derived([_r, rScale_d], createGetter);\\n\\n\\t$: context = {\\n\\t\\tactiveGetters: activeGetters_d,\\n\\t\\twidth: width_d,\\n\\t\\theight: height_d,\\n\\t\\tcontainerWidth: _containerWidth,\\n\\t\\tcontainerHeight: _containerHeight,\\n\\t\\tx: _x,\\n\\t\\ty: _y,\\n\\t\\tz: _z,\\n\\t\\tr: _r,\\n\\t\\tcustom: _custom,\\n\\t\\tdata: _data,\\n\\t\\txNice: _xNice,\\n\\t\\tyNice: _yNice,\\n\\t\\tzNice: _zNice,\\n\\t\\trNice: _rNice,\\n\\t\\txReverse: _xReverse,\\n\\t\\tyReverse: _yReverse,\\n\\t\\tzReverse: _zReverse,\\n\\t\\trReverse: _rReverse,\\n\\t\\txPadding: _xPadding,\\n\\t\\tyPadding: _yPadding,\\n\\t\\tzPadding: _zPadding,\\n\\t\\trPadding: _rPadding,\\n\\t\\tpadding: padding_d,\\n\\t\\tflatData: _flatData,\\n\\t\\textents: extents_d,\\n\\t\\txDomain: xDomain_d,\\n\\t\\tyDomain: yDomain_d,\\n\\t\\tzDomain: zDomain_d,\\n\\t\\trDomain: rDomain_d,\\n\\t\\toriginalSettings: writable(originalSettings),\\n\\t\\txScale: xScale_d,\\n\\t\\txGet: xGet_d,\\n\\t\\tyScale: yScale_d,\\n\\t\\tyGet: yGet_d,\\n\\t\\tzScale: zScale_d,\\n\\t\\tzGet: zGet_d,\\n\\t\\trScale: rScale_d,\\n\\t\\trGet: rGet_d\\n\\t};\\n\\n\\t$: setContext('LayerCake', context);\\n</script>\\n\\n<div\\n\\tclass=\\\"layercake-container\\\"\\n\\tbind:clientWidth={containerWidth}\\n\\tbind:clientHeight={containerHeight}\\n>\\n\\t<slot></slot>\\n</div>\\n\\n<style>\\n\\t:global(.layercake-container),\\n\\t:global(.layercake-container *) {\\n\\t\\tbox-sizing: border-box;\\n\\t}\\n\\t.layercake-container {\\n\\t\\twidth: 100%;\\n\\t\\theight: 100%;\\n\\t}\\n\\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9sYXllcmNha2Uvc3JjL0xheWVyQ2FrZS5zdmVsdGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtDQUNDOztFQUVDLHNCQUFzQjtDQUN2QjtDQUNBO0VBQ0MsV0FBVztFQUNYLFlBQVk7Q0FDYiIsImZpbGUiOiJub2RlX21vZHVsZXMvbGF5ZXJjYWtlL3NyYy9MYXllckNha2Uuc3ZlbHRlIiwic291cmNlc0NvbnRlbnQiOlsiXG5cdDpnbG9iYWwoLmxheWVyY2FrZS1jb250YWluZXIpLFxuXHQ6Z2xvYmFsKC5sYXllcmNha2UtY29udGFpbmVyICopIHtcblx0XHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHR9XG5cdC5sYXllcmNha2UtY29udGFpbmVyIHtcblx0XHR3aWR0aDogMTAwJTtcblx0XHRoZWlnaHQ6IDEwMCU7XG5cdH1cbiJdfQ== */</style>\\n\"],\"names\":[],\"mappings\":\"AAkRS,oBAAoB,AAAC,CACrB,sBAAsB,AAAE,CAAC,AAChC,UAAU,CAAE,UAAU,AACvB,CAAC,AACD,oBAAoB,eAAC,CAAC,AACrB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AACb,CAAC\"}"
};

const LayerCake = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { width = undefined } = $$props;
	let { height = undefined } = $$props;
	let { containerWidth = width || 350 } = $$props;
	let { containerHeight = height || 250 } = $$props;
	let { x = undefined } = $$props;
	let { y = undefined } = $$props;
	let { z = undefined } = $$props;
	let { r = undefined } = $$props;
	let { custom = {} } = $$props;
	let { data = [] } = $$props;
	let { xDomain = undefined } = $$props;
	let { yDomain = undefined } = $$props;
	let { zDomain = undefined } = $$props;
	let { rDomain = undefined } = $$props;
	let { xNice = false } = $$props;
	let { yNice = false } = $$props;
	let { zNice = false } = $$props;
	let { rNice = false } = $$props;
	let { xReverse = defaultReverses.x } = $$props;
	let { yReverse = defaultReverses.y } = $$props;
	let { zReverse = defaultReverses.z } = $$props;
	let { rReverse = defaultReverses.r } = $$props;
	let { xPadding = undefined } = $$props;
	let { yPadding = undefined } = $$props;
	let { zPadding = undefined } = $$props;
	let { rPadding = undefined } = $$props;
	let { xScale = defaultScales.x } = $$props;
	let { yScale = defaultScales.y } = $$props;
	let { zScale = defaultScales.y } = $$props;
	let { rScale = defaultScales.r } = $$props;
	let { xRange = undefined } = $$props;
	let { yRange = undefined } = $$props;
	let { zRange = undefined } = $$props;
	let { rRange = undefined } = $$props;
	let { padding = {} } = $$props;
	let { flatData = undefined } = $$props;

	/* --------------------------------------------
 * Preserve a copy of our passed in settings before we modify them
 * Return this to the user's context so they can reference things if need be
 * Add the active keys since those aren't on our settings object.
 * This is mostly an escape-hatch
 */
	const originalSettings = {};

	/* --------------------------------------------
 * Make store versions of each parameter
 * Prefix these with `_` to keep things organized
 */
	const _containerWidth = writable();

	const _containerHeight = writable();
	const _x = writable();
	const _y = writable();
	const _z = writable();
	const _r = writable();
	const _custom = writable();
	const _data = writable();
	const _xDomain = writable();
	const _yDomain = writable();
	const _zDomain = writable();
	const _rDomain = writable();
	const _xNice = writable();
	const _yNice = writable();
	const _zNice = writable();
	const _rNice = writable();
	const _xReverse = writable();
	const _yReverse = writable();
	const _zReverse = writable();
	const _rReverse = writable();
	const _xPadding = writable();
	const _yPadding = writable();
	const _zPadding = writable();
	const _rPadding = writable();
	const _xScale = writable();
	const _yScale = writable();
	const _zScale = writable();
	const _rScale = writable();
	const _xRange = writable();
	const _yRange = writable();
	const _zRange = writable();
	const _rRange = writable();
	const _padding = writable();
	const _flatData = writable();

	/* --------------------------------------------
 * Create derived values
 * Suffix these with `_d`
 */
	const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
		return [
			{ field: "x", accessor: $x },
			{ field: "y", accessor: $y },
			{ field: "z", accessor: $z },
			{ field: "r", accessor: $r }
		].filter(d => d.accessor);
	});

	const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
		const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
		return Object.assign(defaultPadding, $padding);
	});

	const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
		const b = {};
		b.top = $padding.top;
		b.right = $containerWidth - $padding.right;
		b.bottom = $containerHeight - $padding.bottom;
		b.left = $padding.left;
		b.width = b.right - b.left;
		b.height = b.bottom - b.top;

		if (b.width < 0 && b.height < 0) {
			console.error("[LayerCake] Target div has negative width and height. Did you forget to set a width or height on the container?");
		} else if (b.width < 0) {
			console.error("[LayerCake] Target div has a negative width. Did you forget to set that CSS on the container?");
		} else if (b.height < 0) {
			console.error("[LayerCake] Target div has negative height. Did you forget to set that CSS on the container?");
		}

		return b;
	});

	const width_d = derived([box_d], ([$box]) => {
		return $box.width;
	});

	const height_d = derived([box_d], ([$box]) => {
		return $box.height;
	});

	/* --------------------------------------------
 * Calculate extents by taking the extent of the data
 * and filling that in with anything set by the user
 */
	const extents_d = derived([_flatData, activeGetters_d], ([$flatData, $activeGetters]) => {
		return calcExtents($flatData, $activeGetters);
	});

	const xDomain_d = derived([extents_d, _xDomain], calcDomain("x"));
	const yDomain_d = derived([extents_d, _yDomain], calcDomain("y"));
	const zDomain_d = derived([extents_d, _zDomain], calcDomain("z"));
	const rDomain_d = derived([extents_d, _rDomain], calcDomain("r"));

	const xScale_d = derived(
		[
			_xScale,
			extents_d,
			xDomain_d,
			_xPadding,
			_xNice,
			_xReverse,
			width_d,
			height_d,
			_xRange
		],
		createScale("x")
	);

	const xGet_d = derived([_x, xScale_d], createGetter);

	const yScale_d = derived(
		[
			_yScale,
			extents_d,
			yDomain_d,
			_yPadding,
			_yNice,
			_yReverse,
			width_d,
			height_d,
			_yRange
		],
		createScale("y")
	);

	const yGet_d = derived([_y, yScale_d], createGetter);

	const zScale_d = derived(
		[
			_zScale,
			extents_d,
			zDomain_d,
			_zPadding,
			_zNice,
			_zReverse,
			width_d,
			height_d,
			_zRange
		],
		createScale("z")
	);

	const zGet_d = derived([_z, zScale_d], createGetter);

	const rScale_d = derived(
		[
			_rScale,
			extents_d,
			rDomain_d,
			_rPadding,
			_rNice,
			_rReverse,
			width_d,
			height_d,
			_rRange
		],
		createScale("r")
	);

	const rGet_d = derived([_r, rScale_d], createGetter);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.containerWidth === void 0 && $$bindings.containerWidth && containerWidth !== void 0) $$bindings.containerWidth(containerWidth);
	if ($$props.containerHeight === void 0 && $$bindings.containerHeight && containerHeight !== void 0) $$bindings.containerHeight(containerHeight);
	if ($$props.x === void 0 && $$bindings.x && x !== void 0) $$bindings.x(x);
	if ($$props.y === void 0 && $$bindings.y && y !== void 0) $$bindings.y(y);
	if ($$props.z === void 0 && $$bindings.z && z !== void 0) $$bindings.z(z);
	if ($$props.r === void 0 && $$bindings.r && r !== void 0) $$bindings.r(r);
	if ($$props.custom === void 0 && $$bindings.custom && custom !== void 0) $$bindings.custom(custom);
	if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
	if ($$props.xDomain === void 0 && $$bindings.xDomain && xDomain !== void 0) $$bindings.xDomain(xDomain);
	if ($$props.yDomain === void 0 && $$bindings.yDomain && yDomain !== void 0) $$bindings.yDomain(yDomain);
	if ($$props.zDomain === void 0 && $$bindings.zDomain && zDomain !== void 0) $$bindings.zDomain(zDomain);
	if ($$props.rDomain === void 0 && $$bindings.rDomain && rDomain !== void 0) $$bindings.rDomain(rDomain);
	if ($$props.xNice === void 0 && $$bindings.xNice && xNice !== void 0) $$bindings.xNice(xNice);
	if ($$props.yNice === void 0 && $$bindings.yNice && yNice !== void 0) $$bindings.yNice(yNice);
	if ($$props.zNice === void 0 && $$bindings.zNice && zNice !== void 0) $$bindings.zNice(zNice);
	if ($$props.rNice === void 0 && $$bindings.rNice && rNice !== void 0) $$bindings.rNice(rNice);
	if ($$props.xReverse === void 0 && $$bindings.xReverse && xReverse !== void 0) $$bindings.xReverse(xReverse);
	if ($$props.yReverse === void 0 && $$bindings.yReverse && yReverse !== void 0) $$bindings.yReverse(yReverse);
	if ($$props.zReverse === void 0 && $$bindings.zReverse && zReverse !== void 0) $$bindings.zReverse(zReverse);
	if ($$props.rReverse === void 0 && $$bindings.rReverse && rReverse !== void 0) $$bindings.rReverse(rReverse);
	if ($$props.xPadding === void 0 && $$bindings.xPadding && xPadding !== void 0) $$bindings.xPadding(xPadding);
	if ($$props.yPadding === void 0 && $$bindings.yPadding && yPadding !== void 0) $$bindings.yPadding(yPadding);
	if ($$props.zPadding === void 0 && $$bindings.zPadding && zPadding !== void 0) $$bindings.zPadding(zPadding);
	if ($$props.rPadding === void 0 && $$bindings.rPadding && rPadding !== void 0) $$bindings.rPadding(rPadding);
	if ($$props.xScale === void 0 && $$bindings.xScale && xScale !== void 0) $$bindings.xScale(xScale);
	if ($$props.yScale === void 0 && $$bindings.yScale && yScale !== void 0) $$bindings.yScale(yScale);
	if ($$props.zScale === void 0 && $$bindings.zScale && zScale !== void 0) $$bindings.zScale(zScale);
	if ($$props.rScale === void 0 && $$bindings.rScale && rScale !== void 0) $$bindings.rScale(rScale);
	if ($$props.xRange === void 0 && $$bindings.xRange && xRange !== void 0) $$bindings.xRange(xRange);
	if ($$props.yRange === void 0 && $$bindings.yRange && yRange !== void 0) $$bindings.yRange(yRange);
	if ($$props.zRange === void 0 && $$bindings.zRange && zRange !== void 0) $$bindings.zRange(zRange);
	if ($$props.rRange === void 0 && $$bindings.rRange && rRange !== void 0) $$bindings.rRange(rRange);
	if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0) $$bindings.padding(padding);
	if ($$props.flatData === void 0 && $$bindings.flatData && flatData !== void 0) $$bindings.flatData(flatData);
	$$result.css.add(css);

	 {
		if (x) originalSettings.x = x;
	}

	 {
		if (y) originalSettings.y = y;
	}

	 {
		if (z) originalSettings.z = z;
	}

	 {
		if (r) originalSettings.r = r;
	}

	 {
		if (xDomain) originalSettings.xDomain = xDomain;
	}

	 {
		if (yDomain) originalSettings.yDomain = yDomain;
	}

	 {
		if (zDomain) originalSettings.zDomain = zDomain;
	}

	 {
		if (rDomain) originalSettings.rDomain = rDomain;
	}

	 {
		if (xRange) originalSettings.xRange = xRange;
	}

	 {
		if (yRange) originalSettings.yRange = yRange;
	}

	 {
		if (zRange) originalSettings.zRange = zRange;
	}

	 {
		if (rRange) originalSettings.rRange = rRange;
	}

	 {
		_containerWidth.set(containerWidth);
	}

	 {
		_containerHeight.set(containerHeight);
	}

	 {
		_x.set(makeAccessor(x));
	}

	 {
		_y.set(makeAccessor(y));
	}

	 {
		_z.set(makeAccessor(z));
	}

	 {
		_r.set(makeAccessor(r));
	}

	 {
		_xDomain.set(xDomain);
	}

	 {
		_yDomain.set(yDomain);
	}

	 {
		_zDomain.set(zDomain);
	}

	 {
		_rDomain.set(rDomain);
	}

	 {
		_custom.set(custom);
	}

	 {
		_data.set(data);
	}

	 {
		_xNice.set(xNice);
	}

	 {
		_yNice.set(yNice);
	}

	 {
		_zNice.set(zNice);
	}

	 {
		_rNice.set(rNice);
	}

	 {
		_xReverse.set(xReverse);
	}

	 {
		_yReverse.set(yReverse);
	}

	 {
		_zReverse.set(zReverse);
	}

	 {
		_rReverse.set(rReverse);
	}

	 {
		_xPadding.set(xPadding);
	}

	 {
		_yPadding.set(yPadding);
	}

	 {
		_zPadding.set(zPadding);
	}

	 {
		_rPadding.set(rPadding);
	}

	 {
		_xScale.set(xScale);
	}

	 {
		_yScale.set(yScale);
	}

	 {
		_zScale.set(zScale);
	}

	 {
		_rScale.set(rScale);
	}

	 {
		_xRange.set(xRange);
	}

	 {
		_yRange.set(yRange);
	}

	 {
		_zRange.set(zRange);
	}

	 {
		_rRange.set(rRange);
	}

	 {
		_padding.set(padding);
	}

	 {
		_flatData.set(flatData || data);
	}

	let context = {
		activeGetters: activeGetters_d,
		width: width_d,
		height: height_d,
		containerWidth: _containerWidth,
		containerHeight: _containerHeight,
		x: _x,
		y: _y,
		z: _z,
		r: _r,
		custom: _custom,
		data: _data,
		xNice: _xNice,
		yNice: _yNice,
		zNice: _zNice,
		rNice: _rNice,
		xReverse: _xReverse,
		yReverse: _yReverse,
		zReverse: _zReverse,
		rReverse: _rReverse,
		xPadding: _xPadding,
		yPadding: _yPadding,
		zPadding: _zPadding,
		rPadding: _rPadding,
		padding: padding_d,
		flatData: _flatData,
		extents: extents_d,
		xDomain: xDomain_d,
		yDomain: yDomain_d,
		zDomain: zDomain_d,
		rDomain: rDomain_d,
		originalSettings: writable(originalSettings),
		xScale: xScale_d,
		xGet: xGet_d,
		yScale: yScale_d,
		yGet: yGet_d,
		zScale: zScale_d,
		zGet: zGet_d,
		rScale: rScale_d,
		rGet: rGet_d
	};

	 {
		setContext("LayerCake", context);
	}

	return `<div class="${"layercake-container svelte-1sz872l"}">
	${$$slots.default ? $$slots.default({}) : ``}
</div>`;
});

/* node_modules/layercake/src/layouts/Svg.svelte generated by Svelte v3.19.1 */

const css$1 = {
	code: "svg.svelte-1bkfh9w{position:absolute;top:0;left:0}",
	map: "{\"version\":3,\"file\":\"Svg.svelte\",\"sources\":[\"Svg.svelte\"],\"sourcesContent\":[\"<script>\\n\\timport { getContext } from 'svelte';\\n\\n\\texport let zIndex = undefined;\\n\\tlet zIndexStyle = '';\\n\\n\\t$: zIndexStyle = typeof zIndex !== 'undefined' ? `z-index:${zIndex};` : '';\\n\\n\\tconst { containerWidth, containerHeight, padding } = getContext('LayerCake');\\n</script>\\n<svg\\n\\tclass=\\\"layercake-layout-svg\\\"\\n\\twidth={$containerWidth}\\n\\theight={$containerHeight}\\n\\tstyle=\\\"{zIndexStyle}\\\"\\n>\\n\\t<g transform=\\\"translate({$padding.left}, {$padding.top})\\\">\\n\\t\\t<slot></slot>\\n\\t</g>\\n</svg>\\n\\n<style>\\n\\tsvg {\\n\\t\\tposition: absolute;\\n\\t\\ttop: 0;\\n\\t\\tleft: 0;\\n\\t}\\n\\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9sYXllcmNha2Uvc3JjL2xheW91dHMvU3ZnLnN2ZWx0ZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0NBQ0M7RUFDQyxrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLE9BQU87Q0FDUiIsImZpbGUiOiJub2RlX21vZHVsZXMvbGF5ZXJjYWtlL3NyYy9sYXlvdXRzL1N2Zy5zdmVsdGUiLCJzb3VyY2VzQ29udGVudCI6WyJcblx0c3ZnIHtcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0dG9wOiAwO1xuXHRcdGxlZnQ6IDA7XG5cdH1cbiJdfQ== */</style>\\n\"],\"names\":[],\"mappings\":\"AAsBC,GAAG,eAAC,CAAC,AACJ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,AACR,CAAC\"}"
};

const Svg = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $containerWidth;
	let $containerHeight;
	let $padding;
	let { zIndex = undefined } = $$props;
	let zIndexStyle = "";
	const { containerWidth, containerHeight, padding } = getContext("LayerCake");
	$containerWidth = get_store_value(containerWidth);
	$containerHeight = get_store_value(containerHeight);
	$padding = get_store_value(padding);
	if ($$props.zIndex === void 0 && $$bindings.zIndex && zIndex !== void 0) $$bindings.zIndex(zIndex);
	$$result.css.add(css$1);
	$containerWidth = get_store_value(containerWidth);
	$containerHeight = get_store_value(containerHeight);
	$padding = get_store_value(padding);

	zIndexStyle = typeof zIndex !== "undefined"
	? `z-index:${zIndex};`
	: "";

	return `<svg class="${"layercake-layout-svg svelte-1bkfh9w"}"${add_attribute("width", $containerWidth, 0)}${add_attribute("height", $containerHeight, 0)}${add_attribute("style", zIndexStyle, 0)}>
	<g transform="${"translate(" + escape($padding.left) + ", " + escape($padding.top) + ")"}">
		${$$slots.default ? $$slots.default({}) : ``}
	</g>
</svg>`;
});

/* src/components/Child.svelte generated by Svelte v3.19.1 */

const css$2 = {
	code: "p.svelte-107opnt{color:green}",
	map: "{\"version\":3,\"file\":\"Child.svelte\",\"sources\":[\"Child.svelte\"],\"sourcesContent\":[\"<style lang=\\\"scss\\\">p {\\n  color: green; }\\n/*# sourceMappingURL=src/components/Child.svelte.map */</style>\\n\\n<script>\\n  let s = 0;\\n  setInterval(() => (s += 1), 1000);\\n</script>\\n\\n<p>I have been here for {s} seconds.</p>\\n\"],\"names\":[],\"mappings\":\"AAAmB,CAAC,eAAC,CAAC,AACpB,KAAK,CAAE,KAAK,AAAE,CAAC\"}"
};

const Child = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let s = 0;
	setInterval(() => s += 1, 1000);
	$$result.css.add(css$2);
	return `<p class="${"svelte-107opnt"}">I have been here for ${escape(s)} seconds.</p>`;
});

/* src/components/Scatter.svelte generated by Svelte v3.19.1 */

const Scatter = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $data;
	let $xScale;
	let $x;
	let $yScale;
	let $y;

	// Access the context using the 'LayerCake' keyword
	// Grab some helpful functions
	const { data, x, xScale, y, yScale } = getContext("LayerCake");

	$data = get_store_value(data);
	$x = get_store_value(x);
	$xScale = get_store_value(xScale);
	$y = get_store_value(y);
	$yScale = get_store_value(yScale);
	let { fill = "#000" } = $$props;
	let { r = 5 } = $$props;
	if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0) $$bindings.fill(fill);
	if ($$props.r === void 0 && $$bindings.r && r !== void 0) $$bindings.r(r);
	$data = get_store_value(data);
	$xScale = get_store_value(xScale);
	$x = get_store_value(x);
	$yScale = get_store_value(yScale);
	$y = get_store_value(y);

	return `<g>
  ${each($data, d => `<circle${add_attribute("cx", $xScale($x(d)), 0)}${add_attribute("cy", $yScale($y(d)), 0)}${add_attribute("fill", fill, 0)}${add_attribute("r", r, 0)}></circle>`)}
</g>`;
});

var wordmarkSvg = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"wordmark\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 192.6 50\" style=\"enable-background:new 0 0 192.6 50;\" xml:space=\"preserve\">\n<g>\n\t<path class=\"st0\" d=\"M150.1,9.5c1.5,0,2.8,1.3,2.8,2.8s-1.3,2.8-2.8,2.8s-2.8-1.3-2.8-2.8S148.6,9.5,150.1,9.5z\"/>\n\t<path class=\"st0\" d=\"M147.2,17.3h5.6v18.2h-5.6V17.3z\"/>\n\t<path class=\"st0\" d=\"M77.1,9.5h-1.9h-7v19.3v6.7h5.6v-6.7v-1.4h1.4h1.9c4.9,0,8.9-4,8.9-8.9S82.1,9.5,77.1,9.5z M77.1,21.8h-1.9\n\t\th-1.4v-1.4v-3.8v-1.4h1.4h1.9c1.8,0,3.3,1.5,3.3,3.3S79,21.8,77.1,21.8z\"/>\n\t<path class=\"st0\" d=\"M105.7,17.6h-5.6v8.9c0,1.8-1.5,3.3-3.3,3.3s-3.3-1.5-3.3-3.3v-8.9h-5.6v8.9c0,4.9,4,8.9,8.9,8.9\n\t\ts8.9-4,8.9-8.9V17.6z\"/>\n\t<path class=\"st0\" d=\"M164.1,17.6c-4.9,0-8.9,4-8.9,8.9v8.9h5.6v-8.9c0-1.8,1.5-3.3,3.3-3.3s3.3,1.5,3.3,3.3v8.9h5.6v-8.9\n\t\tC173,21.6,169,17.6,164.1,17.6z\"/>\n\t<path class=\"st0\" d=\"M119.7,16.2v1.4h-1.4h-1.9c-4.9,0-8.9,4-8.9,8.9s4,8.9,8.9,8.9h1.9h7V16.2V9.5l-5.6,3.3\n\t\tC119.7,12.8,119.7,16.2,119.7,16.2z M119.8,24.6v3.8v1.4h-1.4h-1.9c-1.8,0-3.3-1.5-3.3-3.3s1.5-3.3,3.3-3.3h1.9h1.4V24.6z\"/>\n\t<path class=\"st0\" d=\"M139.3,16.2v1.4h-1.4H136c-4.9,0-8.9,4-8.9,8.9s4,8.9,8.9,8.9h1.9h7V16.2V9.5l-5.6,3.3V16.2z M139.4,24.6v3.8\n\t\tv1.4h-1.5H136c-1.8,0-3.3-1.5-3.3-3.3s1.5-3.3,3.3-3.3h1.9h1.4v1.4H139.4z\"/>\n\t<path class=\"st0\" d=\"M183.7,17.6c-4.9,0-8.9,4-8.9,8.9s4,8.9,8.9,8.9h1.9h1.4v1.4v0.9v1.4v1.4c0,1.8-1.5,3.3-3.3,3.3\n\t\ts-3.3-1.5-3.3-3.3V38l-5.6,3.3c0.4,4.5,4.2,8.1,8.9,8.1c4.9,0,8.9-4,8.9-8.9v-1.4v-2.3V17.6h-7H183.7z M187,23.4v1.4v3.8V30h-1.4\n\t\th-1.9c-1.8,0-3.3-1.5-3.3-3.3s1.5-3.3,3.3-3.3h1.9C185.6,23.4,187,23.4,187,23.4z\"/>\n\t<path class=\"st0\" d=\"M28.6,17.6c-1.2,0-2.3,0.2-3.3,0.6V9.5l-5.6,3.3v13.7v2v6.9h5.6v-6.9l0,0v-2c0-1.8,1.5-3.3,3.3-3.3\n\t\ts3.3,1.5,3.3,3.3v8.9h5.6v-8.9C37.5,21.6,33.5,17.6,28.6,17.6z\"/>\n\t<path class=\"st0\" d=\"M17.8,9.5H0v5.6h6.1v20.3h5.6V15.1h6.1V9.5z\"/>\n\t<path class=\"st0\" d=\"M48.3,30.2c-0.4,0-1.2-0.1-1.8-0.4l5.2-2.1l5.6-2.3l-1-2.3l-0.1-0.2c-0.1-0.3-0.3-0.6-0.5-1\n\t\tc-0.1-0.1-0.1-0.2-0.2-0.3c0,0,0-0.1-0.1-0.1l-0.1-0.1l-0.1-0.1c-1.6-2.2-4-3.5-6.7-3.7l0,0h-0.6c-4.9,0-8.9,4-8.9,8.9\n\t\tc0,0.4,0,0.9,0.1,1.4l0,0V28c0,0,0,0,0,0.1c0,0,0,0,0,0.1c0,0.3,0.1,0.5,0.2,0.8v0.1v0.1c0.1,0.3,0.2,0.7,0.4,1v0.1v0.1\n\t\tc0.1,0.3,0.3,0.5,0.4,0.8c0,0.1,0.1,0.1,0.1,0.2l0,0c0.1,0.2,0.3,0.4,0.4,0.6c0,0,0,0,0,0.1c0,0,0,0.1,0.1,0.1l0.1,0.1\n\t\tc1.7,2.1,4.4,3.4,7.2,3.4h6.1v-5.2C54.5,30.2,50.6,30.2,48.3,30.2L48.3,30.2z M56.2,22.9L56.2,22.9L56.2,22.9z M44.6,25.7\n\t\tL44.6,25.7l-0.2,0.1c0.2-1.9,1.8-3.5,3.7-3.5c0.9,0,1.8,0.4,2.4,0.9L46.2,25L44.6,25.7L44.6,25.7z\"/>\n</g>\n</svg>";

var petData = [ { name:"Russell",
    pet:"Smokey" },
  { name:"Amelia",
    pet:"Lennie" } ];

/* src/components/App.svelte generated by Svelte v3.19.1 */

const css$3 = {
	code: "h1.svelte-1jp7l9w{color:var(--c1)}strong.svelte-1jp7l9w{color:var(--c2)}img.svelte-1jp7l9w{width:20rem;display:block}.chart.svelte-1jp7l9w{width:20rem;height:20rem;background:pink}",
	map: "{\"version\":3,\"file\":\"App.svelte\",\"sources\":[\"App.svelte\"],\"sourcesContent\":[\"<style>\\n  /* vars defined in public/assets/global.css */\\n  h1 {\\n    color: var(--c1);\\n  }\\n\\n  strong {\\n    color: var(--c2);\\n  }\\n\\n  img {\\n    width: 20rem;\\n    display: block;\\n  }\\n  .chart {\\n    width: 20rem;\\n    height: 20rem;\\n    background: pink;\\n  }\\n\\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL0FwcC5zdmVsdGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtFQUNFLDZDQUE2QztFQUM3QztJQUNFLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFLFlBQVk7SUFDWixjQUFjO0VBQ2hCO0VBQ0E7SUFDRSxZQUFZO0lBQ1osYUFBYTtJQUNiLGdCQUFnQjtFQUNsQiIsImZpbGUiOiJzcmMvY29tcG9uZW50cy9BcHAuc3ZlbHRlIiwic291cmNlc0NvbnRlbnQiOlsiXG4gIC8qIHZhcnMgZGVmaW5lZCBpbiBwdWJsaWMvYXNzZXRzL2dsb2JhbC5jc3MgKi9cbiAgaDEge1xuICAgIGNvbG9yOiB2YXIoLS1jMSk7XG4gIH1cblxuICBzdHJvbmcge1xuICAgIGNvbG9yOiB2YXIoLS1jMik7XG4gIH1cblxuICBpbWcge1xuICAgIHdpZHRoOiAyMHJlbTtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgfVxuICAuY2hhcnQge1xuICAgIHdpZHRoOiAyMHJlbTtcbiAgICBoZWlnaHQ6IDIwcmVtO1xuICAgIGJhY2tncm91bmQ6IHBpbms7XG4gIH1cbiJdfQ== */</style>\\n\\n<script>\\n  import { LayerCake, Svg } from \\\"layercake\\\";\\n  import Child from \\\"./Child.svelte\\\";\\n  import Scatter from \\\"./Scatter.svelte\\\";\\n  import wordmarkSvg from \\\"../svg/wordmark.svg\\\";\\n  import petData from \\\"../data/pets.csv\\\";\\n  import user from \\\"tabler-icons/icons/user.svg\\\";\\n\\n  export let name;\\n\\n  const points = [{ x: 0, y: 1 }, { x: 10, y: 5 }, { x: 15, y: 10 }];\\n  const r = 6;\\n  const padding = { top: r * 2, right: r * 2, bottom: r * 2, left: r * 2 };\\n</script>\\n\\n<a class=\\\"wordmark\\\" href=\\\"https://pudding.cool\\\">\\n  {@html wordmarkSvg}\\n</a>\\n\\n<h1>Hello {name}!</h1>\\n\\n{#each petData as { name, pet }}\\n  <p>\\n    {name} has\\n    <strong>{pet}.</strong>\\n  </p>\\n{/each}\\n\\n<img alt=\\\"smokey\\\" src=\\\"assets/smokey.jpg\\\" />\\n<Child />\\n\\n<div class=\\\"chart\\\">\\n  <LayerCake data=\\\"{points}\\\" x=\\\"x\\\" y=\\\"y\\\" {padding}>\\n    <Svg>\\n      <Scatter {r} />\\n    </Svg>\\n  </LayerCake>\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAEE,EAAE,eAAC,CAAC,AACF,KAAK,CAAE,IAAI,IAAI,CAAC,AAClB,CAAC,AAED,MAAM,eAAC,CAAC,AACN,KAAK,CAAE,IAAI,IAAI,CAAC,AAClB,CAAC,AAED,GAAG,eAAC,CAAC,AACH,KAAK,CAAE,KAAK,CACZ,OAAO,CAAE,KAAK,AAChB,CAAC,AACD,MAAM,eAAC,CAAC,AACN,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,UAAU,CAAE,IAAI,AAClB,CAAC\"}"
};

const r = 6;

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { name } = $$props;
	const points = [{ x: 0, y: 1 }, { x: 10, y: 5 }, { x: 15, y: 10 }];

	const padding = {
		top: r * 2,
		right: r * 2,
		bottom: r * 2,
		left: r * 2
	};

	if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
	$$result.css.add(css$3);

	return `<a class="${"wordmark"}" href="${"https://pudding.cool"}">
  ${wordmarkSvg}
</a>

<h1 class="${"svelte-1jp7l9w"}">Hello ${escape(name)}!</h1>

${each(petData, ({ name, pet }) => `<p>
    ${escape(name)} has
    <strong class="${"svelte-1jp7l9w"}">${escape(pet)}.</strong>
  </p>`)}

<img alt="${"smokey"}" src="${"assets/smokey.jpg"}" class="${"svelte-1jp7l9w"}">
${validate_component(Child, "Child").$$render($$result, {}, {}, {})}

<div class="${"chart svelte-1jp7l9w"}">
  ${validate_component(LayerCake, "LayerCake").$$render($$result, { data: points, x: "x", y: "y", padding }, {}, {
		default: () => `
    ${validate_component(Svg, "Svg").$$render($$result, {}, {}, {
			default: () => `
      ${validate_component(Scatter, "Scatter").$$render($$result, { r }, {}, {})}
    `
		})}
  `
	})}
</div>`;
});

module.exports = App;
