/* global performance */

/**
 * If `performance` is available, use it for timing. Otherwise, use `Date`.
 * @type {Object}
 * @private
 */
const clock = typeof performance === 'object' ? performance : Date;

/**
 * Returns a Number representation of the current time. Uses
 * `performance.now()` if available, otherwise uses `Date.now()`.
 *
 * @private
 * @return {Number}
 */
function getTimeStamp () {
  return clock.now();
}

// Borrowed from underscore.js: http://underscorejs.org/#debounce
export default function debounce (func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function () {
    var last = getTimeStamp() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {
    context = this;
    args = arguments;
    timestamp = getTimeStamp();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
