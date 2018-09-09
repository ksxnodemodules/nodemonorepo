# assemble-registry-url

Assemble registry URLs from given package name

## Usage

```javascript
import assemble from 'assemble-registry-url'
console.log(assemble({package: 'package-name'}))
```

It will print:

```json
{
  "allVersionsURL": "https://registry.npmjs.org/package-name/versions",
  "latestVersionURL": "https://registry.npmjs.org/package-name/latest",
  "package": "package-name",
  "packageURL": "https://registry.npmjs.org/package-name",
  "registry": "https://registry.npmjs.org",
  "registryURL": "https://registry.npmjs.org",
  "setPackage": [Function],
  "setRegistry": [Function],
  "setVersion": [Function],
  "validPackageName": true,
  "validRegistry": true,
}
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
