Eavesdropper.js
===============

Eavesdropper is a simple jQuery plugin/wrapper that is useful for tracking or
otherwise identifying the event listeners that are set on a jQuery object.
Importantly, it accomplishes its goals *without* using private, unstable jQuery
methods like `$._data`. Instead, it gently wraps `$.fn.on` and `$.fn.off`,
listening in and taking note whenever an event listener is added or removed.

_NOTE:_ This is in a very early stage of development, so caution is warranted.

How to Use
----------

Simply download the script and include it (after jQuery, or with jQuery as a
dependency) as needed. When you want to access the event listener data for a
jQuery object, just:

```javascript
// This example assumes that $('.myclass').on('click', function() {}) was
// executed previously.
$('.myclass').eavesdrop(); // => { listener: function() {}, type: 'click' }
```
