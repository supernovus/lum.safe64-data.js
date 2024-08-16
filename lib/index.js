"use strict";

const {S,F,notNil} = require('@lumjs/core/types');
const Base64 = require('@lumjs/encode/base64');
const C = require('./common');
const {FORMAT,TYPE} = C;
const Header = require('./header');
const Settings = require('./settings');
const State = require('./state');

const FORMATS =
{
  [FORMAT.JSON]:   () => require('./formats/json'),
  [FORMAT.PHP]:    () => require('./formats/php'),
  [FORMAT.UBJSON]: () => require('./formats/ubjson'),
  [FORMAT.JSOX]:   () => require('./formats/jsox'),
}

const DEFAULT_OPTS =
{
  format:        FORMAT.JSON,
  type:          TYPE.ARR_OBJ,
  fullHeader:    false,
  encodeStrings: false,
  url:           true,
  version:       C.VERSION,
}

/**
 * Data64 (aka Safe64-Data)
 * 
 * A data serialization format using URL-safe Base64 strings.
 *
 * The default header format is: `SVvvFfTt`
 *
 * - Uppercase letters are *literal* characters.
 * - Lowercase letters are hexidecimal integers:
 *   - `vv` = *version* (mandatory)
 *   - `f`  = *format*  (optional if `FORMAT.NONE`)
 *   - `t`  = *type*    (optional if `TYPE.RAW` or `FORMAT.PHP`)
 *
 * Examples: 
 * 
 * - `SV03F1T1` (ver = 3, format = JSON, type = ARR_OBJ)
 * - `SV03F2`   (ver = 3, format = PHP,  type = *)
 * - `SV03`     (ver = 3, format = NONE, type = RAW)
 * 
 * @exports module:@lumjs/safe64-data
 */
class Data64
{
  /**
   * Detect if a string starts with a Data64 header.
   * 
   * @param {string} str - String to test.
   * @returns {number} The Data64 version;
   * Will be `0` if no valid header was found.
   */
  static detectHeader(str)
  {
    for (const vn of C.VERSIONS)
    {
      const vs = Header.ver(vn);
      if (str.startsWith(vs))
      { // Found a header.
        return vn;
      }
    }

    // No header detected.
    return 0;
  }

  /**
   * Build a Data64 instance.
   * 
   * @param {object} [opts] Options
   * 
   * @param {number} [opts.format=JSON] Default data format.
   * 
   * See {@link module:@lumjs/safe64-data.FORMAT} for a list.
   * 
   * @param {number} [opts.type=ARR_OBJ] Default return type.
   * 
   * See {@link module:@lumjs/safe64-data.TYPE} for a list.
   * 
   * @param {boolean} [opts.fullHeader=false] Always include full header?
   * 
   * If this option is `true`, all optional header fields will always
   * be included, even if they aren't necessary.
   * 
   * @param {function} [opts.jsonReplacer] Replacer function for JSON
   * 
   * When using `FORMAT.JSON` this will be used by `encode()` when it
   * passes the data to `JSON.stringify()`.
   * 
   * @param {function} [opts.jsonReviver] Reviver function for JSON
   * 
   * When using `FORMAT.JSON` this will be used by `decode()` when it
   * passes the string to `JSON.parse()`.
   * 
   * @param {object} [opts.phpEncodeScope] Scope for `serialize()`
   * 
   * When using `FORMAT.PHP`, a map of custom `class` definitions
   * to use when `encode()` calls `serialize()`.
   * 
   * @param {object} [opts.phpDecodeScope] Scope for `unserialize()`
   * 
   * When using `FORMAT.PHP`, a map of custom `class` definitions
   * to use when `decode()` calls `unserialize()`.
   * 
   * @param {object} [opts.phpScope] Default PHP scope
   * 
   * If this is set, it will be used as the default for both the
   * `opts.phpEncodeScope` and `opts.phpDecodeScope`. It's basically
   * a quick way to set both at the same time.
   * 
   * @param {object} [opts.phpEncodeOpts] Options for `serialize()`
   * 
   * Passed by `encode()` when using `FORMAT.PHP`.
   * 
   * @param {object} [opts.phpDecodeOpts] Options for `unserialize()`
   * 
   * Passed by `decode()` when using `FORMAT.PHP`.
   * 
   * @param {object} [opts.phpOpts] Default PHP options
   * 
   * If this is set, it will be used as the default for both the
   * `opts.phpEncodeOpts` and `opts.phpDecodeOpts`. It's basically
   * a quick way to set both at the same time.
   * 
   * @param {object} [opts.ubEncoderOpts] Options for `UBJSON.encode()`
   * 
   * @param {object} [opts.ubDecoderOpts] Options for `UBJSON.decode()`
   * 
   * @param {function} [opts.jsoxReplacer] Replacer function for JSOX
   * 
   * When using `FORMAT.JSOX` this will be used by `encode()` when it
   * passes the data to `JSOX.stringify()`.
   * 
   * @param {function} [opts.jsoxReviver] Reviver function for JSOX
   * 
   * When using `FORMAT.JSOX` this will be used by `decode()` when it
   * passes the string to `JSOX.parse()`.
   * 
   * @param {boolean} [opts.encodeStrings=false] Encode `string` values?
   * 
   * Normally we assume strings are already serialized, and we simply
   * encode them with the url-safe Base64 variant.
   * 
   * If this is `true` we'll serialize `string` values with whatever
   * serialization format is selected. This is probably not useful.
   * 
   */
  constructor(opts={})
  {
    this.options = Object.assign({}, DEFAULT_OPTS, opts);
  }

