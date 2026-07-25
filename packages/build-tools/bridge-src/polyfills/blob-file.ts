import { Blob as UpstreamBlob } from "fetch-blob";
import { File as UpstreamFile } from "fetch-blob/file.js";

function normalizeBlobOptions(options) {
	if (options == null || options.type === void 0) {
		return options;
	}
	const type = String(options.type);
	return {
		...Object(options),
		type: /^[\x20-\x7e]*$/.test(type) ? type.toLowerCase() : "",
	};
}

class Blob extends UpstreamBlob {
	constructor(parts, options) {
		super(parts, normalizeBlobOptions(options));
	}
}

Object.setPrototypeOf(UpstreamFile.prototype, Blob.prototype);

class File extends UpstreamFile {
	constructor(parts, name, options) {
		super(parts, name, normalizeBlobOptions(options));
	}
}

export { Blob, File, normalizeBlobOptions };
