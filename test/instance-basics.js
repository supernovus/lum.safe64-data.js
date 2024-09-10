"use strict";

const plan = 8;

const t = require('@lumjs/tests').new({module, plan});

const {profile,UBJ,PHP,JSX,JSN} = require('./inc/common');
const d = require('./inc/basics');

const i = new profile.all({format: UBJ});

t.is(i.encode(d.o1), d.o1_ubj, 'encodeData(obj)');
t.is(i.encode(d.o1, {format: JSN}), d.o1_json, 'encodeData(:format<JSON>)');
t.is(i.encode(d.o1, {format: PHP}), d.o1_php, 'encodeData(:format<PHP>)');
t.is(i.encode(d.o1, {format: JSX}), d.o1_jsox, 'encodeData(:format<JSOX>)');

t.isJSON(i.decode(d.o1_json), d.o1, 'decode(s64json)');
t.isJSON(i.decode(d.o1_ubj), d.o1, 'decode(s64ubjson)');
t.isJSON(i.decode(d.o1_php), d.o1, 'decode(s64php)');
t.isJSON(i.decode(d.o1_jsox), d.o1, 'decode(s64jsox)');

t.done();
