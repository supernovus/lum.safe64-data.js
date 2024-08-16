"use strict";

const Enum = require('@lumjs/core/enum');

/**
 * Supported Safe64 format versions, in newest-to-oldest order.
 * @alias module:@lumjs/safe64-data.VERSIONS 
 */
exports.VERSIONS = [3];

/**
 * Current Safe64 format version (alias to `VERSIONS[0]`)
 * @alias module:@lumjs/safe64-data.VERSIONS
 */
exports.VERSION = exports.VERSIONS[0]

/**
 * An `Enum` of serialization formats.
 * 
 * | Enum Name | Val | Description                                                   | 
 * | --------- | --- | ------------------------------------------------------------- | 
 * | `NONE`    | `0` | No data serialization.                                        |
 * | `JSON`    | `1` | Serialize with `JSON`. The **default** format.                |
 * | `PHP`     | `2` | PHP `serialize()` format. Can store object class information. |
 * | `UBJSON`  | `3` | A binary JSON-like serialization format.                      |
 * | `JSOX`    | `4` | JSOX is for JS what serialize is to PHP. *Currently JS-only!* |
 * 
 * @alias module:@lumjs/safe64-data.FORMAT
 */
exports.FORMAT = Enum(['NONE','JSON','PHP','UBJSON','JSOX']);

/**
 * An `Enum` of serialization return types.
 * 
 * | Enum Name | Val | Description                                     | 
 * | --------- | --- | ----------------------------------------------- |
 * | `RAW`     | `0` | Return the raw string/buffer value.             | 
 * | `ARR_OBJ` | `1` | In PHP, use an *associative array* for objects. |
 * | `STD_OBJ` | `2` | In PHP, use a *StdClass* instance for objects.  |
 * 
 * In this Javascript implementation, the `ARR_OBJ` and `STD_OBJ` formats
 * are treated exactly the same. The differenciation only matters in the
 * **PHP** implementation of Safe64.
 * 
 * If the `FORMAT` is `NONE` or `PHP`, the `TYPE` is ignored entirely.
 * 
 * @alias module:@lumjs/safe64-data.TYPE
 */
 exports.TYPE = Enum(['RAW', 'ARR_OBJ', 'STD_OBJ']);
