Eavesdropper.js
===============

Eavesdropper is a simple jQuery plugin/wrapper that is useful for tracking or
otherwise identifying the event listeners that are set on a jQuery object.
Importantly, it accomplishes its goals *without* using private, unstable jQuery
methods like `$._data`. Instead, it gently wraps `$.fn.on` and `$.fn.off`,
listening in and taking note whenever an event listener is added or removed.

_NOTE:_ This is in a very early stage of development, so some caution is warranted.

How to Use
----------

### In the Browser (the Typical Use Case)

Simply download the script and include it (after jQuery, or with jQuery as a
dependency) as needed. When you want to access the event listener data for a
jQuery object, just do this:

```javascript
// This example assumes that $('.myclass').on('click', function() {}) was
// executed previously.
$('.myclass').eavesdrop(); // => { listener: function() {}, type: 'click' }
```

Since Eavesdropper currently uses the jQuery built-in `$.fn.data` method to
store event listener information, you can also forego the use of `.eavesdrop`
and instead simply access `$('.myclass').data('listeners')`.

### In Node.js

Eavesdropper can be used in Node.js; it is set up so that you can simply:

```javascript
var whatever = require('path/to/eavesdropper');
```

Note the odd use of "whatever" as the variable name. Since Eavesdropper wraps
jQuery's native methods by modifying jQuery's prototype, you do not actually
need to store the result of requiring Eavesdropper, so long as you have a
reference to jQuery itself (and you should -- Eavesdropper *requires* jQuery).
Eavesdropper's functionality will be available on jQuery objects.

Another thing worth noting is that jQuery itself will not function in Node.js
without a `window` object available, such as one supplied by `jsdom`. Since
Eavesdropper requires jQuery functionality, it also will not function without
such an object.

### A Few Additional Usage Examples

The examples that follow assume that `var div = $('div')`.

```javascript
div.on({
    'clicker': function() { console.log('Clicker!'); },
    'click.button.one': function() { console.log('Click button one!'); },
    'click.button.two': function() { console.log('Click button two!'); },
    'click': function() { console.log('...click.'); }
});
div.eavesdrop(); // => [{type: "clicker", listener: function() { console.log('Clicker!'); }}, ...]

div.off('     click.button    clicker'); // extra spacing just to show that eavesdropper deals with it
div.eavesdrop(); // => [{type: "click", listener: function() { console.log('...click.'); }}]
```

Building, Testing, and Automating
---------------------------------

Eavesdropper currently uses Mocha for testing and Chai for expect-style
assertions. For building and automation, it uses Gulp. If you download
`package.json` and run `npm install`, you will get all of the tools you
need. Assuming that you also download `gulpfile.js`, you can run
`gulp make-dist` to build a minified version of Eavesdropper (also
available here, under `dist`), `gulp do-test` to run the tests, or, to do both
at once, `gulp build`.

Simply running `gulp` will start a "watcher" task that should automatically
rebuild and test whenever you make changes to any `.js` files under `src` or
`test`.

