import {
	TextDecoder as UpstreamTextDecoder,
	TextDecoderStream as UpstreamTextDecoderStream,
	TextEncoder as UpstreamTextEncoder,
	TextEncoderStream as UpstreamTextEncoderStream,
} from "@exodus/bytes/encoding-lite.js";

function withCode(error, code) {
	error.code = code;
	return error;
}

function createEncodingNotSupportedError(label) {
	return withCode(
		new RangeError(`The "${label}" encoding is not supported`),
		"ERR_ENCODING_NOT_SUPPORTED",
	);
}

function createEncodingInvalidDataError(encoding) {
	return withCode(
		new TypeError(`The encoded data was not valid for encoding ${encoding}`),
		"ERR_ENCODING_INVALID_ENCODED_DATA",
	);
}

function createInvalidDecodeInputError() {
	return withCode(
		new TypeError(
			'The "input" argument must be an instance of ArrayBuffer, SharedArrayBuffer, or ArrayBufferView.',
		),
		"ERR_INVALID_ARG_TYPE",
	);
}

function trimAsciiWhitespace(value) {
	return value.replace(/^[\t\n\f\r ]+|[\t\n\f\r ]+$/g, "");
}

function normalizeEncodingLabel(label) {
	const normalized = trimAsciiWhitespace(
		label === void 0 ? "utf-8" : String(label),
	).toLowerCase();
	switch (normalized) {
		case "utf-8":
		case "utf8":
		case "unicode-1-1-utf-8":
		case "unicode11utf8":
		case "unicode20utf8":
		case "x-unicode20utf8":
			return "utf-8";
		case "utf-16":
		case "utf-16le":
		case "ucs-2":
		case "ucs2":
		case "csunicode":
		case "iso-10646-ucs-2":
		case "unicode":
		case "unicodefeff":
			return "utf-16le";
		case "utf-16be":
		case "unicodefffe":
			return "utf-16be";
		default:
			throw createEncodingNotSupportedError(normalized);
	}
}

function toUint8Array(input) {
	if (input === void 0) {
		return new Uint8Array(0);
	}
	if (ArrayBuffer.isView(input)) {
		return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
	}
	if (input instanceof ArrayBuffer) {
		return new Uint8Array(input);
	}
	if (
		typeof SharedArrayBuffer !== "undefined" &&
		input instanceof SharedArrayBuffer
	) {
		return new Uint8Array(input);
	}
	throw createInvalidDecodeInputError();
}

class PatchedTextEncoder extends UpstreamTextEncoder {}

class PatchedTextDecoder extends UpstreamTextDecoder {
	constructor(label, options) {
		super(
			normalizeEncodingLabel(label),
			options == null ? {} : Object(options),
		);
	}

	decode(input, options) {
		const source = toUint8Array(input);
		const decodeOptions = options == null ? {} : Object(options);
		try {
			return super.decode(source, decodeOptions);
		} catch (error) {
			if (this.fatal && error instanceof TypeError) {
				throw createEncodingInvalidDataError(this.encoding);
			}
			throw error;
		}
	}
}

Object.defineProperty(PatchedTextEncoder, "name", {
	configurable: true,
	value: "TextEncoder",
});
Object.defineProperty(PatchedTextDecoder, "name", {
	configurable: true,
	value: "TextDecoder",
});

var TextEncoder2 = PatchedTextEncoder;
var TextDecoder = PatchedTextDecoder;
var TextEncoderStream = UpstreamTextEncoderStream;
var TextDecoderStream = UpstreamTextDecoderStream;

export {
	withCode,
	createEncodingNotSupportedError,
	createEncodingInvalidDataError,
	createInvalidDecodeInputError,
	trimAsciiWhitespace,
	normalizeEncodingLabel,
	toUint8Array,
	PatchedTextEncoder,
	PatchedTextDecoder,
	TextEncoder2,
	TextDecoder,
	TextEncoderStream,
	TextDecoderStream,
};
