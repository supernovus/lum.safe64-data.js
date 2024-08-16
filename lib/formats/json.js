"use strict";

/**
 * JSON format plugin
 * @exports @lumjs/safe64-data/formats/json
 */
module.exports = 
{
  encode(s)
  {
    return JSON.stringify(s.data, s.opts.jsonReplacer);
  },

  decode(s)
  {
    return JSON.parse(s.decode(), s.opts.jsonReviver);
  }
}
