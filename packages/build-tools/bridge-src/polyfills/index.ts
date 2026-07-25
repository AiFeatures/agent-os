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
if (typeof globalThis.RegExp === "function" && !("__secureExecRgiEmojiCompat" in globalThis.RegExp)) {
  const NativeRegExp = globalThis.RegExp;
  const rgiEmojiPattern = "^\\p{RGI_Emoji}$";
  const rgiEmojiBaseClass = "[\\u{00A9}\\u{00AE}\\u{203C}\\u{2049}\\u{2122}\\u{2139}\\u{2194}-\\u{21AA}\\u{231A}-\\u{23FF}\\u{24C2}\\u{25AA}-\\u{27BF}\\u{2934}-\\u{2935}\\u{2B05}-\\u{2B55}\\u{3030}\\u{303D}\\u{3297}\\u{3299}\\u{1F000}-\\u{1FAFF}]";
  const rgiEmojiKeycap = "[#*0-9]\\uFE0F?\\u20E3";
  const rgiEmojiFallbackSource = "^(?:" + rgiEmojiKeycap + "|\\p{Regional_Indicator}{2}|" + rgiEmojiBaseClass + "(?:\\uFE0F|\\u200D(?:" + rgiEmojiKeycap + "|" + rgiEmojiBaseClass + ")|[\\u{1F3FB}-\\u{1F3FF}])*)$";
  try {
    new NativeRegExp(rgiEmojiPattern, "v");
  } catch (error) {
    if (String(error?.message ?? error).includes("RGI_Emoji")) {
      const CompatRegExp = function CompatRegExp2(pattern, flags) {
        const normalizedPattern = pattern instanceof NativeRegExp && flags === void 0 ? pattern.source : String(pattern);
        const normalizedFlags = flags === void 0 ? pattern instanceof NativeRegExp ? pattern.flags : "" : String(flags);
        try {
          return new NativeRegExp(pattern, flags);
        } catch (innerError) {
          if (normalizedPattern === rgiEmojiPattern && normalizedFlags === "v") {
            return new NativeRegExp(rgiEmojiFallbackSource, "u");
          }
          throw innerError;
        }
      };
      Object.setPrototypeOf(CompatRegExp, NativeRegExp);
      CompatRegExp.prototype = NativeRegExp.prototype;
      Object.defineProperty(CompatRegExp.prototype, "constructor", {
        value: CompatRegExp,
        writable: true,
        configurable: true
      });
      defineGlobal(
        "RegExp",
        Object.assign(CompatRegExp, { __secureExecRgiEmojiCompat: true })
      );
    }
  }
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
