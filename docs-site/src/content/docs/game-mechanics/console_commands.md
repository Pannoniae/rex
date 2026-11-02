---
title: Console commands
description: Console commands added by REX and M2EX.
---

This page only lists the console commands that REX and M2EX add. All the original game's console commands still work, but they aren't listed here.

The console opens with the `` ` `` key (left of `1` on most keyboards). Type a command and press Enter. Arguments are separated by spaces. Put an argument in quotes if it contains spaces, such as a unit name.

Some commands only work in a battle, others only on the campaign map. Each command below says which game has it and where it works. In the syntax, `<value>` is required and `[value]` is optional.

## Campaign commands

### add_soldiers

**REX/M2EX** · campaign

```
add_soldiers <character | settlement> <unit type> <amount>
```

Adds soldiers to an existing unit of that type in the character's army or the settlement's garrison.

### adjust_treasury

**REX/M2EX** · campaign

```
adjust_treasury [faction] <multiplier>
```

Multiplies a faction's treasury, so `1.05` gives 105% of the current amount. Without a faction it uses your own.

### ally_desire

**REX** · campaign

```
ally_desire <faction> <target faction>
```

Shows the seven terms of the betrayal score for the alliance between two factions: land desire, strength, common enemy, human difficulty, core attitude, current wars and turns at peace.

### change_character_faction

**REX/M2EX** · campaign

```
change_character_faction <character> <faction>
```

Moves a character to another faction.

### create_assassin

**REX/M2EX** · campaign

```
create_assassin <settlement>
```

Spawns an assassin at the settlement, owned by the settlement's faction.

### create_diplomat

**REX/M2EX** · campaign

```
create_diplomat <settlement>
```

Spawns a diplomat at the settlement, owned by the settlement's faction.

### create_fort

**REX/M2EX** · campaign

```
create_fort <x> <y> <faction> <culture> [variant] [permanent] [name <name>]
```

Creates a fort for the faction at strat map tile (x, y).

- `[variant]` picks the fort type (M2EX only). The default is `wooden_fort`.
- `permanent` makes a permanent fort.
- `name <name>` names the fort. A bare name is a localisation key from `expanded.txt`; a "quoted" name is used as literal text.

### create_merchant

**M2EX** · campaign

```
create_merchant <settlement>
```

Spawns a merchant at the settlement, owned by the settlement's faction.

### create_resource

**REX/M2EX** · campaign

```
create_resource <x> <y> <resource>
```

Adds a trade resource to strat map tile (x, y).

### create_spy

**REX/M2EX** · campaign

```
create_spy <settlement>
```

Spawns a spy at the settlement, owned by the settlement's faction.

### cull_faction

**M2EX** · campaign

```
cull_faction <faction>
```

Disbands every named general of the faction, and the field army each one leads. The leader, the heir and their direct paternal line are kept. Governors' garrisons are left intact.

### decimation_army

**REX/M2EX** · campaign

```
decimation_army <character> <percent>
```

Reduces every unit in the character's army by the given percent (1 to 100).

### destroy_building

**REX/M2EX** · campaign

```
destroy_building <settlement> <building level>
```

Destroys a building in the settlement. Building level names come from `export_descr_buildings.txt`.

### destroy_fort

**REX/M2EX** · campaign

```
destroy_fort <x> <y>
```

Removes the fort at strat map tile (x, y). It fails if the fort has a garrison.

### destroy_selected_fort

**REX/M2EX** · campaign

```
destroy_selected_fort
```

Removes the fort selected in the UI. It fails if no fort is selected or the fort has a garrison.

### display_message

**REX/M2EX** · campaign

```
display_message <message id>
```

Shows a custom event message from `custom_messages.txt`.

### downgrade_building

**REX/M2EX** · campaign

```
downgrade_building <settlement> <building level>
```

Downgrades a building by one level. A building that is already at its lowest level is destroyed.

### dump_region_names

**REX/M2EX** · campaign

```
dump_region_names
```

Writes the current region and settlement names, including in-game renames, to `<mod>/data/text/<language>/<campaign>_regions_and_settlement_names.dump.txt`. The file is ready to drop back into the mod.

### give_settlement

**REX/M2EX** · campaign

```
give_settlement <faction> <settlement>
```

Gives the settlement to the faction. This doesn't count as a diplomatic transgression.

### go_to_capital

**REX/M2EX** · campaign

```
go_to_capital <faction>
```

Moves the camera to the faction's capital.

### go_to_char

**REX/M2EX** · campaign

```
go_to_char <character>
```

Moves the camera to the character.

### go_to_pos

**REX/M2EX** · campaign

```
go_to_pos <x> <y>
```

Moves the camera to strat map tile (x, y).

### go_to_sett

**REX/M2EX** · campaign

```
go_to_sett <settlement>
```

Moves the camera to the settlement.

### kill_army

**REX/M2EX** · campaign

```
kill_army <character>
```

Kills the army led by the character. If the character has no army, only the character dies.

### remove_ancillary

**REX** · campaign

```
remove_ancillary <character> <ancillary>
```

Removes an ancillary from the character. The original M2TW already has this command.

### remove_resource

**REX/M2EX** · campaign

```
remove_resource <x> <y>
```

Removes the trade resource at strat map tile (x, y).

### rename_faction, rename_fort, rename_region, rename_settlement

**REX/M2EX** · campaign

```
rename_faction <faction> <name>
rename_region <region> <name>
rename_settlement <settlement> <name>
rename_fort <x> <y> <name>
```

Renames a faction, region, settlement or the fort at strat map tile (x, y). Regions use their `descr_regions.txt` name. A bare name is a localisation key from `expanded.txt`; a "quoted" name is used as literal text.

### replen_all_forts

**REX/M2EX** · campaign

```
replen_all_forts [faction] <percent> [owner] [not_siege]
```

Replenishes the units garrisoned in the faction's forts by the given percent of their full size (1 to 100). Generals' bodyguards are skipped. Without a faction it uses your own.

- `owner` only replenishes forts in regions the faction owns.
- `not_siege` skips forts that are under siege.

### replen_soldiers

**REX/M2EX** · campaign

```
replen_soldiers <character | settlement> <percent>
```

Replenishes the units in the character's army or the settlement's garrison by the given percent of their full size (1 to 100). Generals' bodyguards are skipped.

### set

**REX/M2EX** · campaign

```
set <unit_cost_multiplier | unit_upkeep_multiplier | building_cost_multiplier> [value]
```

Changes one of the `descr_strat.txt` cost multipliers during the campaign. Without a value it shows the current one. The value is saved with the campaign.

### set_heir

**REX/M2EX** · campaign

```
set_heir <character>
```

Makes the character the faction heir.

### set_leader

**REX/M2EX** · campaign

```
set_leader <character>
```

Makes the character the faction leader.

### set_population

**REX/M2EX** · campaign

```
set_population <settlement> <amount>
```

Sets the population of the settlement.

### show_counter

**REX/M2EX** · campaign

```
show_counter <name>
```

Shows the current value of a script counter.

### show_counters

**REX/M2EX** · campaign

```
show_counters
```

Lists all active script counters and their values.

## Battle commands

### battle_time_multiplier

**REX/M2EX** · battle, battle editor

```
battle_time_multiplier [multiplier]
```

Changes how fast time of day and weather move during the battle. `1` is the normal speed and `0` freezes it. Without a value it shows the current multiplier.

### cloud_drift

**REX** · battle, battle editor

```
cloud_drift [0..360]
```

Sets how fast the clouds drift, in degrees per minute at normal battle speed and 10 m/s wind. `0` keeps them still.

### cloud_sunset_rim

**REX** · battle, battle editor

```
cloud_sunset_rim [0..2]
```

Sets how strongly sunset light shines on the edges of the clouds. `0` turns it off.

### freecam

**REX/M2EX** · battle (M2EX also in the battle editor), also in multiplayer

```
freecam [on | off]
```

Toggles the free-fly camera. It can turn 360 degrees on the spot and move up and down with Q and E. Your normal battle camera setting is kept.

### lbc_carry_tune

**REX** · battle

```
lbc_carry_tune <list | select N | next | show | print | done | offset X Y Z | rotate X Y Z | scale S | move axis amount | turn axis degrees | nudge_offset X Y Z | nudge_rotate X Y Z | nudge_scale S | reset | axes [on | off]>
```

A modding tool for live-tuning the props that city civilians carry, such as amphorae and stones.

### lens_flare

**REX** · battle, battle editor

```
lens_flare [on | off]
```

Toggles the original game's lens flare.

### set_time

**REX/M2EX** · battle, battle editor

```
set_time <hour | HH:MM>
```

Jumps to a time of day, such as `18.5` or `18:30`.

### set_weather

**REX/M2EX** · battle, battle editor

```
set_weather <weather | random> [seconds]
```

Switches to a weather type and holds it. With `[seconds]` it changes gradually over that many battle seconds. `random` returns to the normal weather cycle.

### show_lbw_debug

**REX** · battle

```
show_lbw_debug
```

Toggles a debug view of the city population: the routes, destinations and attraction areas.

### showtime

**REX/M2EX** · battle, battle editor

```
showtime [on | off]
```

Toggles the battle time display.

### solar_lighting

**REX** · battle, battle editor

```
solar_lighting [0 | 1]
```

`1` makes the lighting follow the real position of the sun. `0` uses the old fixed-clock lighting.

### spawn_projectile

**REX** · battle

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

### vulnerable_general

**REX/M2EX** · battle

```
vulnerable_general <character>
```

Makes the named general vulnerable in battle again.

## Campaign and battle commands

### hide_ui

**REX/M2EX** · campaign, battle

```
hide_ui
```

Hides the UI, like the `hide_ui` script command.

### show_ui

**REX** · campaign, battle

```
show_ui [true | false]
```

Shows the UI again. `show_ui false` hides it. The original M2TW already has this command.

### snd_reload

**REX** · everywhere, also in multiplayer

```
snd_reload
```

Reloads the sound events. The original M2TW already has this command.

### toggle_cursor

**REX/M2EX** · campaign, battle (M2EX also in the battle editor)

```
toggle_cursor
```

Shows or hides the mouse cursor. Input keeps working while it's hidden.

### vram

**REX/M2EX** · campaign, battle

```
vram
```

Shows how much video memory each part of the game uses, plus the total for the process.

## Scripting and debugging

These commands work everywhere, including the editors.

### dump_docudemon

**REX/M2EX**

```
dump_docudemon
```

Writes documentation for the script commands, conditions, events and console commands to the `documentation/` folder.

### imgui_demo

**REX/M2EX**

```
imgui_demo
```

Toggles the Dear ImGui demo window.

### lua, sq

**REX/M2EX**

```
lua <line>
sq <line>
```

Runs one line of Lua (`lua`) or Squirrel (`sq`) code. It runs in the active script runtime, or in a scratch VM when no runtime is running. The reply says which one was used.

### script_reload

**REX/M2EX**

```
script_reload
```

Reloads the scripts from disk. If any entry script fails to load, the running scripts are kept.

### script_run

**REX/M2EX**

```
script_run <file.lua | file.nut>
```

Runs a script file from disk in the live VM. The extension picks Lua or Squirrel. You can run the same file again.

### script_selftest

**REX/M2EX**

```
script_selftest [events | persist | refs]
```

Runs the scripting self-tests, or all of them when no suite is named. The results go to `system.log.txt`.

### script_status

**REX/M2EX**

```
script_status
```

Shows which script VMs are running, what they loaded and what is registered on them.

### snd_debug

**REX**

```
snd_debug
```

Toggles a live sound diagnostics window.
