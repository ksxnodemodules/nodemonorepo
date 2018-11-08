# cached-expression

Expressions that are calculated once for each object

## Usage

### APIs

```typescript
export declare class Calculator<X, Y> {
  public readonly calculate: (x: X) => Y
  constructor (calculate: (x: X) => Y)
  protected createCache (): MapLike<X, Y>
}

export default Calculator
```

### Example

```javascript
import assert from 'assert'
import { Calculator } from 'cached-expression'
const { calculate } = new Calculator(x => [x, Math.random()])

const a0 = calculate('a')
const a1 = calculate('a')
const a2 = calculate('a')
const b0 = calculate('b')

assert.deepEqual(a0, a1)
assert.deepEqual(a0, a2)
assert.notDeepEqual(a0, b0)
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
