# Cancelled

**Reason:** Technical Limitation — TypeScript cannot infer parameter/return types of an overloaded function correctly

```typescript
import { ParametersOf, ReturnOf } from 'typescript-miscellaneous'

interface OverloadedFunction {
  (x: 0): 'zero'
  (x: 1): 'one'
  (x: 2): 'two
}

// Expecting: [0] | [1] | [2]
// Received: [2]
type Foo = ParametersOf<OverloadedFunction>

// Expecting: 'zero' | 'one' | 'two'
// Received: 'two'
type Bar = ReturnOf<OverloadedFunction>
```