  getFormat(fmt=this.options.format)
  {
    if (typeof FORMATS[fmt] === F)
    { // A plugin loader found.
      const plugin = FORMATS[fmt]();
      if (typeof plugin === F)
      { // We support instanced plugins.
        return new plugin(this);
      }
      // Or just static objects.
      return plugin;
    }
    else
    {
      throw new TypeError("Invalid plugin format: "+fmt);
    }
  }

  parseHeader(string)
  {
    const settings = new Settings(this.format, this.type);
    return Header.parse(string, settings);
  }

  getState(data, opts)
  {
    if (data instanceof State) return data;
    return new State(this, data, Object.assign({}, this.options, opts));
  }

  encodeValue(stateOrValue, extraOpts)
  { 
    const state = this.getState(stateOrValue, extraOpts);
    const header = Header.build(state.opts);
    let string;

    if (typeof state.data === S)
    { // String is the simplest.
      string = Base64.encodeText(state.data, state.opts);
    }
    else if (state.data instanceof ArrayBuffer)
    { // A bit more, but still simple.
      string = Base64.fromBytes(new Uint8Array(state.data));
      if (state.opts.url) 
      {
        string = Base64.urlize(string, state.opts);
      }
    }
    else
    { // One last fallback, grasping at straws here.
      string = state.data.toString();
      string = Base64.encodeText(string, state.opts);
    }

    return header+string;
  }

  decodeValue(stateOrValue, extraOpts)
  {
    const state = this.getState(stateOrValue, extraOpts);

    if (typeof state.data === S)
    {
      state.data = this.parseHeader(state.data);
    }
    else if (!(state.data instanceof Settings))
    {
      throw new TypeError("cannot decode: invalid state data");
    }

    if (state.opts.wantBytes)
    {
      let string = state.data.value;
      if (state.opts.url !== false)
      {
        string = Base64.deurlize(string);
      }
      return Base64.toBytes(string);
    }

    return Base64.decodeText(state.data.value, state.opts);
  }

  /**
   * Serialize and encode data into a Data64 string.
   * 
   * @param {*} data - The data to serialize and encode
   * 
   * Generally this should only be either: 
   * 
   * - An `object` in which case it'll be serialized using the current 
   *   *format*, then encoded as a Data64 string.
   * - A string, which we generally assume is already serialized data
   *   that we'll encode as a Data64 string.
   * 
   * @param {object} [extraOpts] Options
   * 
   * Anything specified here overrides the options passed to the constructor.
   * 
   * @returns {string}
   */
  encode(data, extraOpts)
  {
    const state = this.getState(data, extraOpts);

    if (state.opts.format !== FORMAT.NONE 
      && (state.opts.encodeStrings || typeof data !== S))
    {
      const rv = this.getFormat(state.opts.format).encode(state);

      if (rv)
      { // A return value was sent, update the state data.
        state.update(rv);
      }
    }

    return this.encodeValue(state);
  } // encode()

  /**
   * Decode and unserialize data from a Data64 string.
   * 
   * @param {string} string - The Data64 string to decode and unserialize
   * @param {object} [extraOpts] Options
   * 
   * Anything specified here overrides the options passed to the constructor.
   * 
   * @returns {mixed}
   */
  decode(string, extraOpts)
  {
    const settings = this.parseHeader(string);
    const state = this.getState(settings, extraOpts);

    let rv;

    if (settings.format === FORMAT.NONE || settings.type === TYPE.RAW)
    { // No serialization.
      rv = this.decodeValue(state);
    }
    else
    { // Use a format plugin.
      rv = this.getFormat(settings.format).decode(state);
    }

    if (state.opts.wantState)
    { // Return the updated State object.
      if (notNil(rv)) 
        state.update(rv);
      return state;
    }

    return rv;
  } // decode()

  /**
   * Create a new `Data64` instance, then call its `encode()` method.
   * 
   * @param {*} data - Data to pass to `instance.encode()`
   * @param {object} [opts] - Options for constructor.
   * @returns {string} The Data64 string.
   */
  static encode(data, opts={})
  {
    const s64 = new this(opts);
    return s64.encode(data);
  }

  /**
   * Create a new `Data64` instance, then call its `decode()` method.
   * 
   * @param {string} string - String to pass to `instance.decode()`
   * @param {object} [opts] - Options for constructor.
   * @returns {mixed} The decoded data.
   */
  static decode(string, opts={})
  {
    const s64 = new this(opts);
    return s64.decode(string);
  }

} // Data64 class

// Add some static class properties.
Object.assign(Data64, C, 
{
  FORMATS, Header, Settings,
});

module.exports = Data64;
