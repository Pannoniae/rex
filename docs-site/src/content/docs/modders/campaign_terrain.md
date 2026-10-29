---
title: Campaign terrain
description: Switchable campaign map terrain sets (descr_toggles_ex.txt), PBR ground and tile models, and data-driven coastlines.
---

The campaign map's ground art and tile models can come in several interchangeable sets, and players pick one with the **Campaign Terrain** video option. REX ships two sets, **Classic** (the original look) and **Enhanced** (new ground art, tile model textures and PBR maps). M2EX ships Classic only for now, ready for someone to add an Enhanced set.

## the Campaign Terrain option

| | Where | When it applies |
|---|---|---|
| REX | **Options** > **Video**, with advanced options shown. Also **Options** > **Video Options** inside a campaign. | Straight away. Changing it in a campaign reloads the terrain on the spot. If the new set fails to load, the old one is kept and an error is shown. |
| M2EX | **Options** > **Video**, left column, under Campaign Map Detail. | The next time a campaign map loads. |

The choice is saved with the other video settings. It lists one entry per configuration in `descr_toggles_ex.txt`, and is hidden when the mod has no such file (or no `AERIAL_MAP` section in it).

## descr_toggles_ex.txt

`data/descr_toggles_ex.txt` lists the sets. Each `section` is a game feature, and each `configuration` in it is one entry in the dropdown. Campaign terrain is the `AERIAL_MAP` section.

```
section AERIAL_MAP
{
  enabled true
  default enhanced

  configuration classic
  {
    ground_types	descr_aerial_map_ground_types.txt
    tile_models		descr_aerial_map_tile_models.txt
    text			UI_VIDEO_CAMPAIGN_GROUND_STYLE_CLASSIC
  }

  configuration enhanced
  {
    ground_types	descr_aerial_map_ground_types_ex.txt
    tile_models		descr_aerial_map_tile_models_ex.txt
    text			UI_VIDEO_CAMPAIGN_GROUND_STYLE_ENHANCED
  }
}
```

| Line | What it does |
|---|---|
| `enabled true` / `false` | `true`: players choose any configuration. `false`: the dropdown shows the default greyed out, and the default is always used. Handy for a mod that wants to force its own terrain. |
| `default <name>` | The configuration used until a player picks another one. An unknown name uses the first configuration. |
| `configuration <name>` | A unique name (not case sensitive). The player's choice is saved by this name, so renaming a configuration resets players to the default. |
| `ground_types <file>` | The `descr_aerial_map_ground_types`-style file for this set. |
| `tile_models <file>` | The `descr_aerial_map_tile_models`-style file for this set. |
| `text <KEY>` | The `menu_english.txt` key shown in the dropdown. The configuration's name is shown when it's missing. |

File paths are relative to the `data` folder, and a mod's `data` folder is checked first.

### fallbacks

- A configuration doesn't have to name every file. A missing `ground_types` or `tile_models` line uses the default configuration's file, and failing that the built-in one (`descr_aerial_map_ground_types.txt`, `descr_aerial_map_tile_models.txt`).
- Any configuration other than the default borrows the default's ground art for every texture missing on disk, and for every climate its file doesn't describe. So an Enhanced set can replace just a few climates.
- A tile models file must keep the `tile_set` and link names of the original, because the game looks models up by those names. If it can't be used, the default's file is used instead.
with a note in the log. Unknown roles are ignored.
- Without the file or the section, the game behaves exactly as before and the option is hidden.

### adding an Enhanced set to M2EX

The M2EX file has only `classic`, and its header shows the block to add:

```
configuration enhanced
{
  ground_types	descr_aerial_map_ground_types_ex.txt
  tile_models		descr_aerial_map_tile_models_ex.txt
  text			UI_VIDEO_CAMPAIGN_GROUND_STYLE_ENHANCED
}
```

The `UI_VIDEO_CAMPAIGN_GROUND_STYLE_ENHANCED` text already exists in every M2EX language. Set `default enhanced` to make it the default.

## ground types settings

