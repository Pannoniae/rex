# url-extras

> Browser-compatible implementations of some of Node.js' URL utilities

Browser-compatible versions of Node.js' [`url.fileURLToPath()`](https://nodejs.org/api/url.html#urlfileurltopathurl-options) and [`url.pathToFileURL()`](https://nodejs.org/api/url.html#urlpathtofileurlpath-options).

## Why?

Modern bundlers like Vite and Webpack 5+ don't polyfill Node.js core modules. This package provides zero-dependency implementations using only standard JavaScript APIs that work everywhere.

## Features

- Browser-compatible (uses only standard JavaScript APIs)
- Zero dependencies
- Cross-platform (Windows drive letters, UNC paths, Unix paths)
- TypeScript support
- Tree-shakeable ESM

## Install

```sh
npm install url-extras
```

## Usage

```js
import {fileURLToPath} from 'url-extras';

// Convert file URL to path
fileURLToPath('file:///Users/user/file.txt');
//=> '/Users/user/file.txt'
```

## API

### fileURLToPath(url, options?)

Convert a file URL to a file path.

Platform-aware: On Windows (or when `options.windows` is `true`), drive letters (e.g., `file:///C:/`) are converted to Windows paths (e.g., `C:\`), and UNC paths (e.g., `file://server/share`) are converted to Windows UNC format (e.g., `\\server\share`). On Unix-like systems (or when `options.windows` is `false`), file URLs with hostnames (except `localhost`) will throw an error, matching Node.js behavior.

```js
import {fileURLToPath} from 'url-extras';

fileURLToPath('file:///Users/user/file.txt');
//=> '/Users/user/file.txt'

fileURLToPath('file:///C:/Users/user/file.txt');
//=> 'C:\\Users\\user\\file.txt' (on Windows)

fileURLToPath(new URL('file:///Users/user/file.txt'));
//=> '/Users/user/file.txt'

// UNC paths work on Windows but throw on Unix
fileURLToPath('file://server/share/file.txt');
//=> '\\\\server\\share\\file.txt' (on Windows)
//=> Throws TypeError (on Unix - hostnames not allowed)

// Explicit platform control
fileURLToPath('file:///C:/test', {windows: true});
//=> 'C:\\test'

fileURLToPath('file:///C:/test', {windows: false});
//=> '/C:/test'
```

#### url

Type: `string | URL`

The file URL to convert.

#### options

Type: `object`

##### windows

Type: `boolean`\
Default: Auto-detected in Node.js, `false` in browsers

Explicitly specify whether to use Windows path rules.

- When `undefined` (default), automatically detects based on the runtime platform (`process.platform`).
- When `true`, Windows-style paths are used (backslashes, drive letters, UNC paths).
- When `false`, Unix-style paths are used (forward slashes only).

In browsers where `process.platform` is not available, this defaults to `false` (Unix rules).

### pathToFileURL(path, options?)

Convert a file path to a file URL.

The path must be absolute. Throws a `TypeError` if the path is not absolute.

Returns a `URL` object.

On Windows (or when `options.windows` is `true`), handles drive letters (e.g., `C:\` → `file:///C://`, `C:\path` → `file:///C:/path`) and UNC paths (e.g., `\\server\share` → `file://server/share`). Drive letter case is preserved. On Unix-like systems (or when `options.windows` is `false`), converts absolute paths to `file:///` URLs.

**Note:** Unlike Node.js, this implementation requires absolute paths and will throw for relative paths, maintaining browser compatibility.

```js
import {pathToFileURL} from 'url-extras';

pathToFileURL('/Users/user/file.txt');
//=> URL { href: 'file:///Users/user/file.txt', ... }

pathToFileURL('/Users/user/file.txt').href;
//=> 'file:///Users/user/file.txt'

pathToFileURL('C:\\Users\\user\\file.txt').href;
//=> 'file:///C:/Users/user/file.txt'

pathToFileURL('C:\\').href;
//=> 'file:///C://'

pathToFileURL('\\\\server\\share\\file.txt').href;
//=> 'file://server/share/file.txt'

// Explicit platform control
pathToFileURL('C:\\test', {windows: true}).href;
//=> 'file:///C:/test'

pathToFileURL('/C:/test', {windows: false}).href;
//=> 'file:///C:/test' (colon is valid in Unix paths)
```

#### path

Type: `string`

The absolute file path to convert.

#### options

Type: `object`

Platform behavior options.

##### windows

Type: `boolean`\
Default: Auto-detected in Node.js, `false` in browsers

Explicitly specify whether to use Windows path rules.

- When `undefined` (default), automatically detects based on the runtime platform (`process.platform`).
- When `true`, Windows-style paths are used (backslashes, drive letters, UNC paths).
- When `false`, Unix-style paths are used (forward slashes only).

In browsers where `process.platform` is not available, this defaults to `false` (Unix rules).

## Related

- [normalize-url](https://github.com/sindresorhus/normalize-url) - Normalize a URL
