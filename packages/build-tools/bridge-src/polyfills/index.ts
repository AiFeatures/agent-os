import { WebReadableStream, WebTextDecoderStream, WebTextEncoderStream, WebTransformStream, WebWritableStream, sandboxStructuredClone, undiciWebidlModule } from "../prelude.js";
import { TextDecoder, TextEncoder2 } from "./text-encoding.js";

const Event = globalThis.Event;
const CustomEvent = globalThis.CustomEvent;
const EventTarget = globalThis.EventTarget;
const AbortSignal = globalThis.AbortSignal;
const AbortController = globalThis.AbortController;

function defineGlobal(name, value) {
  globalThis[name] = value;
}
if (typeof globalThis.global === "undefined") {
  defineGlobal("global", globalThis);
}
defineGlobal("TextEncoder", TextEncoder2);
defineGlobal("TextDecoder", TextDecoder);
defineGlobal("Event", Event);
defineGlobal("CustomEvent", CustomEvent);
defineGlobal("EventTarget", EventTarget);
defineGlobal("AbortSignal", AbortSignal);
defineGlobal("AbortController", AbortController);
defineGlobal("structuredClone", sandboxStructuredClone);
if (
  globalThis.WebAssembly &&
  typeof globalThis.WebAssembly.instantiateStreaming !== "function"
) {
  globalThis.WebAssembly.instantiateStreaming = async function instantiateStreaming(source, imports) {
    const response = await source;
    if (response == null || typeof response.arrayBuffer !== "function") {
      throw new TypeError("WebAssembly.instantiateStreaming requires a Response or promise for one");
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    return globalThis.WebAssembly.instantiate(bytes, imports);
  };
}
defineGlobal("ReadableStream", WebReadableStream);
defineGlobal("WritableStream", WebWritableStream);
defineGlobal("TransformStream", WebTransformStream);
if (typeof WebTextEncoderStream === "function") {
  defineGlobal("TextEncoderStream", WebTextEncoderStream);
}
if (typeof WebTextDecoderStream === "function") {
  defineGlobal("TextDecoderStream", WebTextDecoderStream);
}
const undiciWebidl = undiciWebidlModule?.webidl ?? undiciWebidlModule;

export { defineGlobal, TextEncoder2, TextDecoder, Event, CustomEvent, EventTarget, AbortSignal, AbortController, undiciWebidl };
export { withCode, createEncodingNotSupportedError, createEncodingInvalidDataError, createInvalidDecodeInputError, trimAsciiWhitespace, normalizeEncodingLabel, toUint8Array, PatchedTextEncoder, PatchedTextDecoder } from "./text-encoding.js";
