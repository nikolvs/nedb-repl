const repl = require('repl');
const R = require('ramda');

const RECOVERABLE_ERRORS = [
  'Unexpected token',
  'Unexpected end of input',
  'missing ) after argument list',
  'Unterminated template literal',
  'Missing } in template expression',
];

const isCursor = x => x && x.query && x.execFn;
const isRecoverable = (err) => {
  if (err.name !== 'SyntaxError') return false;
  return R.contains(err.message, RECOVERABLE_ERRORS);
};

const evaluator = async function evaluator(cmd, context, filename, callback) {
  try {
    const result = context.vm.run(cmd);
    const output = isCursor(result) ? result.exec() : result;

    return callback(null, await output);
  } catch (err) {
    if (isRecoverable(err)) {
      return callback(new repl.Recoverable(err));
    }

    return callback(null, Error(err));
  }
};

module.exports = evaluator;
