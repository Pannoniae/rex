---
title: descr_toggles_ex.txt
description: Player-selectable data configurations and options, picked from dropdowns in the Extended Options menu.
---

`data/descr_toggles_ex.txt` lets a mod ship several interchangeable sets of data files for a game feature, and lets players pick one from a dropdown in the **Extended Options** menu (the **Extended Settings** button in the options menus). It also sets up the **Interface** and **Army Size** choices. It works in REX and M2EX.

Each `section` is one game feature and becomes one row of Extended Options. Each `configuration` (or `option`) in it is one entry in that row's dropdown.

## turning it on

The toggles only take effect when `descr_caps_ex.txt` sets:

```
enable_file_toggles  true
```

Without it (the default, so a mod without its own `descr_caps_ex.txt` keeps its own files), every section uses its `classic` configuration. Interface uses `classic` and Army Size uses `20`. The rows still show, greyed out, with a tooltip saying the mod hasn't enabled file toggles.

Every file-based section must have a configuration named `classic`, normally the built-in files. A section without one is ignored.

## format

```
section <SECTION_NAME>
{
  enabled <true|false>
  default <name>

  configuration <name>
  {
    <role> <filename>
    <setting> <value>
    text <KEY>
  }
}
```

| Line | What it does |
|---|---|
| `enabled true` / `false` | `true`: players choose any configuration. `false`: the dropdown shows the default greyed out, and the default is always used. Handy for a mod that wants to force its own files. |
| `default <name>` | The configuration used until a player picks another one, and the one other configurations fall back to. An unknown name uses `classic`. |
| `configuration <name>` | A unique name (not case sensitive). The player's choice is saved by this name, so renaming a configuration resets players to the default. |
| `<role> <filename>` | One line per data file the configuration replaces. Which roles exist depends on the section, see [sections](#sections). |
| `<setting> <value>` | A setting of the configuration, for sections that have them (`BATTLE_TERRAIN`). A setting it leaves out takes its classic value; settings are not taken from the default configuration. |
| `text <KEY>` | The `menu_english.txt` key shown in the dropdown. The configuration's name is shown when it's missing. |

File paths are relative to the `data` folder, and a mod's `data` folder is checked first. Lines starting with `;` are comments.

## options (UI and ARMY_SIZE)

`UI` and `ARMY_SIZE` are choice-only sections: they name no data files, the player's choice is saved in the preferences, and the game acts on the chosen name. They list `option` blocks instead of configurations:

```
section ARMY_SIZE
{
  enabled true
  default 20

  option 20
  {
    text UI_ARMY_SIZE_20
  }

  option 20_40
  {
    text UI_ARMY_SIZE_20_40
  }

  option 40
  {
    text UI_ARMY_SIZE_40
  }
}
```

- The option names are fixed by the game. A mod can't add, rename or remove them; it can only change their `text`, the `default` and `enabled`.
- Every option of the section must be listed, in any order (the dropdown keeps the game's order). A missing option is logged and stops the game with an error naming it.
- An unknown option name, or a line other than `text`, is skipped with a note in the log.
- `text` is optional; without it the game's own text is used.

| Section | Options |
|---|---|
| `UI` | `classic`, `hd` |
| `ARMY_SIZE` | `20`, `20_40`, `40` |

## fallbacks

- A configuration doesn't have to name every role. A role it leaves out uses the default configuration's file, and failing that the section's built-in file.
- Configurations without any file, or with a duplicate name, are skipped with a note in the log. Unknown roles are ignored.
- A section with no usable configuration, a missing section or a missing file falls back to the feature's built-in files, and its row is hidden.
- A mod without its own `descr_toggles_ex.txt` inherits the game's. Its `classic` configurations still read the mod's own built-in files (its own `descr_aerial_map_ground_types.txt`, and so on); the other configurations read the files they name, the mod's copy first. A mod with its own `descr_geography.txt` keeps it over an inherited `descr_geography_ex.txt`. Ship your own `descr_toggles_ex.txt` to describe your own sets.

The file is read once, when the game first needs it.

## where the rows show

Each row's places are fixed by the game, not by this file, because whether a choice can safely change in a given place is an engine property:

| Section | Main menu | Campaign | Battle | Multiplayer |
|---|---|---|---|---|
| `AERIAL_MAP` | yes | yes | no | no |
| `BATTLE_TERRAIN` | yes | yes | no | no |
| `BATTLE_GROUND_COVER` (REX) | yes | no | yes | yes |
| `BATTLE_WATER` | yes | yes | no | no |
| `UI` | yes | yes | yes | yes |
| `ARMY_SIZE` | yes | no | no | no |

- **Main menu** is **Options** > **Extended Settings** on the main menu; **Campaign** and **Battle** are **Extended Settings** in the in-game options menu.
- In a multiplayer game only the rows marked **Multiplayer** show. Multiplayer games pick their army size on the host page instead.
- Rows that don't show leave no gap: the rows below move up.
- A row the mod has locked (`enabled false`, or `enable_file_toggles` off) shows its value greyed out, with a tooltip saying why.
- When every row of a menu is locked, the **Extended Settings** button that opens it is greyed out too, with a tooltip saying the mod hasn't enabled any extended options.

## sections

| Section | Feature | Roles | Guide |
|---|---|---|---|
| `AERIAL_MAP` | Campaign map terrain. Changing it in a campaign reloads the terrain straight away. | `ground_types`, `tile_models` | [Campaign terrain](../campaign_terrain/) |
| `BATTLE_TERRAIN` | Battle map terrain. Applies from the next battle. | `geography`, plus the settings `tiling`, `anti_tiling`, `smooth_blend`, `normal_strength`, `far_tiling`, `far_tiling_range` | [HD terrain](../hd_terrain/) |
| `BATTLE_GROUND_COVER` | REX only. Battle grass. Applies at once, also during a battle. | `ground_cover` | |
| `BATTLE_WATER` | Battle water. Applies at once; the water never changes under a running battle. In multiplayer every player needs the same water configuration and file. | `water` (`none` for the classic water), `effects` | [descr_water_ex.txt](../descr_water_ex/), [water effects](../water_effects/) |
| `UI` | Interface style, classic or HD. Applies at once. | none, see [options](#options-ui-and-army_size) | |
| `ARMY_SIZE` | Army size: `20` (20 everywhere), `20_40` (20 on the campaign, up to 40 in a large battle) or `40` (40 everywhere). | none, see [options](#options-ui-and-army_size) | |

The comments at the top of the shipped `descr_toggles_ex.txt` describe every role and setting in detail.

### army size and the settlement browser (M2EX)

In M2EX the army size also sets the settlement browser layout and the settlement queues:

| | 20 and 20/40 (as in the original game) | 40 |
|---|---|---|
| Construction queue | 6 buildings | 9 buildings |
| Recruitment queue | 9 units | 11 units |
| Building and unit cards | original size | smaller, so more fit per row |

The queue limits apply to players and the AI alike.
