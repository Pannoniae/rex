---
title: descr_water_effects_ex.txt
description: Interactive battle water effects in REX and M2EX, ripples, foam trails and rain splashes.
---

`data/descr_water_effects_ex.txt` controls how the modern battle water reacts to what happens in it:

- **Ripples**: waves pushed into the water by soldiers, horses, elephants, swimmers, bodies and missiles. They bend the light and reflections on the water, leave a little foam and gently move the surface.
- **Foam trails**: ribbons of foam behind anything that wades or swims. They fade out over time and drift downwind.
- **Rain on the water**: while it rains, every raindrop that lands on the water splashes there and leaves a small ripple.

It works the same in REX and M2EX.

## requirements

- The modern battle water must be on: `water_ex true` in `descr_ex.txt`. With `water_ex false`, or without this file, the original water effects show as before.
- Rain splashes need rain in the battle, and rain splashes switched on in the options.

## reloading without restart

The file is reloaded automatically when you save it, even in the middle of a battle. It only changes visuals, so you can tweak values and watch the result straight away. If something doesn't look right, `system.log.txt` tells you about settings it couldn't read.

## file layout

The file uses the same layout as the original `descr_water_interaction_effects.txt`:

```
settings
{
    definition ripples        { ... }
    definition foam_trails    { ... }
    definition drop_splashes  { ... }
}

effect <name>
{
    type ripple       { parameters }
    type foam_trail   { parameters }
}

effect_set <name>
{
    <effect name>
    <effect name>
}
```

- `settings` holds the settings of each effect type, grouped in **classes**.
- An `effect` is one ripple or foam trail emitter with its own parameters. One effect can have a `type ripple` block, a `type foam_trail` block, or both.
- An `effect_set` lists the effects that play for one game event. Its name decides **when** it plays.
- Ranges are written `[ min max ]`, with a space after `[` and before `]`.
- Comments start with `;`.

## effect sets

The name of an `effect_set` is the name of the original effect set it replaces. A set with an effect that actually runs replaces the game's original effect. A ripple effect runs while the ripples are enabled, and a foam trail effect while the foam trails are. A set you leave out keeps the original.

| Effect set | When it plays | What it replaces |
|---|---|---|
| `soldier_water_trail` | a soldier on foot walking or standing in water | RTW `water_footsteps` and `soldier_water_trail` |
| `horse_water_trail` | a mounted soldier or an animal (horse, camel, elephant, chariot) walking or standing in water | RTW `water_footsteps` and the mount water trails |
| `soldier_swim_trail` | a soldier swimming | RTW `soldier_water_trail` |
| `horse_swim_trail` | a mounted soldier or an animal swimming | the RTW mount water trails |
| `swim_splash` | once: a swimming stroke, or an attack while swimming, hitting the water | the splash rings and drops |
| `body_splash` | once: a body falling into the water (REX) | the splash rings and drops |
| `default_water_set` | once: a missile hitting the water | M2TW `default_water_set`, RTW the splash rings and drops |
| any other name | a mount's `water_trail_effect` from `descr_mount.txt` | that mount's original trail |

The trails are continuous: the effect keeps going while the source is in the water. The others play once per event.

### mount trail sets

Any `effect_set` whose name isn't in the table above belongs to the mounts with that `water_trail_effect` in `descr_mount.txt`. Those mounts use this set both wading and swimming, instead of `horse_water_trail` / `horse_swim_trail`.

The shipped file does this for elephants, so they push a big bow wave and leave a broad wake:

```
effect_set elephant_water_trail
{
        elephant_water_ripple
        elephant_water_foam
}
```

A mount whose `water_trail_effect` has no set of its own here (for example `camel_water_trail` or `chariot_water_trail` in the shipped files) uses `horse_water_trail` and `horse_swim_trail`. This is handy for custom animals, war wagons or ships in mods: give them their own `water_trail_effect` name in `descr_mount.txt` and add a set with that name here. See [descr_mount.txt](../descr_mount/).

## classes

Each effect type has a `definition` in the `settings` block. A definition holds one `default` and any number of named classes:

```
definition ripples
{
    default
    {
        foam        1
    }

    class wading modifies default
    {
        foam        0.6
    }
}
```

- `default` changes the built-in settings of the type. Effects without a `class` line use it.
- `class <name> modifies <parent>` starts as a copy of the parent (`default`, or a class defined earlier) and changes only the settings it lists.
- `class <name>` without `modifies` starts from the built-in settings. An empty class is **off**: its effects show nothing.
- An effect picks its class with a `class <name>` line in its `type` block.

There is only one ripple simulation and one foam trail map, so some settings can't differ per class. They're marked **shared** below. Only the `default` values of shared settings are used, and the log tells you when a class sets one.

