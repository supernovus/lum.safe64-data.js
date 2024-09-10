"use strict";

const {FORMAT} = require('../common');
const Data64Core = require('../transcoder');

const BIN_FORMATS =
{
  [FORMAT.JSON]:   () => require('../formats/json'),
  [FORMAT.PHP]:    () => false,
  [FORMAT.UBJSON]: () => require('../formats/ubjson'),
  [FORMAT.JSOX]:   () => false,
}

/**
 * Data64 Binary Profile
 * 
 * Supports `JSON` and `UBJSON` data formats.
 * 
 * @class
 * @extends module:@lumjs/safe64-data/transcoder
 * @exports module:@lumjs/safe64-data/profiles/bin
 */
module.exports = Data64Core.createProfile(BIN_FORMATS);
