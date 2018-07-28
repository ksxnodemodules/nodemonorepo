# random-org-http

[Random.org](https://random.org) via [HTTP Interface](https://www.random.org/clients/http/)

## Requirements

* Node ≥ 8.9.0

## Usage

### Random Integers

```javascript
import {integer} from 'random-org-http'

const result = await integers({
  min: 1,
  max: 32,
  num: 9
})

console.log(result)
```

This will print an array of 9 random integers within range [1, 32].

### Random Ordered Sequence

```javascript
import {sequences} from 'random-org-http'

const result = await sequences({
  min: 10,
  max: 100
})

console.log(result)
```

This will print an array of all integers within range [10, 100] in random order.

### Random Strings

```javascript
import {strings} from 'random-org-http'

const result = await strings({
  num: 7,
  len: 12,
  unique: false,
  digits: false,
  upperalpha: true,
  loweralpha: false
})

console.log(result)
```

This will print an array of 7 random strings consist of 12 uppercase characters.

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
