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

#### Unique Object Reference

```javascript
import assert from 'assert'
import { Calculator } from 'cached-expression'
const { calculate } = new Calculator(x => [x, Math.random()])

const a0 = calculate('a')
const a1 = calculate('a')
const a2 = calculate('a')
const b0 = calculate('b')

// Same input produces same reference
assert(a0 === a1)
assert(a0 === a2)

// Different inputs produces different reference
assert(a0 !== b1)
```

#### Application: Factorial

Caching improve performance when calculating factorial of multiple numbers.

```javascript
import { Calculator } from 'cached-expression'

// Definition:
//   fac(0) = 1
//   fac(n) = n * fac(n - 1)
const fac = new Calculator(
  x => x < 2
    ? 1
    : x * fac(x - 1)
).calculate

const result = [0, 1, 2, 3, 4].map(fac)
```

#### Application: Fibonacci

Caching turn recursive fibonacci algorithm from a wasteful binary tree model to a efficient pyramid model.

```javascript
import { Calculator } from 'cached-expression'

// Definition:
//   fib(0) = fib(1) = 1
//   fib(n) = fib(n - 2) + fib(n - 1)
const fib = new Calculator(
  x => x < 2
    ? 1
    : fib(x - 2) + fib(x - 1)
).calculate

const result = fib(7)
```

## See Also

* [Memoization](https://en.wikipedia.org/wiki/Memoization)

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
