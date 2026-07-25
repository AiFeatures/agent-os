"use strict";

import {
	ReadableStream as WebReadableStream,
	WritableStream as WebWritableStream,
	TransformStream as WebTransformStream,
} from "web-streams-polyfill";
import {
	TextDecoderStream as WebTextDecoderStream,
	TextEncoderStream as WebTextEncoderStream,
} from "agentos-text-encoding-polyfill";

if (typeof globalThis.ReadableStream === "undefined") {
	globalThis.ReadableStream = WebReadableStream;
}
if (typeof globalThis.WritableStream === "undefined") {
	globalThis.WritableStream = WebWritableStream;
}
if (typeof globalThis.TransformStream === "undefined") {
	globalThis.TransformStream = WebTransformStream;
}
if (typeof globalThis.TextEncoderStream === "undefined") {
	globalThis.TextEncoderStream = WebTextEncoderStream;
}
if (typeof globalThis.TextDecoderStream === "undefined") {
	globalThis.TextDecoderStream = WebTextDecoderStream;
}

export {
	WebReadableStream,
	WebWritableStream,
	WebTransformStream,
	WebTextEncoderStream,
	WebTextDecoderStream,
};
