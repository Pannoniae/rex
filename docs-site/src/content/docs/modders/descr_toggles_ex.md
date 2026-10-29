---
title: descr_toggles_ex.txt
description: Player-selectable data configurations, picked from dropdowns in the options menus.
---

`data/descr_toggles_ex.txt` lets a mod ship several interchangeable sets of data files for a game feature, and lets players pick one from a dropdown in the options menus. It works in REX and M2EX.

Each `section` is one game feature, and each `configuration` in it is one entry in that feature's dropdown.

## format

```
section <SECTION_NAME>
{
  enabled <true|false>
  default <name>

  configuration <name>
  {
    <role> <filename>
    text <KEY>
  }
}
```

| Line | What it does |
|---|---|
| `enabled true` / `false` | `true`: players choose any configuration. `false`: the dropdown shows the default greyed out, and the default is always used. Handy for a mod that wants to force its own files. |
| `default <name>` | The configuration used until a player picks another one, and the one other configurations fall back to. An unknown name uses the first configuration. |
| `configuration <name>` | A unique name (not case sensitive). The player's choice is saved by this name, so renaming a configuration resets players to the default. |
| `<role> <filename>` | One line per data file the configuration replaces. Which roles exist depends on the section, see [sections](#sections). |
| `text <KEY>` | The `menu_english.txt` key shown in the dropdown. The configuration's name is shown when it's missing. |

File paths are relative to the `data` folder, and a mod's `data` folder is checked first. Lines starting with `;` are comments.

## fallbacks

- A configuration doesn't have to name every role. A role it leaves out uses the default configuration's file, and failing that the section's built-in file.
- Configurations without any file, or with a duplicate name, are skipped with a note in the log. Unknown roles are ignored.
- A section with no usable configuration, a missing section or a missing file falls back to the feature's built-in files, and its dropdown and label are hidden. So a mod without `descr_toggles_ex.txt` behaves exactly as before.

The file is read once, when the game first needs it.

## sections

| Section | Feature | Roles | Guide |
|---|---|---|---|
| `AERIAL_MAP` | Campaign map terrain, the **Campaign Terrain** video option | `ground_types`, `tile_models` | [Campaign terrain](../campaign_terrain/) |
