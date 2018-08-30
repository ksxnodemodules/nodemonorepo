# browser-or-server

Statically tell if running environment is Node.js or browser

## Usage

```javascript
import engine, {isBrowser, isServer} from 'browser-or-server'
console.log(engine) // either 'browser' or 'server'
console.log(isBrowser) // either true or false
console.log(isServer) // either false or true
```

## FAQs

### How does it works?

It's "server" if it is imported (a.k.a. `require()`d) directly via node and "browser" if it is bundled via browserify, webpack, etc.

### How is this different from other similar packages?

TypeScript support.

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
