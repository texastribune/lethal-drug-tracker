'use strict';

const fs = require('fs');
const journalize = require('journalize');
const nunjucks = require('nunjucks');
const parse = require('date-fns/parse');
const path = require('path');
const url = require('url');

const config = require('../project.config');
const customFilters = require('../custom-filters');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PROJECT_URL = `https://${config.bucket}/${config.folder}/`;

const env = nunjucks.configure('./app/templates', {
  autoescape: false,
  noCache: true
});

/*
Adds the current runtime state of the project. Good for excluding portions of
templates that do not need to be there during testing.
 */
env.addGlobal('IS_PRODUCTION', IS_PRODUCTION);

/*
Adds static function globally. Normalizes file paths for deployment.
 */
env.addGlobal('static', (p) => {
  if (IS_PRODUCTION) p = path.join(config.folder, p);

  return url.resolve('/', p);
});

/*
Creates an absolute path URL.
 */
env.addGlobal('staticAbsolute', (p, noSlash) => {
  noSlash = noSlash || false;

  if (p === '/') {
    noSlash = true;
    p = '';
  }

  return url.resolve(PROJECT_URL, p === '/' ? '' : p) + (noSlash ? '' : '/');
});

/*
Lets you inject the contents of a file into a template. Good for things like
SVG icons.
 */
env.addGlobal('inject', (p) => {
  if (IS_PRODUCTION) {
    return fs.readFileSync(path.join(config.distDir, p), 'utf8');
  }

  let s;

  try {
    s = fs.readFileSync(path.join('./.tmp', p), 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      s = fs.readFileSync(path.join(config.srcDir, p), 'utf8');
    } else {
      throw e;
    }
  }

  return s;
});

/**
 * Map of AP month abbreviations. Note that they are zero-indexed due to
 * JavaScript's life choices.
 *
 * @type {Map}
 */
const AP_MONTHS = new Map([
  [0, 'Jan.'],
  [1, 'Feb.'],
  [2, 'March'],
  [3, 'April'],
  [4, 'May'],
  [5, 'June'],
  [6, 'July'],
  [7, 'Aug.'],
  [8, 'Sept.'],
  [9, 'Oct.'],
  [10, 'Nov.'],
  [11, 'Dec.']
]);

env.addGlobal('apFormatDate', (input) => {
  const date = parse(input);

  const month = AP_MONTHS.get(date.getMonth());
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${month} ${dayOfMonth}, ${year}`;
});

//jolie added to have expiration style date-fns
const EXP_MONTHS = new Map([
  [0, 'Jan'],
  [1, 'Feb'],
  [2, 'Mar'],
  [3, 'Apr'],
  [4, 'May'],
  [5, 'Jun'],
  [6, 'Jul'],
  [7, 'Aug'],
  [8, 'Sep'],
  [9, 'Oct'],
  [10, 'Nov'],
  [11, 'Dec']
]);

env.addGlobal('apFormatDateNOYR', (input) => {
  const date = parse(input);

  const month = EXP_MONTHS.get(date.getMonth());
  const dayOfMonth = date.getDate();

  return `${month} ${dayOfMonth}`;
});

/*
Set up `journalize`.
 */
for (let key in journalize) {
  let func = journalize[key];

  if (typeof func === 'function') {
    env.addFilter(key, func);
  }
}

/*
Set up any custom filers.
 */
for (let key in customFilters) {
  let func = customFilters[key];

  if (typeof func === 'function') {
    env.addFilter(key, func);
  }
}

module.exports = env;
