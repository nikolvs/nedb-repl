const repl = require('repl');
const chalk = require('chalk');
const R = require('ramda');

const RECOVERABLE_ERRORS = [
  'Unexpected token',
  'Unexpected end of input',
  'missing ) after argument list',
  'Unterminated template literal',
  'Missing } in template expression',
];

const isRecoverable = (error) => {
  if (error.name !== 'SyntaxError') return false;
  return R.contains(error.message, RECOVERABLE_ERRORS);
};

const evaluator = function evaluator(cmd, context, filename, callback) {
  try {
    const output = context.vm.run(cmd);
    return callback(null, output);
  } catch (error) {
    if (isRecoverable(error)) {
      return callback(new repl.Recoverable(error));
    }

    return callback(chalk.red(String(error)));
  }
};

module.exports = evaluator;
