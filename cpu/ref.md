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
 0    0    0    op3   dst   src1  src2
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
| **`rol`** | `15` | funnel shift left `src1` by `src2` mod 64 |

### op2: 1
```
 0           1            2           3
 0123 4567 8901 2345 6789 0123 4567 8901
 0    0    1    op3   dst   src1  src2
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
 0    0    2    cond  dst   src1  src2
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
 0    1    0    op3  0      dst   src1 
```