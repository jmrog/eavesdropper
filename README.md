Eavesdropper.js
===============

Eavesdropper is a simple [jQuery](https://github.com/jquery/jquery)
plugin/wrapper that is useful for tracking or otherwise identifying the event
listeners that are set on a jQuery object. Importantly, it accomplishes its
goals *without* using private, unstable, soon-to-be-deprecated jQuery methods
like `$._data`. Instead, it gently wraps `$.fn.on` and `$.fn.off`, listening
in and taking note whenever an event listener is added or removed.

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

**However**, it is important to recognize that Eavesdropper wraps jQuery's
`$.fn.on` and `$.fn.off` methods. For that reason, you cannot require
Eavesdropper unless you have required jQuery first (it will throw an error if
you try). Additionally, jQuery's `$.fn.on` and `$.fn.off` methods will not be
accessible in Node unless you provide jQuery with a window object, such as one
supplied by [jsdom](https://github.com/tmpvar/jsdom). Thus, Eavesdropper will
also complain if you require *only* jQuery and do not provide jQuery with a
window object. In practical terms, this means that using Eavesdropper in Node
typically involves a workflow along these lines:

```javascript
var jsdom = require('jsdom').jsdom;
var $ = require('jquery')(jsdom().parentWindow);
var whatever = require('path/to/eavesdropper');
```

As one last point of discusssion, note the odd use of "whatever" as a variable
name in the above examples. Since Eavesdropper wraps jQuery's native methods by
modifying jQuery's prototype, you do not actually need to store the result of
requiring Eavesdropper once you have required jQuery. Eavesdropper's
functionality will be available on the jQuery object itself (i.e., on `$`). So,
after requiring jQuery, you can simply `require('path/to/eavesdropper')`,
without storing the result anywhere.

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

Eavesdropper currently uses [Mocha](https://github.com/mochajs/mocha) for
testing and [Chai](https://github.com/chaijs/chai) for expect-style
assertions. For building and automation, it uses
[Gulp](https://github.com/gulpjs/gulp). If you download `package.json` and run
`npm install`, you will get all of the tools you need. Assuming that you also
download `gulpfile.js`, you can run `gulp make-dist` to build a minified version
of Eavesdropper (also available here, under `dist`), `gulp do-test` to run the
tests, or, to do both at once, `gulp build`.

Simply running `gulp` will start a "watcher" task that should automatically
rebuild and test whenever you make changes to any `.js` files under `src` or
`test`.

