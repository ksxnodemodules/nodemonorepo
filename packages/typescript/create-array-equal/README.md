# create-array-equal

Create equality function for arrays

## Usage

```javascript
import createArrayEqual from 'create-array-equal'
const arrayEqual = createArrayEqual((a, b) => a === b)
const a = arrayEqual([], []) // expect: true
const b = arrayEqual([0, 1], [0, 1]) // expect: true
const c = arrayEqual([0], [1]) // expect: false
const d = arrayEqual([0], [0, 1]) // expect: false
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
