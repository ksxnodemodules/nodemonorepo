# restricted-parallel-processes

Spawn all processes, but limit number of parallel processes

## Requirements

* Node.js ≥ 8.9.0

## Usage Example

Spawn 4 commands at a time.

```javascript
import spawn from 'restricted-parallel-processes'

const commands = [
  'echo This is a string command',
  ['echo', 'This is an array command'],
  {
    command: 'echo',
    argv: ['This is an object command'],
    options: {
      shell: true,
      encoding: 'utf8'
    }
  }
]

const partLength = 4

const result = spawn(commands, partLength)
console.log(result)
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
