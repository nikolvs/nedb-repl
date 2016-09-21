const cardinal = require('cardinal');
const CircularJSON = require('circular-json');
const R = require('ramda');
const util = require('util');

const isObject = R.is(Object);
const isFunction = R.is(Function);

const writer = function writer(data) {
  if (!isObject(data)) {
    const output = String(data);
    return cardinal.highlight(output);
  }

  if (isFunction(data)) {
    const output = util.inspect(data);
    return cardinal.highlight(output);
  }

  const isObjectArray = data.length && isObject(data[0]);
  if (!Array.isArray(data) || !isObjectArray) {
    const output = CircularJSON.stringify(data);
    return cardinal.highlight(output);
  }

  const output = data.reduce((buf, item, idx) => {
    const str = CircularJSON.stringify(item);
    return `${buf + str}${(idx === (data.length - 1) ? '' : ',\n')}`;
  }, '');

  return cardinal.highlight(output);
};

module.exports = writer;
