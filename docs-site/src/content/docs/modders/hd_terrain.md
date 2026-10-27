---
title: HD terrain
description: REX high-detail battle terrain settings and per-texture tiling.
---

REX can draw battles with high-detail ground textures. They're configured in `descr_ex.txt`, and each texture can set its own tiling. This is REX only.

## how it works

With `hd_terrain true`, the battle ground uses `data/descr_geography_ex.txt` instead of `descr_geography.txt`. It's cached as `descr_geography_ex.db`, and a shipped `.db` alone also works. Its textures live in `data/terrain/battlefield_ex/`. Grass then comes from `descr_ground_cover_ex.txt`, or `descr_ground_cover.txt` when that's missing.

When `descr_geography_ex` is missing, the game falls back to the classic terrain and writes a warning to the log.

Classic `descr_geography` textures always keep the classic tiling, repeat and blend. All the settings below only affect `descr_geography_ex` ground.

## descr_ex.txt settings

| Setting | Values | Default | What it does |
|---|---|---|---|
| `hd_terrain` | `true`, `false` | `true` | `true` = use `descr_geography_ex`. `false` = always the classic terrain. |
| `hd_terrain_tiling` | 1-5 | 1 | How
| `hd_terrain_anti_tiling` | `true`, `false` | `true` | Breaks up the visible repeat of the textures when zoomed out. Each patch of ground uses its own random offset, blended softly where patches meet. |
| `hd_terrain_smooth_blend` | 0-128 | 32 | Width in metres over which neighbouring ground types fade into each other, with noisy, meandering edges. 0 = off (the blocky 8 m grid blend). |
| `hd_terrain_normal_strength` | 0.0-1.0 | 1.0 | How much of a texture's normal map (its `pbrn` texture) is applied. 0.0 = flat ground (the pbr mask still applies). |
| `hd_terrain_far_tiling` | 0-5 | 1 | The `hd_terrain_tiling` level used for distant ground. 0 = off. |
| `hd_terrain_far_tiling_range` | start end | 150 600 | Distance in metres from the camera where the fade to `hd_terrain_far_tiling` starts and ends. |

The shipped values:

```
hd_terrain true
hd_terrain_tiling 4
hd_terrain_anti_tiling true
hd_terrain_smooth_blend 16
hd_terrain_normal_strength 0.5
hd_terrain_far_tiling 1
hd_terrain_far_tiling_range 150 600
```

### far tiling

Fine tiling looks great up close, but far away the repeat gets smaller than a pixel and the ground turns into a flat smear. So the ground fades to the coarser `hd_terrain_far_tiling` level with distance, between the two distances of `hd_terrain_far_tiling_range`.

It only has an effect when it's below `hd_terrain_tiling`. With `hd_terrain_tiling 4` and `hd_terrain_far_tiling 1`, ground closer than 150 m uses level 4, ground beyond 600 m uses level 1, and it fades in between.

## per-texture tiling

Each ground texture can override `hd_terrain_tiling` with a `.txt` file of the same name next to it:

```
data/terrain/battlefield_ex/alpine/summer/oz_grass.tga.dds
data/terrain/battlefield_ex/alpine/summer/oz_grass.txt
```

The file holds one setting:

```
tiling 3.0
```

`tiling` (0.0-64.0) is how often the texture repeats along each axis:

| `tiling` | Same as |
|---|---|
| 0.5 | twice as big as classic |
| 1.0 | classic (once per 16 m), `hd_terrain_tiling 1` |
| 2.0 | `hd_terrain_tiling 2` |
| 4.0 | `hd_terrain_tiling 3` |
| 8.0 | `hd_terrain_tiling 4` |
| 16.0 | `hd_terrain_tiling 5` |
| 0, or no line | use `hd_terrain_tiling` |

Values in between work too, so `3.0` sits between levels 2 and 3.

- REX ships a template `.txt` next to every `battlefield_ex` texture, with the line commented out (`;tiling 1.0`). Remove the `;` and set a value to use it.
- A `colour R, G, B` line, as in the classic battlefield folders, is ignored.
- The files are re-read on every battle load, so restarting the battle applies your edits.

### what it's good for

Some textures look best large, like rock faces, sand dunes or big patches of mud, while others need fine detail, like grass or gravel. With per-texture tiling, a single `hd_terrain_tiling` no longer has to suit all of them.

## distant ground

- The far, low-detail ground gets a generated normal map, so distant hills and mountains are lit smoothly instead of looking low-poly.
- Roads and other ground overlays keep their soft, semi-transparent edges on HD terrain.
