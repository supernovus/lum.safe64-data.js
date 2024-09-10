"use strict";

const LIB = '../../lib/';
const PROF = LIB+'profiles/';
const {FORMAT} = require(LIB+'common');

exports = module.exports =
{
  JSN: FORMAT.JSON,
  UBJ: FORMAT.UBJSON,
  PHP: FORMAT.PHP,
  JSX: FORMAT.JSOX,
  profile:
  {
    core: require(LIB+'transcoder'),
    all: require(PROF+'all'),
    php: require(PROF+'php'),
    bin: require(PROF+'bin'),
    jso: require(PROF+'jso'),
    default: require(PROF+'default'),
  },
}

exports.profile.full = exports.profile.all;
