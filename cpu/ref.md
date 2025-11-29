# under progress
# TEEP
TEEP (type encoded expressions processor) is a simple 64 bit risc cpu emulated in typescript types.

**features**:
- little endian 64 bit word.
- 32 64 bit registers (R0-R31), with a zero register (R0).
- fixed 32 bit instructions, mostly 3 oprand (2 src and a dst) simple operations.
- wide range of instructions, including bitfields, conditional operations and various bitwise operations.
- 16 bit conditions register.
- harvard architecture, separate data and instruction memory.
- 16 bit address bus, referring to 65536 words (64 bit).

# instruction set
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 op0  **** **** **** **** **** **** ****
```

**`op0`**: primary group (4 bit)
- **`0`**: dpr (data processing register)
- **`1`**: dpi (data processing immediate)
- **`2`**: mem (memory)
- **`3`**: branch

# DPR (data processing register)
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    op1  **** **** **** **** **** **** 
```

**`op1`**: major group (4 bit)
- **`0`**: 3 regs
- **`1`**: 2 regs
- **`2`**: 4 regs
- **`3`**: other

## 3 regs
instructions that use 3 registers
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    0    op2  **** **** **** **** **** 
```

**`op2`**: minor group (4 bit)

### op2: 0
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    0    0    op3  0dst   src1  src2
```

| `op3` | opcode | description |
| ----- | ------ | ----------- |
| **`and`** | `0` | bitwise and of `src1` and `src2` |
| **`or`** | `1` | bitwise or of `src1` and `src2` |
| **`xor`** | `2` | bitwise xor of `src1` and `src2` |
| **`imply`** | `3` | bitwise imply of `src1` and `src2` |
| **`nand`** | `4` | bitwise nand of `src1` and `src2` |
| **`nor`** | `5` | bitwise nor of `src1` and `src2` |
| **`xnor`** | `6` | bitwise xnor of `src1` and `src2` |
| **`bcr`** | `7` | bit clear of `src1` with `src2` |
| **`add`** | `8` | add `src1` with `src2` |
| **`sub`** | `9` | sub `src1` with `src2` |
| **`addc`** | `10` | add with carry (cond0) `src1` with `src2`, saving carry |
| **`subc`** | `11` | sub with carry (cond0) `src1` with `src2`, saving carry |
| **`shl`** | `12` | shift left `src1` by `src2` mod 64 |
| **`shr`** | `13` | shift right `src1` by `src2` mod 64 |
| **`sar`** | `14` | arithmetically shift right `src1` by `src2` mod 64 |
| **`rol`** | `15` | rotate left `src1` by `src2` mod 64 |

### op2: 1
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    0    1    op3  0dst   src1  src2
```

| `op3` | opcode | description |
| ----- | ------ | ----------- |
| **`max`** | `0` | signed maximum of `src1` and `src2` |
| **`min`** | `1` | signed minimum of `src1` and `src2` |
| **`umin`** | `2` | unsigned minimum of `src1` and `src2` |
| **`umax`** | `3` | unsigned maximum of `src1` and `src2` |

### op2: 2
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    0    2    cond 0dst   src1  src2
```

**`csel`**: conditional select `src1` if condition `cond` is `1`, else `src2`

## 2 regs
instructions that use 2 registers
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    1    op2  **** **** **** **** **** 
```

**`op2`**: minor group (4 bit)

### op2: 0
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    1    0    op3  0    0 dst   src 
```
| `op3` | opcode | description |
| ----- | ------ | ----------- |
| **`cnb`** | `0` | count of `1` bits in `src` |
| **`cnz`** | `1` | count of `0` bits in `src` |
| **`abs`** | `2` | absolute value of `src` |
| **`cls`** | `3` | count leading (to left) sign bits in `src` |
| **`ctz`** | `4` | count trailing (to right) `0` bits in `src` |
| **`cto`** | `5` | count trailing (to right) `1` bits in `src` |
| **`clz`** | `6` | count leading (to left) `0` bits in `src` |
| **`clo`** | `7` | count leading (to left) `1` bits in `src` |
| **`rev`** | `8` | reverse bits of `src` |
| **`rev8`** | `9` | reverse 8 bit sections of `src` |
| **`rev16`** | `10` | reverse 16 bit sections of `src` |
| **`rev32`** | `11` | reverse 32 bit sections of `src` |
| **`se8`** | `12` | 8 bit sign extend of `src` |
| **`se16`** | `13` | 16 bit sign extend of `src` |
| **`se32`** | `14` | 32 bit sign extend of `src` |

