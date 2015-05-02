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

Simply download the script and include it (after jQuery, or with jQuery as a
dependency) as needed. When you want to access the event listener data for a
jQuery object, just do this:

```javascript
// This example assumes that $('.myclass').on('click', function() {}) was
// executed previously.
$('.myclass').eavesdrop(); // => { listener: function() {}, type: 'click' }
```

### Additional Examples

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
