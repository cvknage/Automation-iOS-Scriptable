// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: vial;

eval(FileManager.local().readString('/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/lib/require.js'));

/*
 * (PROBLEMATIC)
 *
 * The ical lib declares 'ICAL' directly on the global scope (and I can't stop it from inside require.js), 
 * hence renaming 'ICAL' to ex. 'ical' will not work.
 * 
 * Also 'ICAL' needs to be declared as a 'var'.
 * Basicaly it isn't needed to declare 'ICAL' at all, because as mentioned it's put on the global scope.
 * 
 * Just try switching the two requires below.
 */
var ICAL = require('ical');
// require('ical');
log(ICAL.foldLength ? 'ICAL; was loaded corectly' : 'Failed to load: ICAL');

/*
 * (OK)
 *
 * lodash imports as expected.
 */
let _ = require('lodash');
log(_.isArray(['a']) ? 'lodash; was loaded corectly' : 'Failed to load: lodash');
