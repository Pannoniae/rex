---
title: Console commands
description: Console commands added by REX and M2EX.
---

This page only lists the console commands that REX and M2EX add. All the original game's console commands still work, but they aren't listed here.

The console opens with the `` ` `` key (left of `1` on most keyboards). Type a command and press Enter. Arguments are separated by spaces. Put an argument in quotes if it contains spaces, such as a unit name.

Some commands only work in a battle, others only on the campaign map. Each command below says where it works and which game has it.

## Battle commands

### spawn_projectile

**REX** | battle only

```
spawn_projectile <projectile | unit type> [delay]
```

Fires a projectile from the camera at the point under the cursor. If the cursor is out of reach, it fires straight along the camera view. The projectile kills any soldier it hits, friend or foe, including everyone caught in an area blast. Invulnerable generals survive. Buildings and gates take the projectile's normal damage.

- `<projectile>`
- `<unit type>` is a unit type from `export_descr_unit.txt`. It fires that unit's missile weapon with the unit's attack stats and sounds.
- `[delay]` is optional, in seconds (0 to 3600). The projectile hangs where it was spawned and launches after the delay. This gives you time to move the camera to the target and watch it land. The delay counts battle time, so it pauses with the game and follows the game speed.

If the name is neither a projectile nor a unit type, the console lists the valid projectile names.

Examples:

```
spawn_projectile arrow
spawn_projectile big_fiery_boulder 5
spawn_projectile "roman archer"
```
