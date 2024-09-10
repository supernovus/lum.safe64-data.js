"use strict";

const {FORMAT} = require('../common');
const Data64Core = require('../transcoder');

const DEF_FORMATS =
{
  [FORMAT.JSON]:   () => require('../formats/json'),
  [FORMAT.PHP]:    () => require('../formats/php'),
  [FORMAT.UBJSON]: () => require('../formats/ubjson'),
  [FORMAT.JSOX]:   () => false,
}

/**
 * Data64 Default Profile
 * 
 * Supports the data formats from the PHP implementation:
 * `JSON`, `PHP`, `UBJSON`.
 * 
 * @class
 * @extends module:@lumjs/safe64-data/transcoder
 * @exports module:@lumjs/safe64-data/profiles/default
 */
module.exports = Data64Core.createProfile(DEF_FORMATS);
