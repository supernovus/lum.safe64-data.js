# lum.safe64-data.js

A pure-JS implementation of my _Safe64-Data_ serialisation format.

## Concept

It's pretty simple, it takes regular data serialisation formats (like JSON),
wraps them in a URL-safe Base64 encoded string, and adds a compact header
that tells the decoder how to decode the data.

## History

The Safe64-Data format (aka _Data64_) originated with my [Lum.php] collection,
as a set of methods in the URL helper plugin. That early implementation was
later reborn as a flexible set of classes in the [lum/lum-encode] PHP package.

A JS port was written for [Lum.js], and then spun off into [@lumjs/encode]. 
I later decided that it was too specialised for that package, and split it 
off into this package.

## Future

The biggest use for this format was to create tiny data structures that
could be used in URLs. It works fairly well for that and is great for
quick prototyping or working with data structures that may have highly
variable schemata.

In cases where there is a well-defined schema, I think using [protobufs]
serialised into URL-safe Base64 is likely a better option, and is what
I think I'll end up moving to for many of my uses. Even when a schema-less
design is desired, I think there are also cases where app-specific formats
make more sense than a _"one-size-fits-all"_ approach.

So while I am not _retiring_ this package (or the data format itself)
at this point, I think it's safe to say that no further features are planned.
Any updates in the future will likely just be for bug fixes.

I'm also planning to split the PHP implementation into its own package,
and updating it with many of the enhancements and architectural changes
that this JS package has introduced (particularly in its 2.0 release).

## Official URLs

This library can be found in two places:

 * [Github](https://github.com/supernovus/lum.safe64-data.js)
 * [NPM](https://www.npmjs.com/package/@lumjs/safe64-data)

## Author

Timothy Totten <2010@totten.ca>

## License

[MIT](https://spdx.org/licenses/MIT.html)

---

[lum/lum-encode]: https://github.com/supernovus/lum.encode.php
[@lumjs/encode]: https://github.com/supernovus/lum.encode.js
[Lum.php]: https://github.com/supernovus/nano.php/blob/nano5/lib/nano/plugins/url.php
[Lum.js]: https://github.com/supernovus/lum.js/blob/v4/src/js/encode.js
[protobufs]: https://github.com/protobufjs/protobuf.js
