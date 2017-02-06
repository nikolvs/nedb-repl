const cardinal = require('cardinal');
const CircularJSON = require('circular-json');
const R = require('ramda');
const util = require('util');

const isObject = R.is(Object);
const isFunction = R.is(Function);
const isCursor = x => x.query && x.execFn;

const writer = function writer(data) {
  if (!isObject(data)) {
    const output = String(data);
    return cardinal.highlight(output);
  }

  if (isFunction(data)) {
    const output = util.inspect(data);
    return cardinal.highlight(output);
  }

  const parsedData = isCursor(data) ? data.exec() : data;
  const isObjectArray = parsedData.length && isObject(parsedData[0]);

  if (!Array.isArray(parsedData) || !isObjectArray) {
    const output = CircularJSON.stringify(parsedData);
    return cardinal.highlight(output);
  }

  const output = parsedData.reduce((buf, item, idx) => {
    const str = CircularJSON.stringify(item);
    return `${buf + str}${(idx === (parsedData.length - 1) ? '' : ',\n')}`;
  }, '');

  return cardinal.highlight(output);
};

module.exports = writer;
