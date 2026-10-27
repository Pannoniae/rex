---
title: descr_water_ex.txt
description: The modern battle water of REX and M2EX, how to turn it on and every setting of descr_water_ex.txt.
---

REX and M2EX can replace the original battle water with modern water. It has:

- rolling waves driven by the wind, from glassy calm to a stormy sea;
- real depth, so you see the sea floor through shallow water and it gets darker and murkier the deeper it goes;
- reflections of the sky, the land, the units and the buildings;
- foam on the breaking waves, and waves breaking along the beach with wet sand behind them;
- rivers that flow downstream, with foam where they bend;
- colours per climate, ground type, season and weather, fading smoothly when the weather changes;
- swimming soldiers and mounts riding the waves.

It is configured in `data/descr_water_ex.txt`. How the water reacts to soldiers, missiles and rain (ripples, foam trails, rain splashes) is set in a separate file, [descr_water_effects_ex.txt](../water_effects/).

## turning it on

The modern water is switched on in `data/descr_ex.txt`:

```
; Battle water: false = classic water, true = modern water configured in descr_water_ex.txt
water_ex true
```

- `true` = the modern water, `false` = the original water.
- The shipped files have it on.
- `descr_ex.txt` is read when the game starts, so restart the game after changing it.
- `descr_water_ex.txt` is optional. Without it, the modern water uses the built-in defaults listed below.

For the best look, keep the **Reflections** video option on. Without it, the water only reflects the sky colours.

### multiplayer

`descr_water_ex.txt` and `descr_underwater.txt` are part of the multiplayer game data check while the modern water is on. All players need identical files and the same `water_ex` setting to join a game. The files aren't reloaded during a multiplayer battle.

## reloading without restart

