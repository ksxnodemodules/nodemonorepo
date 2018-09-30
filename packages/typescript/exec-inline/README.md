# exec-inline

Make it more convenient to execute commands with inherited stdio

## Usage

```javascript
const { spawnSync } = require('exec-inline')

// Print "hello world"
spawnSync('echo', 'hello', 'world')

// Print "Exiting" and exit with code 123
spawnSync('bash', '-c', 'console.log("Exiting"); process.exit(123)').exit()
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
