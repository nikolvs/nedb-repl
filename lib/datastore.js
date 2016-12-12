/* eslint no-underscore-dangle:
  ["error", { "allow": ["_exec", "_insert", "_update", "_remove"] }] */

const deasync = require('deasync');
const Cursor = require('nedb/lib/cursor');
const Datastore = require('nedb');

Cursor.prototype._exec = deasync(Cursor.prototype._exec);
Cursor.prototype.exec = function exec(...args) {
  return this._exec(...args);
};

Datastore.prototype._insert = deasync(Datastore.prototype._insert);
Datastore.prototype.insert = function insert(...args) {
  return this._insert(...args);
};

Datastore.prototype._update = deasync(Datastore.prototype._update);
Datastore.prototype.update = function update(...args) {
  return this._update(...args);
};

Datastore.prototype._remove = deasync(Datastore.prototype._remove);
Datastore.prototype.remove = function remove(...args) {
  return this._remove(...args);
};

module.exports = filename => new Promise((resolve, reject) => {
  const ds = new Datastore({
    filename,
    autoload: true,
    onload: err => (err ? reject(err) : resolve(ds)),
  });
});