The shipped classes:

| Definition | Classes |
|---|---|
| `ripples` | `wading`, `swimming`, `impact` |
| `foam_trails` | `wading`, `swimming`, `wake` (elephants) |
| `drop_splashes` | `drizzle`, `light`, `heavy`, `torrential` (the rain levels) |

## ripples

The ripple simulation is a field of waves in a square window around the point the camera looks at on the water. Effects push waves into it. The waves fade out over the last 5 m of the window.

### definition ripples

| Setting | Values | Default | What it does |
|---|---|---|---|
| `enabled` | `true`, `false` | `true` | In `default`: the whole simulation. In a class: its effects. |
| `quality` | `low`, `medium`, `high`, `ultra` | `high` | **Shared.** Presets: `low` = 64 m window, 256 texels, no foam. `medium` = 64 m, 256. `high` = 64 m, 512. `ultra` = 128 m, 1024: high's detail over four times the area, at about four times the GPU cost. The shipped file uses `ultra`. |
| `world_size` | 8-1024 | 64 | **Shared.** Metres the simulated window covers. |
| `tex_size` | 64-2048 | 512 | **Shared.** Texels per side. A texel is `world_size / tex_size` metres, and waves smaller than a few texels vanish, so keep it near 0.125 m (a 256 m window needs 2048). |
| `distortion` | `true`, `false` | `true` | **Shared.** Simulate the foam of the waves. |
| `foam` | 0-100 | 1 | How much of the waves' foam shows. In a class: the foam of its effects. |
| `normal_strength` | 0-4 | 1 | **Shared.** How much the waves bend the light on the water. The shipped file uses 0.6. |
| `displace_max` | 0-2 | 0.125 | **Shared.** Metres the waves may lift or lower the water close to the camera. |
| `resolve_noise` | 0-10 | 1.5 | **Shared.** How much noise breaks up the waves' shading. |

Advanced simulation constants, 4 values each and **shared**. Change them with care: `drop_force` (7 0 11 1), `back_force` (25 5 -5 2), `damping` (3 0 -1.3 2), `speed` (4 4 4 2), `distortion_params` (0.01 0.2 0.002 8), `noise` (scale and speed, 0.377 0.5).

`quality` sets `world_size`, `tex_size` and `distortion` together. Lines after it can still change each of them.

### type ripple

| Parameter | Values | Default | What it does |
|---|---|---|---|
| `class` | a class name | `default` | Its class of `definition ripples`. |
| `shape` | `sphere`, `box` | `sphere` | `sphere`: a round wave. `box`: a bow wave, a line of waves in front of a box of `size` moving along its length. Box only works for trails; one-shot effects always use a sphere. |
| `radius` | 0.3-100 | 0.5 | Metres. Sphere: the radius of the wave. Box: the width of the wave line. |
| `size` | width length | 1 1 | Metres, box only. |
| `mass` | number | 1 | Multiplies the strength. |
| `strength` | `[ min max ]` | `[ 0.5 1 ]` | Between min and max with the speed of the source (max at `max_speed`). A strength of 1 lifts the water about 0.3 m where the wave starts. Capped at 100. |
| `distortion` | number | 1 | The foam of the wave, times its strength. |
| `max_speed` | m/s | 5 | Speed of the strongest waves. |
| `emit_distance` | metres | 0.5 | Trails: a new wave each time the source moved this far. |
| `emit_period` | seconds | -1 | Trails: a weak wave (strength min) this often while the source stands still. Below 0 = none. |
| `min_spacing` | metres [seconds] | 0 (0.5 s) | At most one wave of this effect per square of this size, that often. 0 = off. Keeps packed units from piling waves on top of each other. |

## foam trails

Foam trails are drawn into a top-down map of foam around the point the camera looks at on the water. Each trail is a ribbon of foam behind its source that fades over time. The fine lace of the foam comes from the water's own `foam_texture` (`descr_water_ex.txt`), just like the foam of the shore waves.

### definition foam_trails

