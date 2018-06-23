# [monorepo](https://git.io/vhoXX)-shared-yaml

Just [js-yaml](https://git.io/5UpxBw) + [some extra methods](additional-apis)

## Requirements

* Node.js ≥ 8.9.0

## Additional APIs

* `yaml.yaml`: exported object of `js-yaml`.
* `yaml.lib.loadFile`, `yaml.lib.safeLoadFile`: Asynchronous functions to get JavaScript object from a YAML file, return `Promise<any>`.
* `yaml.lib.dumpFile`, `yaml.lib.safeDumpFile`: Asynchronous functions to dump JavaScript object to a file in YAML format, return `Promise<void>`.
* `yaml.lib.loadFileSync`, `yaml.lib.safeLoadFileSync`: Synchronous functions to get JavaScript object from a YAML file, return `any`.
* `yaml.lib.dumpFileSync`, `yaml.lib.safeDumpFileSync`: Synchronous functions to dump JavaScript object to a file in YAML format, return `void`.

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
