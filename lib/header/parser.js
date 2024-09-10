"use strict";

// Simple header parser process class.
class HeaderParser
{
  constructor(string, settings, to=0)
  {
    this.string = string;
    this.settings = settings;
    this.$initTo = to;
    this.reset(to);
  }

  get()
  {
    return this.string.substring(this.fpos, this.tpos);
  }

  next(len=0)
  {
    this.fpos = this.tpos;
    this.tpos += len;
  }

  reset(to=this.$initTo)
  {
    this.fpos = 0;
    this.tpos = to;
  }
}

module.exports = HeaderParser;
