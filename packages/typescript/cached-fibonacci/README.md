# cached-fibonacci

Utilize [cached-expression](https://www.npmjs.com/package/cached-expression) to calculate fibonacci numbers

## Usage

```javascript
import CachedFibonacci from 'cached-fibonacci'
const { calculate } = new CachedFibonacci()
const result = [0, 1, 2, 3, 4, 5].map(calculate) // expect: [0, 1, 1, 2, 3, 5]
```

## Why and How?

This is a mathemetical definition of fibonacci:

```javascript
fib(0) = 0
fib(1) = 1
fib(n) = fib(n - 2) + fib(n - 1)
```

Let's say you have to calculate `fib(5)`, follow the definition above, you'll have to calculate `fib(3)` and `fib(4)`, `fib(4)` in turn requires `fib(2)` and `fib(3)`, `fib(3)` in turn requires `fib(1)` and `fib(2)`, and so on.

As you can see, `fib(3)` is called twice, which leads to `fib(2)` being called three times (once by `fib(4)` and twice by `fib(3)`), which in turn leads to `fib(1)` being called five times (twice by `fib(3)` and three times by `fib(2)`).

```
fib(5)
├── fib(3)
│   ├── fib(1)
│   └── fib(2)
│       ├── fib(0)
│       └── fib(1)
└── fib(4)
    ├── fib(2)
    │   ├── fib(0)
    │   └── fib(1)
    └── fib(3)
        ├── fib(1)
        └── fib(2)
            ├── fib(0)
            └── fib(1)
```

`CachedFibonacci` helps reducing the ammount of computation by storing calculated fibonacci numbers in a cache, therefore every `fib(n)` is calculated only once for each `n`.

```
fib(5)
├── fib(3)
│   ├── fib(1)
│   └── fib(2)
│       ├── fib(0)
│       └── fib(1)
└── fib(4)
    ├── fib(2) <cache>
    └── fib(3) <cache>
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
