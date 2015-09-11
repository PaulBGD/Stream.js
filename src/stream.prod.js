(function (global) {
    /**
     * A unique variable, used to check if an item should be skipped
     * @type {{}}
     */
    var SKIP = {};

    /**
     * Creates a new Stream.
     *
     * @param array the array to stream
     * @constructor
     */
    function Stream(array, transformers, afterTransformers) {
        this.array = array;
        this.transformers = transformers || [];
        this.afterTransformers = afterTransformers || [];
    }

    var prototype = Stream.prototype;

    /**
     * Turns this stream back into an array.
     *
     * @returns {Array}
     */
    prototype['toArray'] = function () {
        var array = [];
        for (var i = 0, max = this.array.length; i < max; i++) {
            var element = this.array[i];
            for (var j = 0, jMax = this.transformers.length; j < jMax; j++) {
                element = this.transformers[j](element);
                if (element == SKIP) {
                    break;
                }
            }
            if (element !== SKIP) {
                array.push(element);
            }
        }
        for (i = 0, max = this.afterTransformers.length; i < max; i++) {
            array = this.afterTransformers[i](array);
        }
        return array;
    };

    /**
     * Iterates through this stream
     * @param func - the function to iterate with
     */
    prototype['forEach'] = function (func) {
        // previously I just looped through it all manually, but that's a bit harder
        // unless I rewrite the sorting algorithm. which I did try, however I could
        // not get it faster than the native implementation
        var array = this.toArray();
        for (var i = 0, max = array.length; i < max; i++) {
            func(array[i]);
        }
    };

    /**
     * Sums up this stream, if all elements are numbers.
     * @returns {number}
     */
    prototype['sum'] = function () {
        var sum = 0;
        var array = this.toArray();
        var length = array.length;
        while (length--) {
            sum += array[length];
        }
        return sum;
    };

    /**
     * Counts the unique amount of numbers in this stream.
     * @returns {Number}
     */
    prototype['count'] = function () {
        return this.toArray().length; // todo: run only relevant transformers
    };

    /**
     * Finds the first element in the array and returns it.
     * @returns {Object|null}
     */
    prototype['findFirst'] = function () {
        var array = this.toArray();
        return array.length > 0 ? array[0] : null;
    };

    /**
     * Maps the stream.
     * @param func - the function to map with
     * @returns {Stream}
     */
    prototype['map'] = function (func) {
        this.transformers.push(function (element) {
            return func.call(element, element);
        });
        return this;
    };

    /**
     * Filters the stream.
     * @param func - the function to filter with
     * @returns {Stream}
     */
    prototype['filter'] = function (func) {
        this.transformers.push(function (element) {
            return func.call(element, element) ? element : SKIP;
        });
        return this;
    };

    /**
     * Sorts the stream.
     * @param func - the function to sort with
     * @returns {Stream}
     */
    prototype['sort'] = function (func) {
        this.afterTransformers.push(function (array) {
            return array.sort(func);
        });
        return this;
    };

    /**
     * Removes all non-distinct objects.
     * @returns {Stream}
     */
    prototype['distinct'] = function () {
        this.transformers.push(function (array) {
            var newArray = [];
            iLoop: for (var i = 0, max = array.length; i < max; i++) {
                var element = array[i];
                for (var j = 0, jMax = newArray.length; j < jMax; j++) {
                    if (newArray[j] == element) {
                        continue iLoop;
                    }
                }
                newArray.push(element);
            }
            return newArray;
        });
        return this;
    };

    /**
     * Clones this stream into a new one. Does not deep clone the original array.
     * @returns {Stream}
     */
    prototype['clone'] = function () {
        return new Stream(this.array.slice(0), this.transformers.slice(0), this.afterTransformers.slice(0));
    };

    global['Stream'] = Stream;
})(this);
