"use strict";

const {FORMAT} = require('../common');
const Data64Core = require('../transcoder');

const PHP_FORMATS =
{
  [FORMAT.JSON]:   () => require('../formats/json'),
  [FORMAT.PHP]:    () => require('../formats/php'),
  [FORMAT.UBJSON]: () => false,
  [FORMAT.JSOX]:   () => false,
}

/**
 * Data64 PHP Profile
 * 
 * Supports `JSON` and `PHP` data formats.
 * 
 * @class
 * @extends module:@lumjs/safe64-data/transcoder
 * @exports module:@lumjs/safe64-data/profiles/php
 */
module.exports = Data64Core.createProfile(PHP_FORMATS);
