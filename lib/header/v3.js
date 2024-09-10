"use strict";

const {FORMAT,TYPE} = require('../common');

const FS = 'F';
const TS = 'T';
const FL = 1;
const TL = 1;

/**
 * Version 3 header format
 * 
 * @description
 * The version 3 header format is: `SVvvFfTt`
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
 */
module.exports =
{
  ver: 3,
  build(opts)
  {
    const {format,type} = opts;
    const full = opts.fullHeader ?? false;
    let h = '';

    if (full || format !== FORMAT.NONE)
    { // Include a format field.
      h += FS + hex(format, FL);
      if (full || (type !== TYPE.RAW && format !== FORMAT.PHP))
      { // Include a type field.
        h += TS + hex(type, TL);
      }
    }
  
    return h;
  },

  parse(state)
  {
    const {settings} = state;

    state.next(FS.length);
    if (state.get() === FS)
    { // A format tag was found.
      state.next(FL);
      settings.format = dec(state.get());

      state.next(TS.length);
      if (state.get() === TS)
      { // A type tag was found.
        state.next(TL);
        settings.type = dec(state.get());

        state.next(); // That should be it!
      }
    }
    else 
    { // No format header means no serialization.
      settings.format = FORMAT.NONE;
    }
  },

  // And the constants for reference.
  FS, FL, TS, TL,
}

// At the end for safe keeping.
const {hex,dec} = require('./index');
