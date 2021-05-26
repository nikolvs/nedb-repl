/* eslint no-underscore-dangle: ["error", { "allow": ["_context"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

const Commands = require('./commands');
const Events = require('./events');
const datastore = require('../datastore');
const evaluator = require('./evaluator');
const pkg = require('../../package.json');
const writer = require('./writer');

const chalk = require('chalk');
const repl = require('repl');
const R = require('ramda');
const { Gaze } = require('gaze');
const { VM } = require('vm2');

const REPL_PROMPT = 'nedb> ';
const VM_DEFAULT_TIMEOUT = 3;

const displayIntro = (filename) => {
  const datastoreName = R.defaultTo('in-memory only', filename);
  const openHint = filename ? '' :
    `Use ${chalk.underline('.open FILENAME')} to reopen on a persistent datastore.`;
  const intro = `
    NeDB v${pkg.dependencies.nedb} - REPL v${pkg.version}
    Enter ${chalk.underline('.help')} for usage hints.
    Connected to ${chalk.bold(datastoreName)} datastore.
    ${openHint}
  `.replace(/(\n\s+|\n\n)/g, '\n');

  console.log(intro);
};

exports.setDatastore = async (context, filename) => {
  if (context.watcher) {
    context.watcher.close();
  }

  const ds = await datastore(filename);
  Object.defineProperty(context.vm._context, 'db', {
    configurable: true,
    enumarable: true,
    value: ds,
  });

  context.watcher = new Gaze(filename);
  context.watcher.on('changed', () => this.setDatastore(context, filename));
};

exports.setVM = (context, filename, options = {}) => {
  context.vm = new VM({
    timeout: R.defaultTo(VM_DEFAULT_TIMEOUT, options.timeout) * 1000,
  });

  return this.setDatastore(context, filename);
};

module.exports = async (filename, options = {}) => {
  displayIntro(filename);
  const nedbRepl = repl.start({
    writer,
    eval: evaluator,
    prompt: REPL_PROMPT,
  });

  R.mapObjIndexed((cmd, keyword) => {
    nedbRepl.defineCommand(keyword, cmd);
  }, Commands);

  nedbRepl.options = options;
  nedbRepl.options.filename = filename;

  nedbRepl.on('reset', Events.reset);
  nedbRepl.on('exit', Events.exit);

  await this.setVM(nedbRepl.context, filename, options);
  return nedbRepl;
};
