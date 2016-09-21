/* eslint no-param-reassign: ["error", { "props": false }] */

const nedbRepl = require('./');
const chalk = require('chalk');
const R = require('ramda');

const Events = {
  reset(context) {
    const vm = nedbRepl.createVM(this.options.filename, this.options);
    context.vm = vm;

    const datastoreName = R.defaultTo('in-memory only', this.filename);
    console.log(`Current datastore: ${chalk.bold(datastoreName)}`);
  },

  exit() {
    console.log('Bye!');
  },
};

module.exports = Events;
