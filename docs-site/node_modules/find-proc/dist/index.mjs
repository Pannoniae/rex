import * as fs from "node:fs";
import * as os from "node:os";
import { exec, spawn } from "node:child_process";
import * as path from "node:path";
//#region src/logger.ts
const LEVEL_WEIGHT = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3
};
let currentWeight = LEVEL_WEIGHT.warn;
function enabled(level) {
	return LEVEL_WEIGHT[level] <= currentWeight;
}
var logger_default = {
	setLevel(level) {
		currentWeight = LEVEL_WEIGHT[level];
	},
	error(...args) {
		if (enabled("error")) console.error(...args);
	},
	warn(...args) {
		if (enabled("warn")) console.warn(...args);
	},
	info(...args) {
		if (enabled("info")) console.info(...args);
	}
};
//#endregion
//#region src/utils.ts
const UNIT_MB = 1048576;
const utils = {
	/**
	* exec command with maxBuffer size
	*/
	exec(cmd, callback) {
		exec(cmd, {
			maxBuffer: 2 * UNIT_MB,
			windowsHide: true,
			encoding: "utf8"
		}, callback);
	},
	/**
	* Strip top lines of text
	*/
	stripLine(text, num) {
		let idx = 0;
		while (num-- > 0) {
			const nIdx = text.indexOf("\n", idx);
			if (nIdx >= 0) idx = nIdx + 1;
		}
		return idx > 0 ? text.substring(idx) : text;
	},
	/**
	* Split string and stop at max parts
	*/
	split(line, max) {
		const cols = line.trim().split(/\s+/);
		if (cols.length > max) cols[max - 1] = cols.slice(max - 1).join(" ");
		return cols;
	},
	/**
	* Extract columns from table text
	*
	* Example:
	*
	* ```
	* extractColumns(text, [0, 2], 3)
	* ```
	*
	* From:
	* ```
	* foo       bar        bar2
	* valx      valy       valz
	* ```
	*
	* To:
	* ```
	* [ ['foo', 'bar2'], ['valx', 'valz'] ]
	* ```
	*/
	extractColumns(text, idxes, max) {
		const lines = text.split(/(\r\n|\n|\r)/);
		const columns = [];
		if (!max) max = Math.max.apply(null, idxes) + 1;
		lines.forEach((line) => {
			const cols = utils.split(line, max);
			const column = [];
			idxes.forEach((idx) => {
				column.push(cols[idx] || "");
			});
			columns.push(column);
		});
		return columns;
	},
	/**
	* parse table text to array
	*
	* From:
	* ```
	* Header1 : foo
	* Header2 : bar
	* Header3 : val
	*
	* Header1 : foo2
	* Header2 : bar2
	* Header3 : val2
	* ```
	*
	* To:
	* ```
	* [{ Header1: 'foo', Header2: 'bar', Header3: 'val' }, ...]
	* ```
	*/
	parseTable(data) {
		const lines = data.split(/(\r\n\r\n|\r\n\n|\n\r\n|\n\n)/).filter((line) => {
			return line && line.trim().length > 0;
		}).map((e) => e.split(/(\r\n|\n|\r)/).filter((line) => line.trim().length > 0));
		lines.forEach((line) => {
			for (let index = 0; line[index];) {
				const entry = line[index];
				if (entry.startsWith(" ")) {
					line[index - 1] += entry.trimStart();
					line.splice(index, 1);
				} else index += 1;
			}
		});
		return lines.map((line) => {
			const row = {};
			line.forEach((string) => {
				const splitterIndex = string.indexOf(":");
				const key = string.slice(0, splitterIndex).trim();
				row[key] = string.slice(splitterIndex + 1).trim();
			});
			return row;
		});
	}
};
function debugLog(config, msg, stdout, stderr) {
	if (!config.debug) return;
	let text = `[debug] ${msg}\n`;
	if (stdout !== void 0 || stderr !== void 0) text += `[debug] stdout:\n${(stdout || "").trim() || "(empty)"}\n[debug] stderr:\n${(stderr || "").trim() || "(empty)"}\n`;
	text += "\n";
	process.stderr.write(text);
}
//#endregion
//#region src/find_pid.ts
const ensureDir = (path) => new Promise((resolve, reject) => {
	if (fs.existsSync(path)) resolve();
	else fs.mkdir(path, (err) => {
		if (err) reject(err);
		else resolve();
	});
});
/**
* Execute command and return stdout/stderr as a promise
*/
function execCmd(cmd, config) {
	return new Promise((resolve, reject) => {
		utils.exec(cmd, function(err, stdout, stderr) {
			debugLog(config, cmd, stdout || "", stderr || "");
			if (err) reject(err);
			else resolve({
				stdout,
				stderr: stderr.trim()
			});
		});
	});
}
/**
* Check if column's address field ends with :port
*/
function matchPort(column, port) {
	const matches = String(column[0]).match(/:(\d+)$/);
	return matches != null && matches[1] === String(port);
}
function isValidPid(pid) {
	return !isNaN(pid) && pid > 0;
}
function findPidBySs(port, config) {
	return execCmd("ss -tunlp", config).then(({ stdout, stderr }) => {
		if (stderr) logger_default.warn(stderr);
		const data = utils.stripLine(stdout, 1);
		const columns = utils.extractColumns(data, [4, 6], 7).find((column) => matchPort(column, port));
		if (columns?.[1]) {
			const pidMatch = columns[1].match(/pid=(\d+)/);
			if (pidMatch?.[1]) {
				const pid = parseInt(pidMatch[1], 10);
				if (isValidPid(pid)) return pid;
			}
		}
		throw new Error(`pid of port (${port}) not found`);
	});
}
function findPidByNetstatLinux(port, config) {
	return execCmd("netstat -tunlp", config).then(({ stdout, stderr }) => {
		if (stderr) logger_default.warn(stderr);
		const data = utils.stripLine(stdout, 2);
		const columns = utils.extractColumns(data, [3, 6], 7).find((column) => matchPort(column, port));
		if (columns?.[1]) {
			const pid = parseInt(columns[1].split("/", 1)[0], 10);
			if (isValidPid(pid)) return pid;
		}
		throw new Error(`pid of port (${port}) not found`);
	});
}
function findPidByNetstatDarwin(port, config) {
	return execCmd("netstat -anv -p TCP && netstat -anv -p UDP", config).then(({ stdout, stderr }) => {
		if (stderr) logger_default.warn(stderr);
		const table = utils.stripLine(stdout, 1);
		const headers = table.slice(0, table.indexOf("\n"));
		const body = utils.stripLine(table, 1);
		const pidColumn = headers.indexOf("rxbytes") >= 0 ? 10 : 8;
		const found = utils.extractColumns(body, [
			0,
			3,
			pidColumn
		], 10).filter((row) => {
			return !!String(row[0]).match(/^(udp|tcp)/);
		}).find((row) => {
			const matches = String(row[1]).match(/\.(\d+)$/);
			if (matches && matches[1] === String(port)) return true;
			return false;
		});
		if (found?.[2]?.length) {
			const pidCell = found[2];
			const pidMatch = pidCell.match(/:(\d+)$/);
			const pid = pidMatch?.[1] ? parseInt(pidMatch[1], 10) : parseInt(pidCell, 10);
			if (isValidPid(pid)) return pid;
		}
		throw new Error(`pid of port (${port}) not found`);
	});
}
function findPidByLsof(port, config) {
	return execCmd(`lsof -nP -i :${port}`, config).then(({ stdout, stderr }) => {
		if (stderr) logger_default.warn(stderr);
		const data = utils.stripLine(stdout, 1);
		const columns = utils.extractColumns(data, [1], 2);
		for (const col of columns) {
			const pid = parseInt(col[0], 10);
			if (isValidPid(pid)) return pid;
		}
		throw new Error(`pid of port (${port}) not found`);
	});
}
const finders$1 = {
	darwin(port, config) {
		return findPidByNetstatDarwin(port, config).catch((err) => {
			debugLog(config, `netstat failed (${err.message}), falling back to lsof`);
			return findPidByLsof(port, config);
		});
	},
	linux(port, config) {
		return findPidBySs(port, config).catch((err) => {
			debugLog(config, `ss failed (${err.message}), falling back to netstat`);
			return findPidByNetstatLinux(port, config);
		}).catch((err) => {
			debugLog(config, `netstat failed (${err.message}), falling back to lsof`);
			return findPidByLsof(port, config);
		});
	},
	win32(port, config) {
		return execCmd("netstat -ano", config).then(({ stdout, stderr }) => {
			if (stderr) throw new Error(stderr);
			const data = utils.stripLine(stdout, 4);
			const columns = utils.extractColumns(data, [
				1,
				3,
				4
			], 5).find((column) => matchPort(column, port));
			if (columns) {
				const pidStr = columns[2] !== "" ? columns[2] : columns[1];
				const pid = parseInt(pidStr, 10);
				if (isValidPid(pid)) return pid;
			}
			throw new Error(`pid of port (${port}) not found`);
		});
	},
	android(port, config) {
		return new Promise((resolve, reject) => {
			const dir = os.tmpdir() + "/.find-process";
			const file = dir + "/" + process.pid;
			const cmd = "netstat -tunp >> \"" + file + "\"";
			ensureDir(dir).then(() => {
				utils.exec(cmd, (_execErr, execStdout, execStderr) => {
					debugLog(config, cmd, execStdout || "", execStderr || "");
					fs.readFile(file, "utf8", (err, data) => {
						fs.unlink(file, () => {});
						if (err) reject(err);
						else {
							data = utils.stripLine(data, 2);
							const columns = utils.extractColumns(data, [3, 6], 7).find((column) => matchPort(column, port));
							if (columns?.[1]) {
								const pid = parseInt(columns[1].split("/", 1)[0], 10);
								if (isValidPid(pid)) resolve(pid);
								else reject(/* @__PURE__ */ new Error(`pid of port (${port}) not found`));
							} else reject(/* @__PURE__ */ new Error(`pid of port (${port}) not found`));
						}
					});
				});
			});
		});
	}
};
finders$1.freebsd = finders$1.darwin;
finders$1.sunos = finders$1.darwin;
function findPidByPort(port, config = {}) {
	const platform = process.platform;
	return new Promise((resolve, reject) => {
		const finder = finders$1[platform];
		if (!finder) return reject(/* @__PURE__ */ new Error(`platform ${platform} is unsupported`));
		finder(port, config).then(resolve, reject);
	});
}
//#endregion
//#region src/find_process.ts
function matchName(text, name) {
	if (!name) return true;
	return text.match(name) !== null;
}
function fetchBin(cmd) {
	const pieces = cmd.split(path.sep);
	const last = pieces[pieces.length - 1];
	if (last) pieces[pieces.length - 1] = last.split(" ")[0];
	const fixed = [];
	for (const part of pieces) {
		const optIdx = part.indexOf(" -");
		if (optIdx >= 0) {
			fixed.push(part.substring(0, optIdx).trim());
			break;
		} else if (part.endsWith(" ")) {
			fixed.push(part.trim());
			break;
		}
		fixed.push(part);
	}
	return fixed.join(path.sep);
}
function fetchName(fullpath) {
	if (process.platform === "darwin") {
		const idx = fullpath.indexOf(".app/");
		if (idx >= 0) return path.basename(fullpath.substring(0, idx));
	}
	return path.basename(fullpath);
}
const finders = {
	darwin(cond) {
		return new Promise((resolve, reject) => {
			let cmd;
			if ("pid" in cond && cond.pid !== void 0) cmd = `ps -p ${cond.pid} -ww -o pid,ppid,uid,gid,args`;
			else cmd = "ps ax -ww -o pid,ppid,uid,gid,args";
			if (cond.config.verbose) console.info("Query command: " + cmd);
			utils.exec(cmd, function(err, stdout, stderr) {
				debugLog(cond.config, cmd, stdout || "", stderr || "");
				if (err) {
					if ("pid" in cond && cond.pid !== void 0) resolve([]);
					else reject(err);
				} else {
					const stderrStr = stderr.trim();
					if (stderrStr) {
						reject(new Error(stderrStr));
						return;
					}
					const data = utils.stripLine(stdout, 1);
					let list = utils.extractColumns(data, [
						0,
						1,
						2,
						3,
						4
					], 5).filter((column) => {
						if (column[0] && cond.pid !== void 0) return column[0] === String(cond.pid);
						else if (column[4] && cond.name) return matchName(column[4], cond.name);
						else return !!column[0];
					}).map((column) => {
						const bin = fetchBin(String(column[4]));
						return {
							pid: parseInt(column[0], 10),
							ppid: parseInt(column[1], 10),
							uid: parseInt(column[2], 10),
							gid: parseInt(column[3], 10),
							name: fetchName(bin),
							bin,
							cmd: column[4]
						};
					});
					if (cond.config.strict && cond.name) list = list.filter((item) => item.name === cond.name);
					resolve(list);
				}
			});
		});
	},
	win32(cond) {
		return new Promise((resolve, reject) => {
			const cmd = "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-CimInstance -className win32_process | select Name,ProcessId,ParentProcessId,CommandLine,ExecutablePath";
			const lines = [];
			if (cond.config.verbose) console.info("Query command: " + cmd);
			const proc = spawn("powershell.exe", ["/c", cmd], {
				detached: false,
				windowsHide: true
			});
			proc.stdout.on("data", (data) => {
				lines.push(data.toString());
			});
			proc.on("error", (err) => {
				reject(/* @__PURE__ */ new Error("Command '" + cmd + "' failed with reason: " + err.toString()));
			});
			proc.on("close", (code) => {
				debugLog(cond.config, cmd, lines.join(""), "");
				if (code !== 0) return reject(/* @__PURE__ */ new Error("Command '" + cmd + "' terminated with code: " + code));
				resolve(utils.parseTable(lines.join("")).filter((row) => {
					if (cond.pid !== void 0) return row["ProcessId"] === String(cond.pid);
					else if (cond.name) {
						const rowName = row["Name"] || "";
						if (cond.config.strict) return rowName === cond.name || rowName.endsWith(".exe") && rowName.slice(0, -4) === cond.name;
						else return matchName(row["CommandLine"] || rowName, cond.name);
					} else return true;
				}).map((row) => ({
					pid: parseInt(row["ProcessId"], 10),
					ppid: parseInt(row["ParentProcessId"], 10),
					bin: row["ExecutablePath"],
					name: row["Name"] || "",
					cmd: row["CommandLine"]
				})));
			});
		});
	},
	android(cond) {
		return new Promise((resolve, reject) => {
			const cmd = "ps";
			if (cond.config.verbose) console.info("Query command: ps");
			utils.exec(cmd, function(err, stdout, stderr) {
				debugLog(cond.config, cmd, stdout || "", stderr || "");
				if (err) {
					if (cond.pid !== void 0) resolve([]);
					else reject(err);
				} else {
					const stderrStr = stderr.trim();
					if (stderrStr) {
						reject(new Error(stderrStr));
						return;
					}
					const data = utils.stripLine(stdout, 1);
					let list = utils.extractColumns(data, [0, 3], 4).filter((column) => {
						if (column[0] && cond.pid !== void 0) return column[0] === String(cond.pid);
						else if (column[1] && cond.name) return matchName(column[1], cond.name);
						else return !!column[0];
					}).map((column) => {
						const bin = fetchBin(String(column[1]));
						return {
							pid: parseInt(column[0], 10),
							ppid: 0,
							name: fetchName(bin),
							bin,
							cmd: column[1]
						};
					});
					if (cond.config.strict && cond.name) list = list.filter((item) => item.name === cond.name);
					resolve(list);
				}
			});
		});
	}
};
finders.linux = finders.darwin;
finders.sunos = finders.darwin;
finders.freebsd = finders.darwin;
function findProcess(cond) {
	const platform = process.platform;
	const finder = finders[platform];
	if (!finder) return Promise.reject(/* @__PURE__ */ new Error(`Platform "${platform}" is not supported`));
	return finder(cond);
}
//#endregion
//#region src/find.ts
const findBy = {
	port(port, config) {
		return findPidByPort(port, config).then((pid) => {
			return findBy.pid(pid, config);
		}, () => {
			return [];
		});
	},
	pid(pid, config) {
		return findProcess({
			pid,
			config
		});
	},
	name(name, config) {
		return findProcess({
			name,
			config
		});
	}
};
/**
* find process by condition
*
* If no process found, resolve process with empty array (only reject when error occured)
*/
function find(by, value, options) {
	const config = Object.assign({
		logLevel: "warn",
		strict: typeof options === "boolean" ? options : false
	}, typeof options === "object" ? options : {});
	if (by !== "name" || typeof value !== "string") config.strict = false;
	if (config.logLevel) logger_default.setLevel(config.logLevel);
	return new Promise((resolve, reject) => {
		if (!(by in findBy)) reject(/* @__PURE__ */ new Error(`do not support find by "${by}"`));
		else {
			const isNumber = /^\d+$/.test(String(value));
			if (by === "pid" && !isNumber) reject(/* @__PURE__ */ new Error("pid must be a number"));
			else if (by === "port" && !isNumber) reject(/* @__PURE__ */ new Error("port must be a number"));
			else findBy[by](value, config).then(resolve, reject);
		}
	});
}
//#endregion
export { find as default };
