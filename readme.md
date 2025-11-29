>  **WARNING**     
> This work is **PURE CHAOS**. This is **NOT** everyday TypeScript.    
> **Not** recommended for beginners or people who have fought with types.    
> **Proceed** at your own **Risk**.

# ts madness
a repo hosting my typescript monsterous experiments.

## experiments
| Project | Description |
| ------- | ----------- |
| [HTML Parser](./html-parser/index.ts) | for a possible frontend framework |
| [JSON Parser](./json-parser/index.ts) | String manipulation at the type level |
| [Type Modeled Math](./math/) | 64-bit arithmetic implemented in pure types |
| [TEEP](./cpu/ref.md) | Type Encoded Expressions Processor. A full 64-bit RISC CPU |

## FAQ
### how is this possible?
typescript types are turing complete, there are no limitations, only your ram and sanity.

### how this is made?
using DUY (do the universe yourself), a type engineering degree and and a bit of dark magic. 

### why?
just for fun, and a humble question.

### is this a good learning resource?
**If you are looking for standard typeScript**: You are in the wrong place.    
**If you are looking for forbidden type magic**: want to learn how to remodel the universe using nothing but `infer` and recursion, welcome home.

### what it costs?
nothing, just recursive infered pain and execcively deep existencial rethinking.     
no compilers were harmed in the making of this repo.

### is there more to come?
probably, yes, this is still the beginning.

## looking for interesting places?
- helpful places for possible use cases: [json parser](./json-parser/index.ts), [utils](./common/utils.ts), [string utils](./common/string.ts).
- normal code: [table generators](./scripts/gen/math.ts).
- simplest place: [html parser](./html-parser/index.ts), [comparision logic](./math/comp.ts), [utils](./common/utils.ts).
- where the: [numbers lives](./math/format.ts), [teep beats](./cpu/index.ts), [tables constructed](./scripts/gen/math.ts).
- best of: [switch statements](./cpu/dpr.ts), [block operations](./math/shift.ts), [loop unrolling](./math/arith.ts), [string pattern matching](./json-parser/index.ts), [straightforward logic](./math/logic.ts).
- table towers: [format tables](./math/format_tables.ts), [math tables](./math/tables.ts).
- dangerous places: [division section](./math/arith.ts).
