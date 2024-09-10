"use strict";

const {N,S,F,isObj,needType} = require('@lumjs/core/types');
const {VERSION,FORMAT,TYPE}  = require('../common');
const Parser = require('./parser');

const VS = 'SV';
const VL = 2;
const VR = {}

/**
 * Data64 Header functions
 * 
 * All headers start with a version marker: `SVvv`
 * 
 * Where `SV` are those *literal* characters, and `vv` is the version
 * number as a two-digit, zero-padded, hexidecimal integer value.
 * 
 * Each header version then has its own mandatory format rules.
 * 
 * The current default format is:
 * {@link module:@lumjs/safe64-data/header.VR.03}
 * 
 * @module @lumjs/safe64-data/header
 */

/**
 * Convert a decimal number to a hexidecimal string.
 * 
 * @param {number} number 
 * @param {number} [len=1] Wanted string length.
 * @returns {string}
 * @alias module:@lumjs/safe64-data/header.hex
 */
function hex(number, len=0)
{
  needType(N, number);
  let hex = number.toString(16);
  return (len > 1 ? hex.padStart(len, '0') : hex);
}

exports.hex = hex;

/**
 * Convert a hex string to a decimal number.
 * 
 * @param {string} hex 
 * @returns {number}
 * @alias module:@lumjs/safe64-data/header.dec
 */
function dec(hex)
{
  return parseInt(hex, 16);
}

exports.dec = dec;

/**
 * Get a version header string.
 * 
 * @param {number} ver 
 * @returns {string}
 * @alias module:@lumjs/safe64-data/header.ver
 */
function hv(ver)
{
  return VS + hex(ver, VL);
}

exports.ver = hv;

/**
 * Build a Data64 header to be prepended to a string.
 * 
 * @param {object} opts
 * @param {number} opts.format 
 * @param {number} opts.type 
 * @param {number} [opts.ver=VERSION] Data64 version;
 * defaults to the newest version of the format.
 * @param {boolean} [opts.fullHeader=false] Force full header?
 * 
 * By default some portions of the header are optional
 * in certain situations. If this is `true` then all
 * components will always be added.
 * 
 * @returns {string}
 * 
 * @alias module:@lumjs/safe64-data/header.build
 */
exports.build = function(opts={})
{
  needType(N, opts.format, 'format must be a number');
  needType(N, opts.type,   'type must be a number');

  const ver = opts.version ?? VERSION;

  if (ver in VR)
  {
    let h = hv(ver);
    const a = VR[ver].build(opts);
    h += a;
    return h;
  }
  else
  {
    console.error(opts);
    throw new RangeError("Unsupported version: "+opts.version);
  }
}

/**
 * Parse a string, looking for a Data64 header.
 * 
 * @param {string} string - The string to parse.
 * @param {module:@lumjs/safe64-data~Settings} [settings] Internal use only.
 * @returns {module:@lumjs/safe64-data~Settings} Settings for the header.
 * 
 * The settings will have a version of `0` if no header was found in the string.
 * 
 * @alias module:@lumjs/safe64-data/header.parse
 */
exports.parse = function(string, settings)
{
  needType(S, string);

  if (!(settings instanceof Settings))
  {
    settings = new Settings(FORMAT.NONE, TYPE.RAW);
  }

  const parser = new Parser(string, settings, VS.length);

  if (parser.get() === VS)
  { // A version marker was found, continue parsing.
    parser.next(VL);
    settings.version = parser.get();
    const ver = settings.ver;
    if (ver in VR)
    {
      VR[ver].parse(parser);
    }
    else
    {
      console.error(parser, {ver});
      throw new RangeError("Unsupported version: "+ver); 
    }
  }

  // Okay, now set the string, and if applicable, offset.
  settings.setValue(string, parser.fpos);
  return settings;
}

function isVersionRule(v)
{
  return (isObj(v) 
    && typeof v.ver === N 
    && typeof v.build === F 
    && typeof v.parse === F);
}

function addVersions(...versions)
{
  for (const version of versions)
  {
    if (isVersionRule(version))
    {
      VR[version.ver] = version;
    }
    else
    {
      console.error({version, versions});
      throw new TypeError("Invalid version rule");
    } 
  }
}

addVersions(
  require('./v3'),
);

// Exporting for internal use.
Object.assign(exports, 
{
  VS: VS, VL, VR,
  isVersionRule,
  addVersions,
});

// The Settings object.
const Settings = require('../settings');
