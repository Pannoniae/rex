---
title: Mount and animal variation
---

Normally every mount of a given type looks identical, so a cavalry unit is forty copies of the same horse. This feature lets a mount type list several models, and each horse (or camel, elephant, wardog, pig) picks one. It "stacks" with soldier variation: you can vary the riders, vary the horses, or both.

## Which name goes where

Three different name spaces are involved and it's kind of confusing:

1. `export_descr_unit.txt`'s `mount` attribute names a **mount type** from `descr_mount.txt` (`mount generals horse`).
2. The models inside a mount type name **battle model entries** (`descr_model_battle.txt`). These are single_word_names without spaces.
3. Those battle model entries in turn name skeletons and mesh/.cas files.

Variation lives entirely at level 2, inside the mount type. Unlike soldier variation, this does *not* change the EDU, and because every variant shares the one mount type, they all have the same gameplay values like the radius, mass and collision.

## The models block

The old `model` line in `descr_mount.txt` still works exactly as before:

```
type            heavy horse
class           horse
model           horse_heavy
radius          1.5
...
```

The new `models` block (note the `s`) lists a pool instead:

```
type            heavy horse
class           horse
models
{
    skeleton    horse_heavy
    horse_heavy horse_heavy_b horse_heavy_pink
}
radius          1.5
...
```

Each horse of this type is given one model from the pool. Ids are separated by spaces or newlines, up to 255 of them, and listing a model twice gives it double the odds.

`skeleton` is required. It names the battle model whose skeleton and scale applies: the animations, where the rider sits, and the collision scale, the same thing as `skeleton` in the `soldiers` block, and the same rule applies: it must exist in the DMB, but it does **not** have to appear in the pool. A skeleton-only model that never renders is fine. Note that it names a battle *model*, not a skeleton id, even though the keyword says skeleton.

## Animals

`descr_animals.txt` takes the exact same block:

```
type            wardogs
class           wardog
models
{
    skeleton    dog
    dog dog_black dog_spotted
}
radius          0.4
...
```

## A few things to know

- Every model in the pool must be rigged to the same bone layout as the `skeleton` model, or its animation comes out garbled. The game warns at load if a pool model declares a different skeleton.
- The scale comes from the `skeleton` model and affects collision. If a pool model has a different scale in its battle model entry, it will render at its own size but collide at the skeleton model's size. The game warns about this too i.e. probably don't do it.
- At sprite distance (the zoomout where units become billboards), all the mounts of a unit use the first pool model's sprite. Same deal as soldier variants.
