# remote-controlled-promise

Create a Promise object that is controllable from outside

## Requirements

* Node.js ≥ 8.9.0

## Usage Example

```javascript
import {create} from 'remote-controlled-promise'

// Create a controlled promise
const ctrl = create()

// `ctrl.promise` is a that controlled promise
ctrl.promise.then(value => console.log(`resolved ${value}`))

console.log('foo')
ctrl.resolve(1234)
console.log('bar')
```

This will print:

```
foo
bar
resolved 1234
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
