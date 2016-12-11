const nedbRepl = require('./');
const chalk = require('chalk');
const R = require('ramda');

const Events = {
  reset(context) {
    nedbRepl.setVM(context, this.options.filename, this.options).then(() => {
      const datastoreName = R.defaultTo('in-memory only', this.options.filename);
      console.log(`Current datastore: ${chalk.bold(datastoreName)}`);
      this.displayPrompt();
    });
  },

  exit() {
    console.log('Bye!');
    process.exit(0);
  },
};

module.exports = Events;
