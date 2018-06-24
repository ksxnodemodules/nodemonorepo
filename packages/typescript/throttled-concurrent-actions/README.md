# throttled-concurrent-actions

Like `Promise.all`, but throttled

## Requirements

* Node.js ≥ 8.9.0

## Function Signature

```typescript
declare function throttledConcurrentActions<X> (count: number, list: Action<X>[]): Promise<X[]>
type Action<X> = (x?: X) => X | Promise<X>
```

## Usage Example

```javascript
import throttledConcurrentActions from 'throttled-concurrent-actions'

const result = await throttledConcurrentActions(
  3,
  [
    () => 'Sync Example',
    async () => 'Async Example',
    () => 'Another Sync Example',
    async past => ({past}),
    past => ({past})
  ]
)
```

**Result:**

```javascript
[
  'Sync Example',
  'Async Example',
  'Another Sync Example',
  {past: 'Sync Example'},
  {past: 'Async Example'}
]
```

## License

[MIT](https://git.io/vhaEz) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
