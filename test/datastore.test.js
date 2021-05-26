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

test.serial('should insert a document', async (t) => {
  const doc = await db.insert(data[0]);

  t.is(doc.a, data[0].a);
  t.true('_id' in doc);
});

test.serial('should insert two documents', async (t) => {
  const arr = data.slice(1);
  const docs = await db.insert(arr);

  docs.forEach((doc, index) => {
    t.is(doc.a, arr[index].a);
    t.true('_id' in doc);
  });
});

test.serial('should find all documents', async (t) => {
  const docs = await db.find({}).exec();

  if (docs.length !== data.length) {
    t.fail();
  }

  docs.forEach((doc) => {
    const i = data.find(d => d.a === doc.a);
    t.not(i, null);
  });
});

test.serial('should find all documents keeping only the `a` field', async (t) => {
  const docs = await db
    .find({}, { a: 1, _id: 0 })
    .sort({ a: 1 })
    .exec();

  t.deepEqual(docs, data);
});

test.serial('should find one document', async (t) => {
  const doc = await db.findOne({ a: 3 }).exec();
  t.is(doc.a, data[2].a);
});

test.serial('should count documents', async (t) => {
  const count = await db.count({}).exec();
  t.is(count, data.length);
});

test.serial('should update a document', async (t) => {
  const countUpdates = await db.update({ a: 1 }, { a: 0 });
  t.is(countUpdates, 1);
});

test.serial('should update documents w/ `a` field greater than 1', async (t) => {
  const countUpdates = await db.update(
    { a: { $gt: 1 } },
    { a: 4 },
    { multi: true },
  );

  t.is(countUpdates, data.filter(d => d.a > 1).length);
});

test.serial('should remove a document', async (t) => {
  const countRemoved = await db.remove({ a: 0 });
  t.is(countRemoved, 1);
});

test.serial('should remove all documents', async (t) => {
  const countRemoved = await db.remove({}, { multi: true });
  t.is(countRemoved, data.length - 1);
});
