"use strict";

const {S,N,needType} = require('@lumjs/core/types');

/**
 * Safe64 Encoding Settings object
 * 
 * Not meant for use outside of the package itself.
 * @alias module:@lumjs/encode/safe64~Settings
 */
class Settings
{
  constructor(format, type, prev)
  {
    this.format = format;
    this.type   = type;
    this.prev   = prev;

    this.$version = 0;
    this.$offset  = 0;
    this.$value   = '';
  }

  next(newValue, newLen=0)
  {
    const newSettings = new Settings(this.format, this.type, this);
    newSettings.setValue(newValue, newLen);
    return newSettings;
  }

  get value()
  {
    if (this.$offset === 0)
    {
      return this.$value;
    }
    else
    {
      return this.$value.substring(this.$offset);
    }
  }

  setValue(value, offset)
  {
    needType(N, offset);
    if (offset > 0)
    { // If an offset was specified, the value must be a string.
      needType(S, value);
    }
    this.$value = value;
    this.$offset = offset;
  }

  set value(value)
  {
    this.setValue(value, 0);
  }

  set version(ver)
  {
    if (typeof ver === S)
    {
      ver = Header.dec(ver);
    }
    else if (typeof ver !== N)
    {
      throw new TypeError("version must be a hex string or a decimal number");
    }

    if (ver < 0) throw new RangeError("version cannot be lower than 0");
    if (ver > 255) throw new RangeError("version cannot be higher than 255");

    this.$version = ver;
  }

  get version()
  {
    return Header.hex(this.$version, Header.VL);
  }

  makeHeader(full=false)
  {
    return Header.build(this.format, this.type, this.$version, full);
  }

  get header()
  {
    if (this.$value == '' || this.$offset == 0)
    {
      return this.makeHeader();
    }
    else 
    {
      return this.$value.substring(0, this.$offset);
    }
  }

}

module.exports = Settings;

// Require Header after exporting Settings.
const Header = require('./header');
