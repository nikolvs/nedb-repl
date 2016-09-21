/* eslint no-underscore-dangle: ["error", { "allow": ["_context"] }] */

const Commands = require('./commands');
const Events = require('./events');
const datastore = require('../datastore');
const evaluator = require('./evaluator');
const pkg = require('../../package.json');
const writer = require('./writer');

const chalk = require('chalk');
const repl = require('repl');
const R = require('ramda');
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

exports.setDatastore = (vm, filename) => {
  const db = datastore(filename);
  Object.defineProperty(vm._context, 'db', {
    configurable: true,
    enumarable: true,
    value: db,
  });
};

exports.createVM = (filename, options = {}) => {
  const vm = new VM({
    timeout: R.defaultTo(VM_DEFAULT_TIMEOUT, options.timeout) * 1000,
  });

  this.setDatastore(vm, filename);
  return vm;
};

module.exports = (filename, options = {}) => {
  displayIntro(filename);
  const nedbRepl = repl.start({
    writer,
    eval: evaluator,
    prompt: REPL_PROMPT,
  });

  const vm = this.createVM(filename, options);
  nedbRepl.context.vm = vm;

  R.mapObjIndexed((cmd, keyword) => {
    nedbRepl.defineCommand(keyword, cmd);
  }, Commands);

  nedbRepl.options = options;
  nedbRepl.options.filename = filename;

  nedbRepl.on('reset', Events.reset);
  nedbRepl.on('exit', Events.exit);

  return nedbRepl;
};
