/**
 * Data64 (aka Safe64-Data)
 * 
 * A data serialization format using URL-safe Base64 strings.
 * 
 * There are multiple profiles available as individual exported modules.
 * The only difference between the profiles is which serialization
 * formats they support. If your project is only going to use one or two 
 * formats, using a profile is an easy way to optimize your bundles.
 * Why pull in a huge external library if you're not going to use it?
 * 
 * Available Profiles:
 * 
 * - {@link module:@lumjs/safe64-data/transcoder Core}
 * - {@link module:@lumjs/safe64-data/profiles/php PHP}
 * - {@link module:@lumjs/safe64-data/profiles/bin Binary}
 * - {@link module:@lumjs/safe64-data/profiles/jso JSO[NX]}
 * - {@link module:@lumjs/safe64-data/profiles/default Default}
 * - {@link module:@lumjs/safe64-data/profiles/all Full}
 * 
 * If you import the `@lumjs/safe64-data` package without specifying a specific
 * module/profile, it re-exports the *default* profile.
 * 
 * @module module:@lumjs/safe64-data
 */
module.exports = require('./profiles/default');
