# advanced-map-altered-equal

Set-like class with customizable equality operator

## Usage

```javascript
import AlteredEqual from 'advanced-set-altered-equal'

const set = new AlteredEqual(
  Map,
  (a, b) => String(a) === String(b)
).add(0)

set.has('0') // expect: true
set.has(0) // expect: true
set.has({ toString: () => '0' }) // expect: true
set.has('1') // expect: false
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
