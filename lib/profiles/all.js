"use strict";

const {FORMAT} = require('../common');
const Data64Core = require('../transcoder');

const ALL_FORMATS =
{
  [FORMAT.JSON]:   () => require('../formats/json'),
  [FORMAT.PHP]:    () => require('../formats/php'),
  [FORMAT.UBJSON]: () => require('../formats/ubjson'),
  [FORMAT.JSOX]:   () => require('../formats/jsox'),
}

/**
 * Data64 Full Profile
 * 
 * Supports all of the data formats:
 * `JSON`, `PHP`, `UBJSON`, `JSOX`.
 * 
 * An alias export named `@lumjs/safe64-data/profiles/full`
 * also points to this module.
 * 
 * @class
 * @extends module:@lumjs/safe64-data/transcoder
 * @exports module:@lumjs/safe64-data/profiles/all
 */
module.exports = Data64Core.createProfile(ALL_FORMATS);
