# path-env

Manipulate [`$PATH`](https://en.wikipedia.org/wiki/PATH_(variable)
)-like environment variable

## Requirements

* Node.js ≥ 8.9.0

## Usage

**NOTE:**
  * Everything is **chainable**.

### Modifying `$PATH` and get its value

```javascript
import {pathString} from 'path-env'

const path = pathString()
  .append(['/append/bin'])
  .prepend(['/prepend/bin'])
  .surround(['/surround/bin'])
  .get.string()

console.log(path)
```

This will print `/surround/bin:/prepend/bin:...:/append/bin:/surround/bin` in POSIX systems.

### Modifying a `$PATH`-like and get its value

Modifying `$NODE_PATH`.

```javascript
import {pathString} from 'path-env'

const path = pathString('NODE_PATH')
  .append(['/append/node_modules'])
  .prepend(['/prepend/node_modules'])
  .surround(['/surround/node_modules'])
  .get.string()

console.log(path)
```

This will print `/surround/node_modules:/prepend/node_modules:...:/append/node_modules:/surround/node_modules` in POSIX systems.

### Modifying `$PATH`-like property of `env` object

You can also modify `$PATH`-like value directly from an `env`-like object.

**Signature:**

```typescript
import {pathEnv} from 'path-env'

const env = pathEnv() // equivalent to `const env = pathEnv(process.env, 'PATH')`
  .path.append(['/append/bin'])
  .path.prepend(['/prepend/bin'])
  .path.surround(['/surround/bin'])
  .get.env()

console.log(env)
```

**Result:** `env` will looks exactly like `process.env` except modified `PATH` property.

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
