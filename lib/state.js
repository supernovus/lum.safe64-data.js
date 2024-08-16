"use strict";

const Settings = require('./settings');

/**
 * Data64 State object
 * 
 * Not meant for use outside of the package itself.
 * @alias module:@lumjs/safe64-data~State
 */
class State
{
  constructor(parent, data, opts)
  {
    this.parent = parent;
    this.data   = data;
    this.opts   = opts;
    this.old    = [];
  }

  update(newData, newLen)
  {
    this.old.push(this.data);
    if (this.data instanceof Settings)
    { // Assign it as the next Settings.
      this.data = this.data.next(newData, newLen);
    }
    else
    { // Just assign it directly.
      this.data = newData;
    }
    return this;
  }

  decode()
  {
    return this.parent.decodeValue(this);
  }
}

module.exports = State;
