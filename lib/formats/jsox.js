"use strict"

const JSOX = require('jsox');

/**
 * JSOX format plugin
 * @exports @lumjs/safe64-data/formats/jsox
 */
module.exports = 
{
  encode(s)
  {
    return JSOX.stringify(s.data, s.opts.jsonReplacer);
  },

  decode(s)
  {
    return JSOX.parse(s.decode(), s.opts.jsonReviver);
  }
}
