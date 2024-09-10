"use strict";

const plan = 8;

const t = require('@lumjs/tests').new({module, plan});

const {profile,UBJ,PHP,JSX} = require('./inc/common');
const d = require('./inc/basics');
const lib = profile.all;

t.is(lib.encode(d.o1), d.o1_json, 'encodeData(obj)');
t.is(lib.encode(d.o1, {format: UBJ}), d.o1_ubj, 'encodeData(:format<UBJSON>)');
t.is(lib.encode(d.o1, {format: PHP}), d.o1_php, 'encodeData(:format<PHP>)');
t.is(lib.encode(d.o1, {format: JSX}), d.o1_jsox, 'encodeData(:format<JSOX>)');

t.isJSON(lib.decode(d.o1_json), d.o1, 'decode(s64json)');
t.isJSON(lib.decode(d.o1_ubj), d.o1, 'decode(s64ubjson)');
t.isJSON(lib.decode(d.o1_php), d.o1, 'decode(s64php)');
t.isJSON(lib.decode(d.o1_jsox), d.o1, 'decode(s64jsox)');

t.done();
