![build_status](https://travis-ci.org/rchaser53/csv-table-parser.svg?branch=master)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

# how to install

```
 npm install csv-table-parser
```

# what's this?

csv file convert to object array like below.

```
const { parser } = require('csv-table-parser')

const input = `name, age, email, isMember
alice, 15, alice@xxx.com, true
bob, 25, bob@xxx.com, false`

parser(input)

/*
 *[
 *   { name: "alice", age: 15, email: "alice@xxx.com", isMember: true },
 *   { name: "bob", age: 25, email: "bob@xxx.com", isMember: false }
 *]
*/
```
