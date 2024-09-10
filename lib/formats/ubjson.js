"use strict";

const {FORMAT} = require('../common');
const UB = require('@shelacek/ubjson');

/**
 * UBJSON format plugin
 * @exports @lumjs/safe64-data/formats/ubjson
 */
module.exports = 
{
  id: FORMAT.UBJSON,
  
  encode(s)
  {
    return UB.encode(s.data, s.opts.ubEncoderOpts);
  },

  decode(s)
  {
    s.opts.wantBytes = true;
    const byteArray = s.decode();
    return UB.decode(byteArray.buffer, s.opts.ubDecoderOpts);
  }
}
