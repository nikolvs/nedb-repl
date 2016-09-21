const deasync = require('deasync');
const Cursor = require('nedb/lib/cursor');
const Datastore = require('nedb');

Cursor.prototype._exec = deasync(Cursor.prototype._exec);
Cursor.prototype.exec = function exec() {
  return this._exec(...arguments);
};

Datastore.prototype._insert = deasync(Datastore.prototype._insert);
Datastore.prototype.insert = function insert() {
  return this._insert(...arguments);
};

Datastore.prototype._update = deasync(Datastore.prototype._update);
Datastore.prototype.update = function update() {
  return this._update(...arguments);
};

Datastore.prototype._remove = deasync(Datastore.prototype._remove);
Datastore.prototype.remove = function remove() {
  return this._remove(...arguments);
};

module.exports = filename => new Datastore({
  filename,
  autoload: true,
});
