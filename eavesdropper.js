(function($) {
    // We'll wrap the "native" jQuery methods. This allows us to track all listeners as they are
    // added or removed
    var jqOn = $.fn.on,
        jqOff = $.fn.off;
    var listenersAdded = false; // flag used for preventing duplicates with $.fn.on

    // returns the first function located among the arguments; used as a rudimentary way of locating
    // the event listener.
    function getFnArgument() {
        var result;
        $.each(arguments, function(idx, arg) {
            if (typeof arg === "function") {
                result = arg;
                return false;
            }
        });
        return result;
    }

    // called when $.fn.on is "intercepted." Stores event listeners as data on elements, where the
    // data is an array of objects with `type` and `listener` properties.
    function addListener(types, selector, data, fn, /*INTERNAL*/ one) {
        var type, listeners;
        var listener = getFnArgument.apply(null, arguments);

        // This prevents listeners from being added twice when "types" is an object; jQuery's
        // native `on` is called recursively in those circumstances.
        if (listenersAdded === true) {
            return listenersAdded = false;
        }

        // `types` can be either a string or an object
        // The `if` part of the conditional is inspired by the jQuery implementation of $.fn.on
        if (typeof types === "object") {
            if (typeof selector !== "string") {
                data = data || selector;
                selector = undefined;
            }
            for (type in types) {
                addListener.call(this, type, selector, data, types[type], one);
                listenersAdded = true;
            }
        } else {
            this.data('listeners', this.data('listeners') || []);
            this.data('listeners').push({
                type: types,
                listener: listener
            });
        }
    }

    // implements a very simplistic way to stop tracking listeners that are removed with $.fn.off.
    // At the moment, it only works when `off` is called with the specific string that was used to
    // specify the event type when the listener was added.
    function removeListener(types, selector, fn) {
        var type, filteredListeners;
        var listener = getFnArgument.apply(null, arguments);

        if (this.data('listeners') && this.data('listeners').length) {
            // As with `addListener`, `types` can be either a string or an object
            if (typeof types === "object") {
                for (type in types) {
                    removeListener.call(this, type, selector, types[type]);
                }
            } else {
                filteredListeners = $.grep(this.data('listeners'), function(listener) {
                    return listener.type === types;
                }, true);
                this.data('listeners', filteredListeners);
            }
        }
    }

    // This is the method you call on a jQuery collection to get a list of all listeners set on the
    // collection, as in: $('.thatClass').eavesdrop()
    $.fn.eavesdrop = function() {
        return this.data('listeners');
    }

    // Wrappers
    $.fn.on = function(types, selector, data, fn, /*INTERNAL*/ one) {
        addListener.apply(this, arguments);
        return jqOn.apply(this, arguments);
    };
    $.fn.off = function(types, selector, fn) {
        removeListener.apply(this, arguments);
        return jqOff.apply(this, arguments);
    };
})(jQuery);
