# nedb-repl
> The command-line tool for NeDB

![](terminal.gif)

[![Build Status](https://travis-ci.org/nikolassilva/nedb-repl.svg)](https://travis-ci.org/nikolassilva/nedb-repl)
[![Dependency Status](https://david-dm.org/nikolassilva/nedb-repl.svg)](https://david-dm.org/nikolassilva/nedb-repl)
[![devDependency Status](https://david-dm.org/nikolassilva/nedb-repl/dev-status.svg)](https://david-dm.org/nikolassilva/nedb-repl#info=devDependencies)

This is an interactive interface to query and update data, like MongoDB Shell, but for NeDB.

## Install
```bash
npm install -g nedb-repl
```

## Usage
```bash
$ nedb --help
```

Inside the REPL, the datastore namespace is attached to `db` global property.

You can display the database you're using by typing:
```bash
nedb> db.filename
foo.db
```

To perform queries and other operations, you can use the well-known NeDB datastore methods without the callback param. See [NeDB API](https://github.com/louischatriot/nedb#api).
```bash
nedb> db.insert([ { a: 1 }, { a: 2 } ])
{"a":1,"_id":"Kkui4fblZ5kqkmc8"},
{"a":2,"_id":"9ptV45vIEbBparvA"}
```

Query methods usually returns the cursor, not the data. To return the data you should use the `exec` method.
```bash
nedb> db.find({ a: 1 }).exec()
{"a":1,"_id":"Kkui4fblZ5kqkmc8"}
nedb> db.count().exec()
2
```

You can change the datastore you're using with the `.open` command:
```bash
nedb> .open bar.db
Opened file bar.db
```
If the filename is not specified, the datastore is set to in-memory only.

You can see other commands by typing `.help`.


## License
MIT © [Nikolas Silva](http://nikolas.com.br)
