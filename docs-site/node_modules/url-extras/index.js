const isWindows = globalThis.process?.platform === 'win32';

const encodeMap = {
	'%': '%25',
	'#': '%23',
	'?': '%3F',
	' ': '%20',
	'\t': '%09',
	'\n': '%0A',
	'\r': '%0D',
	'~': '%7E',
	'[': '%5B',
	']': '%5D',
	'\\': '%5C',
	'|': '%7C',
};

function encodePath(path) {
	const hasTrailingSlash = path.endsWith('/');

	const encoded = path.split('/')
		.filter((segment, index) => segment || !index)
		.map(segment =>
			Array.from(segment, character => {
				const code = character.codePointAt(0);
				return (code <= 0x1F || code === 0x7F) ? encodeURIComponent(character) : (encodeMap[character] ?? character);
			}).join(''),
		).join('/');

	return hasTrailingSlash ? `${encoded}/` : encoded;
}

export function fileURLToPath(url, options) {
	if (typeof url !== 'string' && !(url instanceof URL)) {
		throw new TypeError(`Expected \`string\` or \`URL\`, got \`${typeof url}\``);
	}

	const useWindowsRules = options?.windows ?? isWindows;
	const urlObject = new URL(url);

	if (urlObject.protocol !== 'file:') {
		throw new TypeError('The URL must be a file URL');
	}

	const {hostname, pathname} = urlObject;

	if (/%2[Ff]/.test(pathname)) {
		throw new TypeError('File URL path must not include encoded / characters');
	}

	const path = decodeURIComponent(pathname);

	if (useWindowsRules && /^\/[A-Za-z]:/.test(path)) {
		return path.slice(1).replaceAll('/', '\\');
	}

	if (hostname && hostname !== 'localhost') {
		if (!useWindowsRules) {
			throw new TypeError('File URL host must be "localhost" or empty');
		}

		return `\\\\${hostname}${path.replaceAll('/', '\\')}`;
	}

	return path;
}

export function pathToFileURL(path, options) {
	if (typeof path !== 'string') {
		throw new TypeError(`Expected \`string\`, got \`${typeof path}\``);
	}

	const useWindowsRules = options?.windows ?? isWindows;

	if (useWindowsRules && /^[A-Za-z]:[\\/]/.test(path)) {
		const rest = encodePath(path.slice(3).replaceAll('\\', '/'));
		const suffix = rest && rest !== '/' ? `/${rest}` : '//';
		return new URL(`file:///${path[0]}:${suffix}`);
	}

	if (useWindowsRules && path.startsWith('\\\\')) {
		const parts = path.slice(2).split('\\');
		if (parts.length < 2 || !parts[1]) {
			throw new TypeError('UNC path must include a share name');
		}

		return new URL(`file://${parts[0]}/${encodePath(parts.slice(1).join('/'))}`);
	}

	if (path.startsWith('/')) {
		return new URL(`file:///${encodePath(path.slice(1))}`);
	}

	throw new TypeError('The path must be absolute');
}