### op2: 1
```
op3: 0-5
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    1    1    op3  cond 0 dst   src 

op3: 6-14
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    1    1    op3  cond 0 src1  src2 
```
| `op3` | opcode | description |
| ----- | ------ | ----------- |
| **`cinc`** | `0` | increment `src` if condition `cond` is `1`, else return `src` |
| **`cinc.n`** | `1` | increment `src` if condition `cond` is `0`, else return `src` |
| **`cnot`** | `2` | invert `src` if condition `cond` is `1`, else return `src` |
| **`cnot.n`** | `3` | invert `src` if condition `cond` is `0`, else return `src` |
| **`cneg`** | `4` | negate `src` if condition `cond` is `1`, else return `src` |
| **`cneg.n`** | `5` | negate `src` if condition `cond` is `0`, else return `src` |
| **`noner`** | `6` | set condition `cond` to `1` if all bits in `src1` specified by `src2` is `0` |
| **`anyr`** | `7` | set condition `cond` to `1` if any bit in `src1` specified by `src2` is `1` |
| **`allr`** | `8` | set condition `cond` to `1` if all bits in `src1` specified by `src2` are `1` |
| **`comp.eq`** | `10` | set condition `cond` to `1` if `src1` is equal to `src2` |
| **`comp.ne`** | `11` | set condition `cond` to `1` if `src1` is not equal to `src2` |
| **`comp.gt`** | `12` | set condition `cond` to `1` if `src1` is greater than `src2` |
| **`comp.le`** | `13` | set condition `cond` to `1` if `src1` is less than or equal to `src2` |
| **`ucomp.gt`** | `14` | set condition `cond` to `1` if `src1` is unsignly greater than `src2` |
| **`ucomp.le`** | `15` | set condition `cond` to `1` if `src1` is unsignly less than or equal to `src2` |

## 4 regs
instructions that use 4 registers

```
op2: 0-1, 4-5
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    2    op2  dst   src1  src2  src3

op2: 2-3
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    2    op2  dst1  dst2  src1  src2
```
| `op2` | opcode | description |
| ----- | ------ | ----------- |
| **`madd`** | `0` | multiply `src2` with `src3`, then add the product with `src1` |
| **`msub`** | `1` | multiply `src2` with `src3`, then subtract the product from `src1` |
| **`mulf`** | `2` | multiply `src1` with `src2` and store the full 128 bit product in `dst1` (low) and `dst2` (high) |
| **`divf`** | `3` | divide `src1` with `src2` and store the quotient in `dst1` and the reminder in `dst2` |
| **`add3`** | `4` | addition of `src1`, `src2` and `src2` |
| **`fush`** | `5` | funnel left shift of `src1` by `src2` mod 64, taking `src3` as carry in |

## others
other DRP instructions

```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    3    0    op2  0    0    0  reg   
```
| `op2` | opcode | description |
| ----- | ------ | ----------- |
| **`mov reg, conds`** | `0` | move the condition register into `reg` |
| **`mov conds, reg`** | `1` | move `reg` into the condition register |

# DPI (data processing immediate)
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 1    op1  **** **** **** **** **** **** 
```

**`op1`**: major group (4 bit)
- **`0` - `3`**: 12 bit low immediate 
- **`4`**: bitfield
- **`6`**: move wide
- **`7`**: conditions
- **`8`**: shifts

## 12 bit low immediate
instructions having a second source of 12 bit immediate value
```
op: 0-10
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 1    op     dst   src1   imd

op: 12-15
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 1    op     cond 0src1   imd
```

| `op` | opcode | description |
| ---- | ------ | ----------- |
| **`and`** | `0` | bitwise and of `src1` and immediate |
| **`or`** | `1` | bitwise or of `src1` and immediate |
| **`xor`** | `2` | bitwise xor of `src1` and immediate |
| **`imply`** | `3` | bitwise imply of `src1` and immediate |
| **`nand`** | `4` | bitwise nand of `src1` and immediate |
| **`nor`** | `5` | bitwise nor of `src1` and immediate |
| **`xnor`** | `6` | bitwise xnor of `src1` and immediate |
| **`bcr`** | `7` | bit clear of `src1` with immediate |
| **`add`** | `8` | addition of `src1` with immediate |
| **`sub`** | `9` | subtraction of `src1` with immediate |
| **`sub`** | `10` | subtraction of immediate with `src1` |
| **`comp.eq`** | `12` | set condition `cond` to `1` if `src1` is equal to `imd` |
| **`comp.ne`** | `13` | set condition `cond` to `1` if `src1` is not equal to `imd` |
| **`comp.gt`** | `14` | set condition `cond` to `1` if `src1` is greater than `imd` |
| **`comp.lt`** | `15` | set condition `cond` to `1` if `src1` is less than `imd` |

## bitfield
```
 0            1            2           3
 0123 4567 89 01 2345 6789 0123 4567 8901
 1    4    op dst   src1   offset width
