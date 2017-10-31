import test from 'ava';
import datastore from '../lib/datastore';

const data = [
  { a: 1 },
  { a: 2 },
  { a: 3 },
];

let db;
test.before(async () => {
  db = await datastore();
});

test('should insert a document', (t) => {
  const doc = db.insert(data[0]);

  t.is(doc.a, data[0].a);
  t.true('_id' in doc);
});

test('should insert two documents', (t) => {
  const arr = data.slice(1);
  const docs = db.insert(arr);

  docs.forEach((doc, index) => {
    t.is(doc.a, arr[index].a);
    t.true('_id' in doc);
  });
});

test('should find all documents', (t) => {
  const docs = db.find({}).exec();

  if (docs.length !== data.length) {
    t.fail();
  }

  docs.forEach((doc) => {
    const i = data.find(d => d.a === doc.a);
    t.not(i, null);
  });
});

test('should find all documents keeping only the `a` field', (t) => {
  const docs = db
    .find({}, { a: 1, _id: 0 })
    .sort({ a: 1 })
    .exec();

  t.deepEqual(docs, data);
});

test('should find one document', (t) => {
  const doc = db.findOne({ a: 3 }).exec();
  t.is(doc.a, data[2].a);
});

test('should count documents', (t) => {
  const count = db.count({}).exec();
  t.is(count, data.length);
});

test('should update a document', (t) => {
  const countUpdates = db.update({ a: 1 }, { a: 0 });
  t.is(countUpdates, 1);
});

test('should update documents w/ `a` field greater than 1', (t) => {
  const countUpdates = db.update(
    { a: { $gt: 1 } },
    { a: 4 },
    { multi: true },
  );

  t.is(countUpdates, data.filter(d => d.a > 1).length);
});

test('should remove a document', (t) => {
  const countRemoved = db.remove({ a: 0 });
  t.is(countRemoved, 1);
});

test('should remove all documents', (t) => {
  const countRemoved = db.remove({}, { multi: true });
  t.is(countRemoved, data.length - 1);
});
