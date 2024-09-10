"use strict";

const {FORMAT} = require('../common');
const Data64Core = require('../transcoder');

const JSO_FORMATS =
{
  [FORMAT.JSON]:   () => require('../formats/json'),
  [FORMAT.PHP]:    () => false,
  [FORMAT.UBJSON]: () => false,
  [FORMAT.JSOX]:   () => require('../formats/jsox'),
}

/**
 * Data64 JSO[NX] Profile
 * 
 * Supports `JSON` and `JSOX` data formats.
 * 
 * @class
 * @extends module:@lumjs/safe64-data/transcoder
 * @exports module:@lumjs/safe64-data/profiles/jso
 */
module.exports = Data64Core.createProfile(JSO_FORMATS);
