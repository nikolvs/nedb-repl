const meow = require('meow');
const pkg = require('../package.json');
const nedbRepl = require('./repl');

const CLI_HELP = `
  USAGE
    $ nedb [filename]

  OPTIONS
    -t, --timeout   Set REPL timeout in seconds. Defaults to 3
    -h, --help      Displays this
    -v, --version   Displays the REPL and NeDB versions
`;

const cli = meow({
  help: CLI_HELP,
  version: `NeDB v${pkg.dependencies.nedb} - REPL v${pkg.version}`,
}, {
  alias: {
    t: 'timeout',
    h: 'help',
    v: 'version',
  },
});

const filename = cli.input[0];
nedbRepl(filename, cli.flags).catch(console.error);
