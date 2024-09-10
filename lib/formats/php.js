"use strict";

const {FORMAT} = require('../common');
const PHP = require('php-serialize');

/**
 * PHP format plugin
 * @exports @lumjs/safe64-data/formats/php
 */
module.exports = 
{
  id: FORMAT.PHP,
  
  encode(s)
  {
    const o = s.opts;
    const scope = o.phpEncodeScope ?? o.phpScope;
    const opts  = o.phpEncodeOpts  ?? o.phpOpts;  
    return PHP.serialize(s.data, scope, opts);
  },

  decode(s)
  {
    const o = s.opts;
    const scope = o.phpDecodeScope ?? o.phpScope;
    const opts  = o.phpDecodeOpts  ?? o.phpOpts;  
    return PHP.unserialize(s.decode(), scope, opts);
  }
}
