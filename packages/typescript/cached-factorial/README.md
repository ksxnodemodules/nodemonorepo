# cached-factorial

Utilize [cached-expression](https://www.npmjs.com/package/cached-expression) to calculate multiple factorial numbers

## Usage

```javascript
import CachedFactorial from 'cached-factorial'
const { calculate } = new CachedFactorial()
const result = [0, 1, 2, 3, 4, 5].map(calculate) // expect: [1, 1, 2, 6, 24, 120]
```

## Use Case: Factorials of Multiple Numbers

This is only useful when you have to calculate factorials of more than on number.

### Why and How?

Let's say you have to calculate `5!` and `7!`. That gives us:

```
5! = 5 * 4 * 3 * 2 * 1
7! = 7 * 6 * (5 * 4 * 3 * 2 * 1) = 7 * 6 * 5!
```

If you were to calculate `5!` and `7!` independently, `5!` (and by extension, `4!`, `3!`, `2!`) will be called twice. This is wasteful!

In order to avoid this wasteful operation, `CachedFactorial` stores every factorial that is calculated in a cache so that every factorial is only computed once.

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
