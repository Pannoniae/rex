# Custom battle categories (rulesets)

REX (RTW, BI, Alexander) and M2EX (M2TW, Kingdoms) add **custom battle categories**: named rulesets that limit which units can be recruited in custom battles, both in single player and multiplayer.

A category can:
- allow only certain units, or exclude certain units (`inverse`)
- cap how many units of a group an army may take (`limit`), optionally per faction
- cap how many of each individual unit an army may take (`limit_per_unit`)
- fix the battle setup: money, budget type, maximum experience and weapon/armour upgrades (`battle_setup`)

Categories are defined in `descr_custom_battle_categories.txt`. Nothing is hardcoded, so mods can ship their own rulesets.

## How it works in game

### Choose Conditions screen
The custom battle and multiplayer **Choose Conditions** screens have a **Limit roster** dropdown and an **Inverse** checkbox.

- **Limit roster**: picks a category. Only units allowed by that category can be recruited. *No limitation* turns the feature off.
- **Inverse**: flips the selected category, so allowed units become excluded and excluded units become allowed.
- Hovering an entry shows its tooltip, if the category has one.
- Units that are not allowed are hidden from the recruitment list. Units that already sit in an army and are no longer allowed are removed when the category changes.
- Once a `limit` is used up, the unit card gets the `ui/generic/#generic_unit_card_limit_overlay.tga` overlay and can't be added any more.
- If the category has a `battle_setup` block, the money, experience and upgrade controls are set to those values and capped there.

### Multiplayer
- The **host** picks the category. It is synced to every player by name, and clients can't change it.
- The multiplayer lobby game list has a **RULESET** column, and the game tooltip shows the ruleset too, so players can see the rules before joining.
- `descr_custom_battle_categories.txt`, `custom_locations.txt` and every `world/maps/custom/*/descr_battle.txt` are part of the multiplayer data checksum. All players need identical files, otherwise the game shows as incompatible.
- The category file is reloaded when you enter the multiplayer lobby, so edits apply without restarting the game.