```

| `op` | opcode | description |
| ---- | ------ | ----------- |
| **`bext`** | `0` | bitfield extract a section at `offset` and of `width` from `src` into low of `dst` |
| **`bins`** | `1` | bitfield insert a section of `width` from `src` into `dst` at `offset`, keeping unaffected bits |

## move wide
```
 0            1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 1    6    op dst    imd

op: 0 12
	k sh
```
move 16 bit immediate (`imd`) into `dst`, optionally shifting left by `sh` * 16    
**variants**:
- **`mov` (`k` = `0`)**: move while clearing surroundings
- **`movk` (`k` = `1`)**: move while keeping surroundings 

## conditions
instructions working on conditions
```
 0            1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 1    7    op2  cond mask
```
| `op2` | opcode | description |
| ----- | ------ | ----------- |
| **`none`** | `0` | set condition `cond` to `1` if all the conditions specified by `mask` are `0` |
| **`any`** | `1` | set condition `cond` to `1` if any of the conditions specified by `mask` is `1` |
| **`all`** | `2` | set condition `cond` to `1` if all the conditions specified by `mask` are `1` |
| **`only`** | `3` | set condition `cond` to `1` if only one of the conditions specified by `mask` is `1` |

### op2: 4
```
 0            1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 1    7    4    op3  mask
```
| `op3` | opcode | description |
| ----- | ------ | ----------- |
| **`ncond`** | `0` | negate conditions specified by `mask` |

## shifts
shift by immediate	instructions 
```
 0            1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 1    8    0    op3  sh     dst   src
```
| `op3` | opcode | description |
| ----- | ------ | ----------- |
| **`shl`** | `0` | shift left `src` by `sh` |
| **`shr`** | `1` | shift right `src` by `sh` |
| **`rol`** | `2` | rotate left `src` by `sh` |
| **`sar`** | `3` | arithmetic shift right `src` by `sh` |

# memory
```
 0            1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 2    op1  oprand

oprand (base + index):
 0           1            2
 0123 4567 8901 2345 6789 0123
 0reg   base  index  0    0

oprand (base + offset):
 0           1            2
 0123 4567 8901 2345 6789 0123
 10reg   base   offset
```
`oprand`: endcode the address of the memory location, it can be:
- **base + index**: a word aligned base register + a size aligned index register
- **base + offset**: a word aligned base register + a size aligned 12 bit immediate

sizes less than word are indexed within memory words.

| `op1` | opcode | description |
| ----- | ------ | ----------- |
| **`ldr`** | `0` | load a word from memory into `reg` |
| **`ldr.32`** | `1` | load a 32 bit number from memory into `reg` |
| **`ldr.16`** | `2` | load a 16 bit number from memory into `reg` |
| **`ldr.8`** | `3` | load a 8 bit number from memory into `reg` |
| **`ldr.s32`** | `5` | load a sign extended 32 bit number from memory into `reg` |
| **`ldr.s16`** | `6` | load a sign extended 16 bit number from memory into `reg` |
| **`ldr.s8`** | `7` | load a sign extended 8 bit number from memory into `reg` |
| **`str`** | `8` | store a word in `reg` into memory |
| **`str.32`** | `9` | store a 32 bit number in `reg` into memory |
| **`str.16`** | `10` | store a 16 bit number in `reg` into memory |
| **`str.8`** | `11` | store a 8 bit number in `reg` into memory |

# branch
```
 0            1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 3    0    0  link   imd
```
**`jpl imd`**: save `pc` to `link` register then jump to `imd`

**`halt`**: stop execution, `imd` is `0xffff`

```
 0            1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 3    0    2    0    0    0 link  reg
```
**`jpl reg`**: save `pc` to `link` register then jump to `reg`

```
 0            1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 3    0    op2  cond adress

address: reg
 0           1
 0123 4567 8901 2345
 0    0    0  reg

address: immediate
 0           1
 0123 4567 8901 2345
 imd
```

| `op2` | opcode | description |
| ----- | ------ | ----------- |
| **`br imd`** | `4` | branch to `imd` if condition `cond` is `1` |
| **`br.n imd`** | `5` | branch to `imd` if condition `cond` is `0` |
| **`br reg`** | `6` | branch to `reg` if condition `cond` is `1` |
| **`br.n reg`** | `7` | branch to `reg` if condition `cond` is `0` |