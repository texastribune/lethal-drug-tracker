import PromisePolyfill from 'promise-polyfill';

const Promise = window.Promise || PromisePolyfill;

export default Promise;
