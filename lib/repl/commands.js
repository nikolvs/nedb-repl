const nedbRepl = require('./');
const chalk = require('chalk');

const Commands = {
  open: {
    help: 'Open file to persist data',
    action(filename) {
      nedbRepl.setDatastore(this.context.vm, filename);
      console.log(filename
        ? `Opened file ${chalk.bold(filename)}`
        : 'Using in-memory only datastore'
      );
      this.displayPrompt();
    },
  },
};

module.exports = Commands;