These go at the top of a `descr_aerial_map_ground_types` file, outside any `climate` block, and apply to every texture in that file. So Classic and Enhanced can be tuned separately.

| Setting | Range | Default | What it does |
|---|---|---|---|
| `texture_density` | 0.25-8 | 1.0 | Resolution of the art compared with vanilla. 2x resolution art with `texture_density 2` covers the same ground as vanilla, twice as sharp. |
| `blend_smoothness` | 1-4 | 1.0 | How soft the borders between ground types are. 1 is the original blend, which follows the tile grid in steps. Higher values give wider, noise-broken borders, so coasts and field edges meander. 2-3 is a good start. |
| `pbr_normal_strength` | 0-8 | 2.0 | Strength of the `_pbrn` relief. 1 = as authored, more exaggerates it. |
| `pbr_wetness_strength` | 0-4 | 1.0 | Scale of the `_pbrn` wetness (its alpha). 0 = off. |
| `pbr_wet_darken` | 0-1 | 0.6 | How much fully wet ground darkens. |
| `pbr_wet_roughness` | 0.02-1 | 0.2 | Roughness of the water film. Lower = a tighter sun glint. |
| `pbr_wet_reflectance` | 0-1 | 0.02 | How much the water film reflects head-on. Water is 0.02. |

The shipped REX Enhanced file uses:

```
texture_density 4

blend_smoothness 2.0

pbr_normal_strength		2.0
pbr_wetness_strength	1.0
pbr_wet_darken			0.6
pbr_wet_roughness		0.2
pbr_wet_reflectance		0.02
```

### ground PBR maps

Each ground texture can have two PBR maps next to it, as `.dds` only. For `alpine.dds` (or `alpine.tga`):

| File | Channels |
|---|---|
| `alpine_pbr.dds` | R = metal (0 for ground), G = ambient occlusion (white = none), B = emissive (0), A = roughness (white = matte) |
| `alpine_pbrn.dds` | RG = tangent-space normal (DirectX, green down), B ignored, A = wetness (white = dry, black = wet) |

- Wet areas get darker and glossy, and pooled water flattens the normal.
- Use DXT5/BC3 or BC7 for `_pbrn` to keep the alpha. DXT1 and BC5 have no alpha, so the ground reads as dry.
- Either map can be missing: flat, matte and unoccluded ground stands in.
- They may be smaller than the texture itself (for example 512 next to a 1024 texture), and each covers one repeat of it.

REX keeps its Enhanced ground art in `data/terrain/aerial_map/ground_types/enhanced/`.

## tile models settings

These go at the top of a `descr_aerial_map_tile_models` file.

### texture_path

```
texture_path	data\terrain\aerial_map\tile_textures\enhanced
```

The folder the tile model textures (mountains, cliffs, rivers, volcanoes and so on) are loaded from, including its `winter\` and `<climate>\summer|winter\` subfolders. The default is `data\terrain\aerial_map\tile_textures`. Any texture missing from the folder comes from the default folder, so an override folder only needs the textures it changes. One folder, no spaces.

### tile model PBR maps

Tile model textures can carry the same `_pbr` and `_pbrn` maps as the ground, placed next to the texture with the suffix before the extension:

```
tile_textures\enhanced\cliff.tga.dds
tile_textures\enhanced\cliff_pbr.tga.dds
tile_textures\enhanced\cliff_pbrn.tga.dds
```

The `_pbrn` map is only used when the `_pbr` map is there too.

### coastline textures

```
surf_texture	data\terrain\aerial_map\sea\enhanced\surf2b.tga
beach_texture	data\terrain\aerial_map\sea\enhanced\beach_strip.tga
```

The surf and the beach strip drawn along every coast. The defaults are `data\terrain\aerial_map\sea\surf2b.tga` and `beach_strip.tga`, and a missing file keeps the default. A `.dds` next to the named `.tga` is used first. In REX, switching Campaign Terrain in a campaign swaps them straight away.

The coastline doesn't use PBR maps yet, so `_pbr` and `_pbrn` files next to these textures are ignored for now.
