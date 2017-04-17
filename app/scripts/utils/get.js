import Promise from './promise';

/**
 * A very simple Promise-based wrapper around XMLHttpRequest.
 *
 * If you are polyfilling fetch or using jQuery.ajax for nothing more than a
 * simple GET request, use this instead to save a bunch of bytes.
 *
 * @param  {String} url
 * @return {Promise}
 * @example
 *
 * get('assets/data.json').then(function (data) {
 *   // `data` contains the contents the file at path
 * });
 */
export default function get (url) {
  return new Promise(function dispatchXMLHttpRequest (resolve, reject) {
    var req = new window.XMLHttpRequest();
    req.open('GET', url, true);

    req.onload = function () {
      var status = req.status;

      if (status >= 200 && status < 300) {
        resolve(req.response);
      } else {
        reject(new Error('Request failed: ' + status));
      }
    };

    req.onerror = reject;

    req.send(null);
  });
}
