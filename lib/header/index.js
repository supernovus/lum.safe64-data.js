"use strict";

const {N,S,isObj,needType,def} = require('@lumjs/core/types');
const {VERSION,FORMAT,TYPE} = require('../common');

const V = 'SV';
const F = 'F';
const T = 'T';

const VL = 2;
const FL = 1;
const TL = 1;

/**
 * Data64 Header functions
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
  return V + hex(ver, VL);
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
  needType(N, opts.type, 'type must be a number');

  const {format,type} = opts;
  const full = opts.fullHeader ?? false;

  let h = hv(opts.version ?? VERSION);

  if (full || format !== FORMAT.NONE)
  { // Include a format field.
    h += F + hex(format, FL);
    if (full || (type !== TYPE.RAW && format !== FORMAT.PHP))
    { // Include a type field.
      h += T + hex(type, TL);
    }
  }

  return h;
}

/**
 * Parse a string, looking for a Data64 header.
 * 
 * @param {string} str - The string to parse.
 * @param {module:@lumjs/safe64-data~Settings} [settings] Internal use only.
 * @returns {module:@lumjs/safe64-data~Settings} Settings for the header.
 * 
 * The settings will have a version of `0` if no header was found in the string.
 * 
 * @alias module:@lumjs/safe64-data/header.parse
 */
exports.parse = function(str, settings)
{
  needType(S, str);

  if (!isObj(settings))
  {
    settings = new Settings(FORMAT.NONE, TYPE.RAW);
  }

  let a = 0;
  let b = V.length;

  if (str.substring(a, b) === V)
  { // A version marker was found, continue parsing.
    a = b;
    b = a + VL;
    settings.version = str.substring(a, b);

    a = b;
    b = a + F.length;
    if (str.substring(a, b) === F)
    { // A format tag was found.
      a = b;
      b = a + FL;
      settings.format = dec(str.substring(a, b));

      a = b;
      b = a + T.length;
      if (str.substring(a, b) === T)
      { // A type tag was found.
        a = b;
        b = a + TL;
        settings.type = dec(str.substring(a, b));
        a = b;
      }
    }
    else 
    { // No format header means no serialization.
      settings.format = FORMAT.NONE;
    }
  }

  // Okay, now set the string, and if applicable, offset.
  settings.setValue(str, a);

  return settings;
}

// Exporting for internal use.
def(exports, 'VS', V);
def(exports, 'VL', VL);

// The Settings object.
const Settings = require('../settings');
