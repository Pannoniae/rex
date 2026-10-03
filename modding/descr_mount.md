# descr_mount.txt

This page covers what REX/M2EX changes in `descr_mount.txt`. Everything not listed here works like vanilla. For model pools (`models` block), see [mount_variation.md](mount_variation.md).

## elephants

### rider limit

`riders` for `class elephant` now accepts **1 to 127** (vanilla: 15). Every rider needs its own `rider_offset` line, so `riders 20` means 20 `rider_offset` lines.

But do not forget: a very high rider count means fewer elephants per unit.

### general_offset

Vanilla has no seat for a general or captain on an elephant. If the unit has one, he takes the **second** `rider_offset` slot and the crewman who would have sat there is dropped.

The optional `general_offset` line gives him his own seat instead:

```
general_offset      <x>, <y>, <z>
```

- It only works for `class elephant`.
- It must be placed **directly before the `riders` line**. Anywhere else is a parse error.
- The coordinates work the same as `rider_offset`: x is sideways, y is height and z is forwards/backwards.
- `riders` still only counts the regular crew. The general is an extra rider on top of that.
- If you leave the line out, nothing changes and the general takes slot 2 like in vanilla. Existing mods don't need to touch anything.

#### example

<pre>
type                war elephant
class               elephant
model               elephant
radius              2.5
...
tusk_z              2.5
tusk_radius         0.75
<b><i>general_offset      0.0, 1.335, 2.25</i></b>
riders              3
rider_offset        0.0, 1.635, 1.45
rider_offset        0.0, 1.45, 0.5
rider_offset        0, 1.45, -.25
</pre>

The first elephant of a general's or captain's unit now carries the driver, both crewmen and the general at `general_offset`, so 4 men in total. The other elephants in the unit carry their usual 3. The same mount without the `general_offset` line would carry the driver, the general (in slot 2) and one crewman.

#### how the general is placed

- Slot 1 (the first `rider_offset`) is always the driver.
- The general goes on the **first elephant** of the unit, at `general_offset`.
- Any other officers in the unit are placed the vanilla way, in the rider slots from slot 2 onwards.

#### wrong placement

These fail to load:

```
riders              3
general_offset      0.0, 1.335, 2.25    <- must come before riders
rider_offset        0.0, 1.635, 1.45
...
```

```
rider_offset        0, 1.45, -.25
general_offset      0.0, 1.335, 2.25    <- must come before riders
```

#### what it's good for

- **Howdah commanders:** put the general on a raised seat or at the front of the howdah without losing a crewman.
- **Big war elephants and towers:** together with the higher rider limit you can build towers full of archers with a commander on top.
- **Spotting the general:** he always sits in the same, distinct spot, so he's easy to find in battle.