### Location lock
A custom battle location or map can force a category with `lock_category`; see [Locking a category to a location](#locking-a-category-to-a-location). A location lock overrides whatever the player picked in the dropdown.

### Shipped rulesets

**RTW / BI / Alexander**

| Category | Rules |
|---|---|
| `no_siege_engines` | No siege engines. |
| `CWB` | Clan War Belt: 15k per player, no artillery or elephants, max 8 cavalry, 8 foot archers/slingers, 2 horse archers, 2 berserkers, max 6 of any one unit. |
| `31k` | 31k per player, no artillery, 6 cavalry (10 for horse factions), 2 horse archers, elephants only for one faction (2), 3 berserkers. |
| `31k_4_archers` | `31k`, plus max 4 foot archers/slingers. |
| `31k_no_archers` | `31k` without archers and horse archers. Javelin skirmishers are still allowed. |

BI and Alexander have their own copy of the file, because their unit lists use different unit names.

**M2TW**: `no_siege_engines`, `m2_6_2`, `m2_6_2_pikes`, `m2_5_2`.

---

## Modders

### File layout

| File | Purpose |
|---|---|
| `data/descr_custom_battle_categories.txt` | The category definitions. A copy in a mod or expansion `data` folder overrides the base game file. |
| `data/custom_locations.txt` | Optional `lock_category` line per custom location. |
| `data/world/maps/custom/<map>/descr_battle.txt` | Optional `lock_category` line per custom battle map. |
| `data/text/menu_english.txt` | Text for `label` and `tooltip` keys (every language folder). |
| `data/ui/generic/#generic_unit_card_limit_overlay.tga` | Overlay drawn on a unit card once its limit is used up. |
| `data/menu/Rome.lnt` (RTW) / `data/menu/mtw2.lnt` (M2TW) | Menu layout containing the dropdown (`UIP_CUSTOM_CATEGORY`) and Inverse toggle (`UIP_CUSTOM_CATEGORY_EXCLUDE`). |

Where the vanilla files live:

| Game | Category file |
|---|---|
| RTW | `data/descr_custom_battle_categories.txt` |
| BI | `bi/data/descr_custom_battle_categories.txt` |
| Alexander | `alexander/data/descr_custom_battle_categories.txt` |
| M2TW and Kingdoms | `data/descr_custom_battle_categories.txt` |

If the category file is missing, the dropdown only shows *No limitation*.

> **Unit names must match the active `export_descr_unit.txt`.** A mod with its own unit list needs its own category file. An unknown `unit`, mount or engine name is a load error.

### File format

The rules are:
- Every entry is on its own line, and every `{` and `}` is on its own line.
- Lines starting with `;` are comments.
- Category names are a single word; use underscores instead of spaces.
- Unknown keywords, unknown names or a missing `}` are load errors that show the file and line.

```
category_name
{
  inverse                    ; optional
  hidden                     ; optional
  label    <TEXT_KEY>        ; optional
  tooltip  <TEXT_KEY>        ; optional

  unit_type { ... }
  mount { ... }
  engine { ... }
  unit <unit type>
  limit <N> { ... }
  limit_per_unit <N> { ... }
  limit_per_unit <N>
  battle_setup { ... }
}
```

`inverse`, `hidden`, `label` and `tooltip` must come first, in this order, and each one at most once. Everything after them may be in any order.

#### Header keywords

| Keyword | Meaning |
|---|---|
| `inverse` | The listed units are **excluded** instead of allowed. Units inside a `limit` block stay allowed (up to the limit) unless an explicit rule also excludes them. |
| `hidden` | The category is not listed in the dropdown, but `lock_category` can still use it. |
| `label <KEY>` | Text key from `menu_english.txt` shown in the dropdown. Without a label, the category name is shown. |
| `tooltip <KEY>` | Text key from `menu_english.txt` used as the dropdown tooltip. |

#### Unit selectors
Every selector **adds** units; a category is the union of everything listed in it. Duplicates are ignored.

```
unit_type                  ; ANY listed category AND ANY listed class
{                          ; leave category or class out to match all of them
  category  cavalry      ; infantry, cavalry, siege, handler, ship, non_combatant
  class     missile      ; light, heavy, missile, spearmen, skirmish
}

mount                      ; ANY listed mount OR mount class
{
  type   medium horse    ; from descr_mount.txt, may contain spaces
  class  elephant        ; horse, camel, elephant, chariot, ...
}

engine                     ; ANY listed engine OR engine class
{
  type   repeating_ballista   ; from descr_engines.txt
  class  onager
}

unit  roman archer         ; a single unit type from export_descr_unit.txt
```

#### Limits

```
limit 8                    ; at most 8 units from this block per army
{
  unit_type
  {
    category  cavalry
  }
  faction parthia 10     ; optional per faction override (0 = unavailable)
  faction scythia 10
}

limit_per_unit 2           ; at most 2 of EACH unit type inside the block
{
  unit  barb berserker german
  unit  barb chariot light briton
}

limit_per_unit 6           ; standalone form: at most 6 of every unit type
```

- Units inside a `limit` block are allowed, up to the limit.
- `limit 0` with `faction` overrides makes units available only to those factions. For example, elephants only for Numidia:

```
limit 0
{
  mount
  {
    class  elephant
  }
  faction numidia 2
}
```

#### Battle setup
Optional, at most once per category. `inverse` doesn't affect it.

```
battle_setup
{
  max_money 15000 individual_budget    ; fixed money; budget is optional
  max_exp 3                            ; 0-9 chevrons
  max_attack 1                         ; 0-3 weapon upgrade
  max_defense 1                        ; 0-3 armour upgrade
}
```

- `shared_budget` (default) splits the money between allied players. `individual_budget` gives every player the full amount.
- Every entry also accepts a block form with per faction values:

```
max_money individual_budget
{
  default 31000
  faction parthia 40000
}
max_exp
{
  default 3
  faction romans_julii 1
}
```

#### Full example

```
; 15k, no artillery/elephants, max 8 cavalry, 2 horse archers, max 6 of any unit
my_ruleset
{
  inverse
  label   MY_RULESET
  tooltip MY_RULESET_TOOLTIP

  unit_type
  {
    category  siege
  }
  mount
  {
    class  elephant
  }
  limit 8
  {
    unit_type
    {
      category  cavalry
    }
  }
  limit 2
  {
    unit  barb horse archers scythian
    unit  east horse archer
  }
  limit_per_unit 6
  battle_setup
  {
    max_money 15000 individual_budget
  }
}
```

`menu_english.txt` (every language folder):

```
{MY_RULESET}My ruleset
{MY_RULESET_TOOLTIP}15k, no artillery or elephants, max 8 cavalry and 2 horse archers.
```

### Locking a category to a location

```
lock_category <category_name> [exclude]
```

- `<category_name>` is the **name** from `descr_custom_battle_categories.txt`, not its label. Hidden categories work as well.
- `exclude` (optional) inverts the category, the same as ticking **Inverse**.
- An unknown category name is ignored, and the location then has no lock.
- While a location with a lock is selected, the lock replaces the player's dropdown choice. Units the lock doesn't allow are removed from every army.
- Both files are part of the multiplayer checksum.

#### In `custom_locations.txt`

Put `lock_category` **after** the other location lines (`location`, `image`, `sett_locked`, `climate`, `summer`) and before the blank line that ends the entry.

RTW:

```
custom_location	Thermopylae

location	120, 85
image		data/menu/custom_locations/thermopylae.tga
sett_locked	no
summer		yes
lock_category	no_siege_engines

custom_location	Alesia
...
```

M2TW (with `climate`):

```
custom_location	Hattin

location	180, 60
image		data/menu/custom_locations/hattin.tga
sett_locked	no
climate		sandy_desert
summer		yes
lock_category	m2_6_2 exclude

custom_location	...
```

#### In `world/maps/custom/<map>/descr_battle.txt`

Put `lock_category` on the line **directly after the header line**, or after the optional `rand` line if the file has one. It must come before `playable`.

```
battle		thermopylae_custom
lock_category	31k

playable
  romans_julii
  greek_cities
end
...
```

With a `rand` line and `exclude`:

```
battle		my_custom_map
rand		0.0
lock_category	no_siege_engines exclude

playable
  ...
```

### Tips
- Use an `inverse` category with a few `limit` blocks for competitive rulesets; it is usually much shorter than listing every allowed unit.
- In an `inverse` category, an explicit rule (for example `unit_type { category siege }`) always wins over a `limit` block that also matches the unit.
- Use `hidden` categories for map-specific rules you don't want in the dropdown.
- Add new text keys at the **bottom** of every `menu_english.txt`, in every language folder.
- Multiplayer players need identical category, location and map files. Ship them together in your mod.