| Setting | Values | Default | What it does |
|---|---|---|---|
| `enabled` | `true`, `false` | `true` | In `default`: all foam trails. In a class: its effects. |
| `tex_size` | 64-4096 | 2048 | **Shared.** Texels per side of the map. A texel is `area / tex_size` metres; keep it near 0.06 m for soldier-sized trails (a 256 m window needs 4096). |
| `area` | 8-2048 | 128 | **Shared.** Metres the map covers. The trails fade out over its last 5 m. |
| `drift` | 0-10 | 0.3 | **Shared.** m/s the foam drifts downwind while the waves pass under it. 0 = the foam stays where it was laid. |
| `fade_in_time` | seconds | 0.1 | Time a trail's foam takes to show. |
| `fade_out_time` | seconds | 8 | Time a trail's foam takes to vanish once laid down. |
| `forward_expand` | number | 4 | How much wider the trail grows while it fades. |
| `quad_height` | metres | 1 | Length of a trail piece. A new piece starts each time the source moved this far. |
| `width_threshold` | metres | 0.1 | The trail's edges moving further than this start a new piece (turns). |
| `tail_fade_in_length` | metres | 1 | The foam fades in over this length behind its start. |
| `foam` | 0-100 | 1 | How much of the trails' foam shows. |
| `mask_tiling` | 1/metres | 0.3 | Tiling of the streak mask along the trail. |
| `foam_tiling` | 1/metres | 0.07 | Tiling of `foam_texture` along the trail. |
| `mask_texture` | data path | built-in | The streak mask (see [textures](#textures)). |
| `foam_texture` | data path | the water's | A texture gently varying the trail's foam over large patches, red or alpha channel. Without one, the water's `foam_texture` of `descr_water_ex.txt` is used. |

Advanced buffer limits, change them with care: `active_vertex_count` (**shared**, 65536), `finalized_vertex_count` (**shared**, 131072), `max_points_per_segment` (**shared**, 24), `enable_gen_muls` (`true`).

### type foam_trail

| Parameter | Values | Default | What it does |
|---|---|---|---|
| `class` | a class name | `default` | Its class of `definition foam_trails`. |
| `width` | 0.01-500 | 1 | Metres, the width of the ribbon. |
| `alpha` | `[ still max ]` | `[ 0 1 ]` | The trail's foam, between still and max with the speed of the source (max at `max_speed`). The water's foam lace shows through as much as the trail's foam. |
| `max_speed` | m/s | 3 | Speed of the strongest foam. |
| `gen_mul` | number | 1 | How fast the trail's foam ages. |
| `foam_mul` | 0-1 | 0 | Shifts the trail's foam from the mask's short streaks (0) to its long streaks (1). |

## rain on the water

`definition drop_splashes` controls the rain splashes on the water. While it rains on the battle, each raindrop that lands on the water splashes there. The splash is a small crown of water torn into drops, and part of the drops also throw up a sprite. The rain then no longer draws its own splash sprite on the water.

Every drop also makes a small ripple where it lands, as strong as the drop is big and fast. Drizzle's drops are about 0.4 times as strong as heavy rain's, torrential rain's about 1.2 times.

The rain falls within about 30 m in front of the camera. While the rain ripples are on, the ripple window stays over the rain instead of following the point the camera looks at.

No splashes fall when it's dry, or with the rain splashes switched off in the options.

### rain levels

The classes of `drop_splashes` are the rain's levels, named after them. A level without its own class uses `default`.

| Class | REX (`descr_daytypes_ex.txt`) | M2EX |
|---|---|---|
| `drizzle` | `rain_drizzle` | the level of the battle's weather |
| `light` | `rain_summer_shower` | |
| `heavy` | `rain_storm` | |
| `torrential` | `jeffs_brain` | |

As the rain builds up to its level, more of the splashes fall.

The shipped levels:

| Class | Crown (m) | Sprite (m) | Opacity | Ripple strength |
|---|---|---|---|---|
| `default` / `heavy` | 0.15 | 0.15 | 0.6 | 0.04 |
| `drizzle` | 0.08 | 0.09 | 0.4 | 0.025 |
| `light` | 0.11 | 0.12 | 0.5 | 0.03 |
| `torrential` | 0.2 | 0.19 | 0.7 | 0.05 |

These settings are **shared** by every level, only `default`'s are used: `distance`, `iteration_time`, the two textures, `sprite_splash_shape`, `sprite_splash_frames`, `sprite_splash_channels` and `sprite_splash_foot`.

### definition drop_splashes

| Setting | Values | Default | What it does |
|---|---|---|---|
| `enabled` | `true`, `false` | `true` | Turns the rain splashes on the water on or off. |
| `splash_source` | `rain`, `field` | `rain` | `rain`: a splash wherever one of the rain's drops lands on the water, so there are as many as the rain has drops, near the camera. `field`: `splashes_count` of them fall all over the water around the point the camera looks at, independent of the rain's drops. With `field` the rain keeps its own splash sprites. |
| `ripple_strength` | 0-100 | 0.04 | Strength of the small ripple each drop makes, for a drop of heavy rain. 0 = none. For comparison, a strength of 1 lifts the water about 0.3 m and a soldier's step is 0.1 to 0.4. |
| `ripple_radius` | metres | 0.3 | Radius of that ripple (0.3 is the smallest). |
| `ripple_distortion` | number | 0 | The foam that ripple adds, as a share of its strength. |
| `time_to_live` | seconds | 0.3 | How long a splash lasts. |
| `volumetric_splash_scale` | metres | 0.15 | Height of a splash's crown. Its spray is twice as wide. 0 = none. |
| `sprite_splash_scale` | metres | 0.25 | Height of the sprite thrown up by part of the splashes. 0 = none. The rain's own splashes on the ground are 0.04 to 0.1 high. |
| `part_of_sprites` | 0-1 | 0.35 | Share of the splashes that also throw a sprite. |
| `sprite_y_pos` | metres | 0 | Height above the water of the sprite's foot. |
| `opacity` | 0-1 | 0.6 | Opacity of the splashes. They take the water's `foam_color` (`descr_water_ex.txt`), lit by the sun and the sky. |
| `splashes_count` | 0-200000 | 10000 | `field` only: splashes once the rain is at its level. |
| `distance` | metres | 50 | `field` only: how far around the view they fall, fading out over the last quarter. |
| `iteration_time` | seconds | 2 | `field` only: every splash falls once this often, each at its own moment and spot (at least `time_to_live`). |
| `volumetric_splash_texture` | data path | the water's | The pattern tearing the crowns into drops, red channel. Without one, the water's `foam_texture` of `descr_water_ex.txt`. |
| `sprite_splash_texture` | data path | `terrain/water_ex/droplets_sprite.tga` | The sprite (see [textures](#textures)). Missing or empty: a built-in spray of streaks. |
| `sprite_splash_shape` | `quad`, `rain` | `quad` | `quad`: the whole texture (or frame) facing the camera. `rain`: the rain splash cell of `textures/#weather.tga`'s layout, a V standing on the water turned to the camera, as the rain draws it on the ground. |
| `sprite_splash_frames` | columns rows | 6 6 | `quad`: the texture is a flipbook of that many frames, read row by row from the top left and played once over a splash's life. `1 1` = one still sprite that grows and fades. |
| `sprite_splash_channels` | `auto`, `alpha`, `rgba` | `alpha` | How the sprite is read. `auto`: coverage is alpha times brightness, so white drops on black need no alpha. `alpha`: the alpha only, coloured like the foam (for textures whose rgb holds other data). `rgba`: its own colour and alpha. |
| `sprite_splash_foot` | 0-1 | 0.87 | `quad`: the height of the splash's foot in the texture (or each frame), 0 = top, 1 = bottom. That point is held `sprite_y_pos` above the water. |

## textures

Textures are data paths written without `.dds`, like the other water textures, so `terrain/water_ex/foam.tga` loads `data/terrain/water_ex/foam.tga.dds`.

| Texture | Used by | What it is |
|---|---|---|
| `terrain/water_ex/foam.tga` | `foam_texture`, `volumetric_splash_texture` | The water's foam pattern. |
| `terrain/water_ex/foam_trail_mask.tga` | `mask_texture` | The streak mask of the foam trails. u runs across the trail (clamped), v along it (repeating). Red: fine foam, green: medium foam, alpha: long streaks. |
| `terrain/water_ex/droplets_sprite.tga` | `sprite_splash_texture` | A 6x6 flipbook of a burst of drops, read from its alpha. |

To use the rain's own splash from the weather texture instead of the flipbook:

```
sprite_splash_texture   textures/#weather.tga
sprite_splash_shape     rain
```

## examples

### stronger ripples from rain

Raise `ripple_strength` in the rain level you want, for example a stormier `torrential` in `definition drop_splashes`:

```
class torrential modifies default
{
    ...
    ripple_strength     0.1
}
```

### turn off the foam trails but keep the ripples

In the `settings` block:

```
definition foam_trails
{
    default
    {
        enabled     false
    }
}
```

### a wake for a custom mount

In `descr_mount.txt`, give the mount its own trail name:

```
water_trail_effect  war_wagon_water_trail
```

Then add the effects and a set with that name to `descr_water_effects_ex.txt`:

```
effect war_wagon_ripple
{
        type ripple
        {
                class           wading
                shape           box
                radius          0.8
                size            2.0 4.0         ; <meters> width length
                mass            3
                strength        [ 0.1 0.4 ]
                distortion      0.4
                max_speed       6
                emit_distance   1.0
                emit_period     3
                min_spacing     4 0.5
        }
        type foam_trail
        {
                class           wake
                width           2.5
                alpha           [ 0.6 1 ]
                max_speed       5
        }
}

effect_set war_wagon_water_trail
{
        war_wagon_ripple
}
```
