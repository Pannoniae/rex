# soldier variation

Normally every soldier in a unit uses the same model, so a forty-man unit is forty copies of the same guy. This feature changes that in two ways: a unit can mix several models, picked at random for each soldier, and the model can change as the unit's armour is upgraded. Both work in RTW and M2TW.

The old `soldier` line in `export_descr_unit.txt` still works exactly as before:

```
soldier  roman_legionary  40  0  1.0
```

The model on the `soldier` line plays two roles. It picks the mesh rendered in battle, and it tells the engine which skeleton drives the unit - how fast it walks and runs, where missile fire spawns from, whether the primary weapon has a charge animation. If you add `armour_ug_models` (below), the per-tier entries swap the mesh; the skeleton stays as whatever was on the `soldier` line. So you can name one model on the `soldier` line for the skeleton and entirely different models in `armour_ug_models` for the meshes, if you have a reason to. Vanilla M2 did this for a handful of units.

The new `soldiers` block (note the `s`) lists several models, and each soldier in the unit is randomly given one of them:

```
soldiers  40, 0, 1.0
{
    skeleton  roman_legionary
    default
    {
        roman_legionary
        roman_legionary_var2
        roman_legionary_var3
    }
}
```

The numbers after `soldiers` mean the same as on the old line: count, extras, then optional mass, radius and height. Inside the block, `default` is the pool of models an un-upgraded unit draws from.

`skeleton` is required when you use the `soldiers` block. It names the model whose skeleton drives the unit — the same role the model on the old `soldier` line plays. The named model has to exist in `battle_models.modeldb`, but it does **not** have to appear in any of the mesh pools below; if you want a skeleton-only model that never gets rendered, that's fine. If the keyword is missing or the named model can't be found, the parser fails the unit loudly.

## armour upgrades

Add `armour N` blocks to swap the model pool when the unit's armour is upgraded:

```
soldiers  40, 0, 1.0
{
    skeleton  legionary
    default  { legionary_a0_v1  legionary_a0_v2 }
    armour 1 { legionary_a1_v1  legionary_a1_v2 }
    armour 2 { legionary_a2_v1  legionary_a2_v2 }
}
```

A unit draws from the pool whose number matches its current armour upgrade level: no upgrades uses `default`, one upgrade uses `armour 1`, two uses `armour 2`. The pools are independent, so they don't need matching counts. `default` can list four models and `armour 2` just one.

There is also a shorter form, one model per tier and no per-soldier variation:

```
soldier           legionary  40  0  1.0
armour_ug_levels  0 1 2
armour_ug_models  legionary  legionary_a1  legionary_a2
```

The `soldier` line still drives the skeleton; `armour_ug_models` just swaps the mesh per tier. M2 has had this form for a long time; it now works in RTW too.

A few things to know:

- The `soldiers` block replaces the old `soldier` line, so don't also give the unit a `soldier` line or `armour_ug_*` lines. The parser reads whichever form comes first and chokes on the leftovers.
- Every mesh in the unit (the default pool and every `armour N` pool, or the meshes listed in `armour_ug_models`) needs to be rigged to the same skeleton as the model named on `skeleton` / `soldier`. If a mesh uses a different bone layout, its animation comes out garbled. The model itself can differ, it's the bone layout that has to match.
- M2 already varies soldiers within a single model through mesh variations. The `soldiers` block does something different: it swaps the whole model. The two stack, so the block picks which model a soldier uses and mesh variations then vary that model further.
