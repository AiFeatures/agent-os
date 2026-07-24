import {
	URL as UpstreamURL,
	URLSearchParams as UpstreamURLSearchParams,
} from "whatwg-url";
import { Blob } from "./network.js";

const kBlobUrlStore = /* @__PURE__ */ Symbol.for("secureExec.blobUrlStore");
const kBlobUrlCounter = /* @__PURE__ */ Symbol.for("secureExec.blobUrlCounter");

function createNodeTypeError(message, code) {
	const error = new TypeError(message);
	error.code = code;
	return error;
}

function createMissingArgsError(message) {
	return createNodeTypeError(message, "ERR_MISSING_ARGS");
}

function getBlobUrlStore() {
	const globalRecord = globalThis;
	const existing = globalRecord[kBlobUrlStore];
	if (existing instanceof Map) {
		return existing;
	}
	const store = /* @__PURE__ */ new Map();
	globalRecord[kBlobUrlStore] = store;
	return store;
}

function nextBlobUrlId() {
	const globalRecord = globalThis;
	const nextId =
		typeof globalRecord[kBlobUrlCounter] === "number"
			? globalRecord[kBlobUrlCounter]
			: 1;
	globalRecord[kBlobUrlCounter] = nextId + 1;
	return nextId;
}

const URL2 = UpstreamURL;
const URLSearchParams = UpstreamURLSearchParams;

if (globalThis.SharedArrayBuffer?.__agentOSBootstrapStub === true) {
	delete globalThis.SharedArrayBuffer;
}

Object.defineProperties(URL2, {
	createObjectURL: {
		value(obj) {
			if (typeof Blob === "undefined" || !(obj instanceof Blob)) {
				throw createNodeTypeError(
					'The "obj" argument must be an instance of Blob. Received ' +
						(obj === null ? "null" : typeof obj),
					"ERR_INVALID_ARG_TYPE",
				);
			}
			const id = `blob:nodedata:${nextBlobUrlId()}`;
			getBlobUrlStore().set(id, obj);
			return id;
		},
		writable: true,
		configurable: true,
		enumerable: true,
	},
	revokeObjectURL: {
		value(...args) {
			if (args.length < 1) {
				throw createMissingArgsError('The "url" argument must be specified');
			}
			const [url] = args;
			if (typeof url === "string") {
				getBlobUrlStore().delete(url);
			}
		},
		writable: true,
		configurable: true,
		enumerable: true,
	},
});

function installWhatwgUrlGlobals(target = globalThis) {
	Object.defineProperty(target, "URL", {
		value: URL2,
		writable: true,
		configurable: true,
		enumerable: false,
	});
	Object.defineProperty(target, "URLSearchParams", {
		value: URLSearchParams,
		writable: true,
		configurable: true,
		enumerable: false,
	});
}

export {
	createMissingArgsError,
	createNodeTypeError,
	getBlobUrlStore,
	installWhatwgUrlGlobals,
	kBlobUrlCounter,
	kBlobUrlStore,
	nextBlobUrlId,
	URL2,
	URLSearchParams,
};
