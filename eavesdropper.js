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
        var type, splitTypes, listeners;
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
        } else if (this.length && typeof types === "string") {
            splitTypes = types.trim().split(/\s+/g); //handles multiple whitespace-delimited types
            this.data('listeners', this.data('listeners') || []);

            $.each(splitTypes, function(idx, type) {
                this.data('listeners').push({
                    type: type,
                    listener: listener
                });
            }.bind(this));
        }
    }

    // implements a farily simple way to stop tracking listeners that are removed with $.fn.off.
    function removeListener(types, selector, fn) {
        var type, splitTypes, filteredListeners;
        if (arguments.length === 0) return this.data('listeners', []);

        // A utility function for checking for matches between types even when there are a number
        // of namespaces involved. Used below.
        function isMatch(type, listener) {
            var doesMatch = true;
            var nsTypes = $.grep(type.split('.'), function(nsType) {
                return nsType.length > 0; // ignore empty strings
            });
            var nsListenerTypes = $.grep(listener.type.split('.'), function(nsListenerType) {
                return nsListenerType.length > 0;
            });
            var nsTypesLen = nsTypes.length;

            // The removed listener cannot be this specific listener if the removed type
            // has more namespaces than the listener's type
            if (nsTypesLen > nsListenerTypes.length) {
                return false;
            }

            // Iterate through the namespaces in the removed type of event, comparing them
            // to those in the current stored listener's type. If there is a failure to
            // match, break the loop -- we know there's not a match. On the other hand,
            // if we make it all the way through this loop, everything matches.
            $.each(nsTypes, function(idx, nsType) {
                doesMatch = nsType === nsListenerTypes[idx];
                return doesMatch;
            });

            return doesMatch;
        }

        if (this.data('listeners') && this.data('listeners').length) {
            // As with `addListener`, `types` can be either a string or an object
            if (typeof types === "object") {
                for (type in types) {
                    removeListener.call(this, type, selector, types[type]);
                }
            } else {
                splitTypes = types.trim().split(/\s+/g); //handles multiple whitespace-delimited types
                $.each(splitTypes, function(idx, type) {
                    // filter out the stored types that match the removed type
                    this.data('listeners', $.grep(this.data('listeners'), function(listener) {
                        return isMatch(type, listener);
                    }, true));
                }.bind(this));
            }
        }
    }

    // This is the method you call on a jQuery collection to get a list of all listeners set on the
    // collection, as in: $('.thatClass').eavesdrop()
    $.fn.eavesdrop = function() {
        return this.data('listeners') || [];
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
