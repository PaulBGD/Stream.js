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
        if (!array || !('length' in array)) {
            throw new Error('Array does not exist or does not have length property!');
        }
        this.array = array;
        this.transformers = transformers || [];
        this.afterTransformers = afterTransformers || [];
    }

    /**
     * Turns this stream back into an array.
     *
     * @returns {Array}
     */
    Stream.prototype.toArray = function () {
        var array = [];
        for (var i = 0, max = this.array.length; i < max; i++) {
            var element = this.array[i];
            for (var j = 0, jMax = this.transformers.length; j < jMax; j++) {
                element = this.transformers[j].transform(element);
                if (element == SKIP) {
                    break;
                }
            }
            if (element !== SKIP) {
                array.push(element);
            }
        }
        for (i = 0, max = this.afterTransformers.length; i < max; i++) {
            array = this.afterTransformers[i].transform(array);
        }
        return array;
    };

    /**
     * Iterates through this stream
     * @param func - the function to iterate with
     */
    Stream.prototype.forEach = function (func) {
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
    Stream.prototype.sum = function () {
        var sum = 0;
        var array = this.toArray();
        var length = array.length;
        while (length--) {
            var element = array[length];
            if (isNaN(element)) {
                throw new Error('Invalid number "' + element + '"');
            }
            sum += element;
        }
        return sum;
    };

    /**
     * Counts the unique amount of numbers in this stream.
     * @returns {Number}
     */
    Stream.prototype.count = function () {
        return this.toArray().length; // todo: run only relevant transformers
    };

    /**
     * Finds the first element in the array and returns it.
     * @returns {Object|null}
     */
    Stream.prototype.findFirst = function () {
        var array = this.toArray();
        return array.length > 0 ? array[0] : null;
    };

    /**
     * Maps the stream.
     * @param func - the function to map with
     * @returns {Stream}
     */
    Stream.prototype.map = function (func) {
        this.transformers.push(new MapTransform(func));
        return this;
    };

    function MapTransform(func) {
        checkFunction(func);
        this.func = func;
    }

    MapTransform.prototype.transform = function (element) {
        return this.func.call(element, element);
    };

    /**
     * Filters the stream.
     * @param func - the function to filter with
     * @returns {Stream}
     */
    Stream.prototype.filter = function (func) {
        this.transformers.push(new FilterTransform(func));
        return this;
    };

    function FilterTransform(func) {
        checkFunction(func);
        this.func = func;
    }

    FilterTransform.prototype.transform = function (element) {
        return this.func.call(element, element) ? element : SKIP;
    };

    /**
     * Sorts the stream.
     * @param func - the function to sort with
     * @returns {Stream}
     */
    Stream.prototype.sort = function (func) {
        this.afterTransformers.push(new SortTransform(func));
        return this;
    };

    function SortTransform(func) {
        checkFunction(func);
        this.func = func;
    }

    SortTransform.prototype.transform = function (array) {
        return array.sort(this.func);
    };

    /**
     * Removes all non-distinct objects.
     * @returns {Stream}
     */
    Stream.prototype.distinct = function () {
        this.transformers.push(distinctTransformer);
        return this;
    };

    var distinctTransformer = {
        transform: function (array) {
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
        }
    };

    /**
     * Clones this stream into a new one. Does not deep clone the original array.
     * @returns {Stream}
     */
    Stream.prototype.clone = function () {
        return new Stream(this.array.slice(0), this.transformers.slice(0), this.afterTransformers.slice(0));
    };

    function checkFunction(func) {
        if (typeof func !== 'function') {
            throw new Error('Invalid map function');
        }
    }

    global['Stream'] = Stream;
})(this);
