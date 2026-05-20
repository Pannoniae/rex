# soldier variation

A unit can use several different models mixed together, instead of every soldier being an identical clone. A model can also swap as the unit's armour gets upgraded. Works in both RTW and M2TW.

The old `soldier` line in `export_descr_unit.txt` still works exactly as before, nothing to change:

```
soldier  roman_legionary  40  0  1.0
```

The new `soldiers` block (note the `s`) lists several models. Each soldier in the unit is randomly given one:

```
soldiers  40, 0, 1.0
{
    default
    {
        roman_legionary
        roman_legionary_var2
        roman_legionary_var3
    }
}
```

The numbers after `soldiers` are the same as the old line: count, extras, then optional mass, radius, height. The `default` block is the model pool for an un-upgraded unit.

## armour upgrades

Add `armour N` blocks to swap models when the unit's armour is upgraded:

```
soldiers  40, 0, 1.0
{
    default  { legionary_a0_v1  legionary_a0_v2 }
    armour 1 { legionary_a1_v1  legionary_a1_v2 }
    armour 2 { legionary_a2_v1  legionary_a2_v2 }
}
```

`N` is the armour upgrade level. A unit with one armour upgrade renders the `armour 1` pool, and so on. The tiers don't need matching counts, e.g. `default` can list four models and `armour 2` just one.

There's also a one-liner form, one model per tier, no per-soldier variation:

```
armour_ug_levels  0 1 2
armour_ug_models  legionary  legionary_a1  legionary_a2
```

M2 already had this; it now works in RTW too.

A few things to know:

- The `soldiers` block stands alone. Don't also give the same unit a `soldier` line or `armour_ug_*` lines, the parser reads the first form and chokes on what's left.
- Variant models in one unit should share a skeleton. They're meant to be the same soldier with a different look; wildly different skeletons will animate wrong.
- M2 already varies soldiers *inside* one model with mesh variations. The `soldiers` block is a separate axis: whole different models. They do stack, so the block picks the model and mesh variations vary it further.
