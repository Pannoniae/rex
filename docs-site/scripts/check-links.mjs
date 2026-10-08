import fs from 'node:fs';
import path from 'node:path';

const outputDirectory = 'dist';
const origin = 'https://example.invalid';

const homepage = fs.readFileSync(path.join(outputDirectory, 'index.html'), 'utf8');
const sitemapReference = homepage.match(/rel="sitemap" href="([^"]+)"/)?.[1];
if (!sitemapReference) throw new Error('Could not determine the generated site base path.');

const basePath = new URL(sitemapReference, origin).pathname.replace(/sitemap-index\.xml$/, '');

function walk(directory) {
	return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = path.join(directory, entry.name);
		return entry.isDirectory() ? walk(entryPath) : entryPath;
	});
}

function outputCandidates(pathname) {
	const relativePath = decodeURIComponent(pathname.slice(basePath.length));
	return [
		path.join(outputDirectory, relativePath),
		path.join(outputDirectory, relativePath, 'index.html'),
		path.join(outputDirectory, `${relativePath}.html`),
	];
}

const failures = [];
const pages = walk(outputDirectory).filter((file) => file.endsWith('.html'));

for (const page of pages) {
	const html = fs.readFileSync(page, 'utf8');
	const relativePage = path
		.relative(outputDirectory, page)
		.replaceAll(path.sep, '/')
		.replace(/index\.html$/, '');
	const pageUrl = new URL(`${basePath}${relativePage}`, origin);

	for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
		const reference = match[1];
		if (/^(?:https?:|mailto:|tel:|data:|#)/.test(reference)) continue;

		const target = new URL(reference, pageUrl);
		if (!target.pathname.startsWith(basePath)) {
			failures.push(`${page}: ${reference} escapes ${basePath}`);
			continue;
		}

		if (!outputCandidates(target.pathname).some((candidate) => fs.existsSync(candidate))) {
			failures.push(`${page}: ${reference} does not resolve to generated output`);
		}
	}
}

if (failures.length > 0) {
	console.error(`Found ${failures.length} broken internal reference(s):\n${failures.join('\n')}`);
	process.exitCode = 1;
} else {
	console.log(`Checked ${pages.length} generated pages: all internal references resolve.`);
}