`descr_water_ex.txt` is reloaded automatically when you save it, even in the middle of a battle. Tweak a value, save, and watch the water change. The only exceptions are the [sea floor settings](#sea-floor), which apply from the next battle.

## file layout

Settings are written as `name value`. Colours are `red, green, blue` from 0 to 255. Comments start with `;`.

The settings are grouped in blocks, so the water can look different per climate, season, ground type and weather:

```
default
{
    settings

    season <names | all>       { settings and blocks }
    ground_type <names | all>  { settings, weather blocks }
    weather <names | all>      { settings }
    river                      { settings }
    ambient                    { settings, texture blocks }
}

climate <names | all>
{
    the same blocks and settings
}
```

| Block | What it matches |
|---|---|
| `default` | Every battle. The base of everything else. |
| `climate` | Climate names from `descr_climates.txt`. Layered on top of `default`. |
| `season` | `winter`, `spring`, `summer`, `autumn`. Inside `default` or a `climate` block, layered on top of it, and may hold the same blocks and settings. |
| `ground_type` | The ground type of the water: `fertile_low`, `fertile_medium`, `fertile_high`, `wilderness`, `mountains_high`, `mountains_low`, `hills`, `forest_dense`, `forest_sparse`, `swamp`, `ocean`, `sea_deep`, `sea_shallow`, `beach`, `impassable_land`, `impassable_sea`. |
| `weather` | The battle's weather (see [weather names](#weather-names)). Inside a `ground_type` block, or directly inside `default`, `climate` or `season` blocks. |
| `river` | One per `default` or `climate` block. River water, layered on top of everything else. |
| `ambient` | One per `default` or `climate` block. The small static water of buildings and landscape (see [ambient water](#ambient-water)). |

How it fits together:

- A block can list several names: `ground_type sea_shallow sea_deep ocean`.
- `all` matches everything not named by another block at the same level.
- Inner blocks inherit every setting they don't set from the outer blocks.
- A matching `climate` block is layered on top of `default`, so a climate only needs the settings it changes.
- A setting set nowhere uses its built-in default.

In M2EX the season is the campaign's current season (from `descr_strat.txt`), the custom battle season, or the start date of a historical battle.

### weather names

| REX (`descr_daytypes.txt`) | M2EX (`weather_db.xml`) | Wind in the shipped file |
|---|---|---|
| `calm`, `hazy`, `light_fog`, `heavy_fog` | `clear`, `clear_arid`, `clear_winter`, `light_fog`, `light_fog_winter`, `heavy_fog`, `heavy_fog_winter` | calm |
| `rain_summer_shower`, `rain_drizzle` | `cloudy`, `cloudy_arid`, `cloudy_winter` | breeze |
| `rain_storm`, `hail_shower`, `snow_falling`, `dust_storm` | `rain`, `snow`, `dusty` | gusts |
| `blizzard`, `jeffs_brain` | `storm`, `blizzard` | gale |

In M2EX, write the spaces of a weather id as underscores (`light fog` = `light_fog`). The waves travel in the direction of the wind the battle's weather starts with.

## settings

### water colour

| Setting | Values | Default | What it does |
|---|---|---|---|
| `shallow_color` | r, g, b | 40, 120, 110 | Colour of water over shallow ground. |
| `deep_color` | r, g, b | 4, 30, 52 | Colour of deep water. |
| `scatter_color` | r, g, b | 20, 110, 100 | Colour of the light shining through the wave crests. |
| `scatter_intensity` | 0-100 | 1.8 | Strength of that light. |
| `foam_color` | r, g, b | 235, 240, 240 | Colour of the foam. Also used by the rain splashes. |
| `color_variation` | 0-1 | 0.35 | Kilometre-wide patches lighten the water this far toward white. 0 = one even colour. |
| `color_noise_size` | metres | 1474 | Size of those patches. |
| `tint_brightness` | 0-4 | 1 | Multiplies `shallow_color`, `deep_color` and `scatter_color`. Meant for `weather` blocks, like darker water under storm clouds. |
| `tint_saturation` | 0-4 | 1 | Saturation of the same three colours. 0 = grey. Also meant for `weather` blocks. |

The tint goes on top of whatever colours the climate and ground type set, and fades with `weather_transition`.

### depth and clarity

| Setting | Values | Default | What it does |
|---|---|---|---|
| `depth_fade` | metres | 8 | Depth over which `shallow_color` blends into `deep_color`. |
| `depth_range` | 1-100 | 5 | Depth in metres at which the water is fully `deep_color` and opaque. Raise it so deeper water keeps getting darker past 5 m. |
| `clarity` | metres | 4 | How far you can see into the water: 1/8 of the light is left after this distance. |
| `shore_softness` | metres | 1.5 | Width of the soft water edge at the shore, used only when the water can't show the sea floor through it. |
| `refraction_scale` | 0-1 | 0.05 | How far the waves bend the view of the sea floor and anything under the water. 0 = straight through. |
| `seabed_fade_start` | metres | 40 | View distance where the water starts turning murky and hiding the sea floor. |
| `seabed_fade_end` | metres | 200 | View distance where the water is 9x murkier than `clarity` says and shows mostly its own colour. Keeps shallow seas dark when zoomed out. The very shallow water at the waterline stays see-through, so the shore always blends into the land. |

### reflection

| Setting | Values | Default | What it does |
|---|---|---|---|
| `reflectivity` | 0-1 | 1 | Strength of the reflection. |
| `roughness` | 0-1 | 0.2 | Surface roughness: blurs the reflections and the sun's highlight. |
| `scene_reflection` | 0-1 | 1 | How much the water mirrors the battle itself (sky, clouds, land, units, buildings) over the plain sky colours. Needs the Reflections video option. 0 = sky colours only. |
| `reflection_roughness_mip_scale` | number | 1.9 | How quickly `roughness` blurs the mirrored battle. 0 = always sharp. |
| `reflection_fade_start` | metres | 150 | Camera height above the water where the mirrored battle starts fading to the plain sky colours. |
| `reflection_fade_end` | metres | 400 | Camera height above the water where only the sky colours are reflected. |
| `reflection_distortion` | 0-1 | 1 | How far the waves swing and break up the mirrored battle. Lower keeps the reflection steadier on choppy water. 0 = a flat mirror. |
| `reflection_wave_mask` | 0-1 | 1 | How much the wave sides facing away from the mirror show the dark water instead of the reflection. Lower = a stronger, less speckled reflection on choppy water. 0 = off. |

### waves

| Setting | Values | Default | What it does |
|---|---|---|---|
| `beaufort` | 0-6 | 2 | Wind strength driving the waves. Decimals blend the two neighbouring sea states (0 = a glassy mirror, 0.3 = tiny ripples). For bigger seas than 6, raise `wave_height` or `wave_scale`. |
| `wave_scale` | 0-10 | 1 | Multiplies the wave size: length and height together. |
| `wave_height` | 0-10 | 1 | Multiplies the wave height only. |
| `wave_length` | 0.1-10 | 1 | Multiplies the wave length only: longer, gentler, slower waves at the same height. |
| `choppiness` | 0-10 | 1 | Multiplies the sideways movement of the waves, making them sharper. |
| `mount_mass_damping` | 0-10 | 0.02 | How much a swimming mount's `mass` (`descr_mount.txt`) calms its ride on the waves. A mount follows 1 / (1 + mass x damping) of the waves: with 0.02, mass 20 follows 71% and mass 2 follows 96%. 0 = every mount follows the waves fully. |

Swimming mounts float on their collision box (`radius` = half its length, `x_radius` = half its width in `descr_mount.txt`). The centre rides the wave below it and the hull tilts when the bow or stern meets a higher wave, so big animals and boats pitch and roll on the waves. Riders stay on the tilting deck.

### foam

| Setting | Values | Default | What it does |
|---|---|---|---|
| `foam_coverage` | 0-1 | 0.3 | Amount of foam on breaking waves. 0 = none. Shore foam comes with `shore_waves`. |
| `foam_texture` | data path, or `none` | a generated pattern | The foam texture, e.g. `terrain/water_ex/foam.tga` (`.dds` is optional, mod folders are searched first). A tiling greyscale DDS: white = foam, black = open water. If it's a colour or DXT file, its red channel is used. The texture shapes the foam; the waves decide where it appears. |
| `foam_tiling` | 0.001-10 | 0.1013 | One repeat of `foam_texture` covers 2 / `foam_tiling` metres (about 19.7 m by default). Higher = smaller foam detail. |
| `foam_normal_strength` | 0-10 | 0 | How strongly the foam's normal map bumps the water under the foam. Try 0.5 to 1. The normal map is the foam texture's `_pbrn` file next to it (`foam.tga` uses `foam_pbrn.tga.dds`). Ignored when there's no `_pbrn` file. |
| `foam_shadow_brightness` | 0-1 | 0.02 | How much sunlight foam keeps in shadows. |

### shore

| Setting | Values | Default | What it does |
|---|---|---|---|
| `shore_waves` | 0-4 | 1 | Breaking waves rolling in along the shore with foam behind them, sized from the swell. 2 = twice as high, 0 = off. Sea battles only; river battles stay calm. |
| `shore_wave_threshold` | metres | 0.4 | Wave height below which there are no shore waves. The wave height is about 0.6 m at beaufort 2, 1.9 at 3, 3.6 at 4 and 6.4 at 5, times `wave_scale` and `wave_height`. |
| `shore_wave_scale` | 0.05-10 | 1 | Length, steepness and reach of the shore waves. |
| `shore_swell` | metres | 0 | Swell rolling in from far out. The shore waves use this height when the local waves are lower, so beaches keep their waves on a calm sea. 0 = only the local waves. |
| `shore_wetness` | 0-1 | 1 | How wet (dark and glossy) the beach gets where the waves run up. 0 = off. Only with shore waves. |
| `swash_transparency` | 0-1 | 1 | The water the waves run up the beach: 1 = clear water, 0 = white foam, in between a blend. Only with shore waves. |
| `swash_fade` | 0.01-5 | 0.5 | Depth in metres over which the swash's white fades out toward the sea. Larger = a longer, softer fade. Only with `swash_transparency` below 1. |
| `shore_blending_peak` | metres | 0 | Water depth up to which the water fully takes the colours of the land's `ground_type` block next to the sea. |
| `shore_blending_fade` | metres | 0 | Depth beyond the peak over which those colours fade back to the sea colours. 0 = off. Keep peak + fade below 5. Not used for rivers. |

`shore_blending` is what makes the water lighter over the sand along a beach: the shipped file gives `ground_type all` lighter colours and blends them into the first few metres of the sea.

### river flow

| Setting | Values | Default | What it does |
|---|---|---|---|
| `flow_speed` | 0-10 | 0.5 | Metres per second rivers flow downstream in the middle, slowing toward the banks. The waves and ripples drift with it. 0 = off. The flow runs from the river's source in `map_features.tga`. |
| `flow_fading` | 0.1-30 | 3 | Seconds after which each of the two drifting copies of the waves restarts. Shorter = less stretched waves on fast rivers, but more visible pulsing. |
| `flow_curvature_foam` | 0-100 | 5 | Foam where the river bends. 0 = off. |
| `flow_curvature_power` | 0.01-10 | 0.5 | How quickly that foam builds up with the bend. |
| `flow_foam_power` | 0.01-20 | 5 | Strength curve of the flow foam. |
| `flow_foam_scale` | 0-100 | 10 | Strength of the flow foam. |
| `flow_foam_threshold` | 0-10 | 0.5 | How much of `foam_texture` the flow foam cuts away. |
| `flow_foam_softness` | 0.01-10 | 1 | Softness of the flow foam's edges. |
| `flow_foam_tiling` | 0.001-100 | 1 | Tiling of the flow foam relative to `foam_tiling`. |

### sea floor

| Setting | Values | Default | What it does |
|---|---|---|---|
| `sea_floor_scale` | 0.1-20 | 1 | Multiplies the depth of the sea floor below sea level. |
| `sea_floor_offset` | 0-500 | 0 | Extra metres of sea floor depth. Fades in over the first 5 m of the original depth, so the coastline keeps its shape. |

These change the battle terrain itself (where soldiers stand or swim), so:

- they apply from the next battle, not mid-battle;
- they're only read from `default`, `climate` and `ground_type` blocks, not `weather` or `river` blocks (the ground type is the nearest sea tile's);
- all players of a multiplayer battle need the same values.

### weather transition

| Setting | Values | Default | What it does |
|---|---|---|---|
| `weather_transition` | 0-3600 | 0 | Seconds of battle time the water takes to fade into the new weather's look when the weather changes during a battle. 0 = at once. |

- The value of the new weather is used, so a `weather` block can set its own.
- Colours, waves and foam blend smoothly, and the fade pauses when the battle is paused.
- The waves keep their length and speed through the fade; only their height, choppiness and foam fade.
- The shipped files use 30 seconds.

### ambient water

| Setting | Values | Default | What it does |
|---|---|---|---|
| `ambient_transparency` | 0-1 | 0 | How much of what lies under the ambient water shows through it. 0 = opaque `shallow_color`, 1 = fully clear, only the reflections remain. |

### debug

| Setting | Values | Default | What it does |
|---|---|---|---|
| `debug_reflection` | 0, 1 | 0 | Shows the raw mirrored battle instead of the water. Magenta means there's nothing to mirror: the Reflections video option is off. |
| `debug_swell` | 0, 1 | 0 | Draws the swell the swimmers ride as a red wire patch, the tilted collision box of swimming mounts in red, and the swell under their bow, centre and stern as green crosses. |

## river water

A `river` block holds the settings for rivers. It's layered on top of everything else, so it only needs what makes rivers different, like calmer waves, no shore waves and murkier water:

```
river
{
    shallow_color               60, 115, 100
    deep_color                  28, 72, 72
    clarity                     2
    beaufort                    0.8
    wave_length                 1.8
    shore_waves                 0
}
```

A `climate` block can have its own `river` block, like the silty rivers of `sandy_desert` in the shipped files.

## ambient water

The `ambient` block is for the small, still water that belongs to buildings and the landscape:

- **REX:** baths, fountains, ponds and oases of buildings and landscape overlays.
- **M2EX:** the water of settlements and landscape packages: lakes, oases, swamps and moats.

This water is drawn as a surface only, with the waves, foam, `shallow_color` and reflections of these settings. It has no depth: no `deep_color`, no flow, no shore waves, no sea floor and no underwater view. `ambient_transparency` sets how much shows through it.

Settings not set in `ambient` come from the sea settings, so set a calm `beaufort` and `foam_coverage` here.

```
ambient
{
    default
    {
        shallow_color           30, 90, 100
        beaufort                1.5
        wave_scale              8
        wave_height             0.2
        foam_coverage           0
        ambient_transparency    0
    }

    texture muddy_water.tga
    {
        shallow_color           52, 90, 77
        ambient_transparency    0.1
    }
}
```

- `default`, or settings written directly in `ambient`, apply to all of it. In REX that's the surfaces textured `cloud_reflection.tga`; in M2EX all package water.
- `texture <names>` applies its settings on top, to the surfaces using those textures. In REX, surfaces with those textures are also turned into ambient water, so you can add any water texture of a building or overlay, e.g. `water_off.tga` or `##overlay_water.tga`. In M2EX, package water uses its normal texture's name (the vanilla packages use `water_bump`).
- Write the texture name like the file, including any `#` / `##` prefix. Folders, case and the `.tga` / `.dds` / `.texture` extension don't matter.
- A climate's `ambient` block is layered on top of default's.

## under the water

`data/descr_underwater.txt` sets the tint and fog you see when the battle camera goes under the water. It uses the same `default` / `climate` / `season` / `ground_type` / `weather` blocks and also reloads when saved.

| Setting | What it does |
|---|---|
| `fade_depth` | Metres below the surface at which `tint` is fully reached. |
| `visibility` | Metres until everything fades into the water colour. |
| `fade_in_depth` | Metres below the surface over which the whole underwater effect fades in. |
| `surface_tint` | r, g, b, a (0-255) just below the surface. |
| `tint` | r, g, b, a (0-255) at `fade_depth` and deeper. |
| `surface_offset` | Top level only, metres. Moves the height treated as the water surface: positive starts the effect higher, negative lower. |

The rgb is also the underwater fog colour. Alpha is a flat overlay on top, so keep it moderate.

To let the camera go under the water at all, set these in `descr_ex.txt`:

```
allow_underwater_camera true
underwater_camera_depth 20.0
```

## textures

Textures are data paths written without `.dds`, so `terrain/water_ex/foam.tga` loads `data/terrain/water_ex/foam.tga.dds`. Mod folders are searched first.

| Texture | What it is |
|---|---|
| `terrain/water_ex/foam.tga` | The shipped foam pattern, used by `foam_texture`. |
| `terrain/water_ex/foam_pbrn.tga` | Its normal map, used by `foam_normal_strength`. |

## examples

### a stormy sea for one climate

```
climate highland
{
    ground_type sea_shallow sea_deep ocean impassable_sea
    {
        beaufort            4
        wave_height         1.3
        foam_coverage       0.6
        shallow_color       22, 60, 78
    }
}
```

### a calm, clear lagoon

```
climate sandy_desert
{
    ground_type sea_shallow
    {
        beaufort            0.5
        clarity             8
        shallow_color       25, 140, 160
        seabed_fade_start   60
        seabed_fade_end     250
    }
}
```

### darker, greyer water in storms

With REX weather names (in M2EX use `storm blizzard`):

```
default
{
    weather rain_storm blizzard
    {
        tint_brightness     0.7
        tint_saturation     0.6
    }
}
```

To keep the water the same colour in every weather, set both tint values to 1 or remove the lines.

### deeper seas for naval battles

```
default
{
    ground_type sea_deep
    {
        sea_floor_offset    25
    }
    ground_type ocean
    {
        sea_floor_offset    50
    }
}
```

This applies from the next battle.
