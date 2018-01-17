# what's this?

csv file convert to object array like below.

```
const parser = require('csv-table-parser')

const input = `name, age, email
alice, 15, alice@xxx.com
bob, 25, bob@xxx.com`

parser(input)

/*
 *[
 *   { name: "alice", age: 15, email: "alice@xxx.com" },
 *   { name: "bob", age: 25, email: "bob@xxx.com" }
 *]
*/
```
