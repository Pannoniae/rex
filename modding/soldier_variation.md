# soldier variation

Normally every soldier in a unit uses the same model, so a forty-man unit is forty copies of the same guy. This feature changes that in two ways: a unit can mix several models, picked at random for each soldier, and the model can change as the unit's armour is upgraded. Both work in RTW and M2TW.

The old `soldier` line in `export_descr_unit.txt` still works exactly as before:

```
soldier  roman_legionary  40  0  1.0
```

The new `soldiers` block (note the `s`) lists several models, and each soldier in the unit is randomly given one of them:

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

The numbers after `soldiers` mean the same as on the old line: count, extras, then optional mass, radius and height. Inside the block, `default` is the pool of models an un-upgraded unit draws from.

## armour upgrades

Add `armour N` blocks to swap the model pool when the unit's armour is upgraded:

```
soldiers  40, 0, 1.0
{
    default  { legionary_a0_v1  legionary_a0_v2 }
    armour 1 { legionary_a1_v1  legionary_a1_v2 }
    armour 2 { legionary_a2_v1  legionary_a2_v2 }
}
```

A unit draws from the pool whose number matches its current armour upgrade level: no upgrades uses `default`, one upgrade uses `armour 1`, two uses `armour 2`. The pools are independent, so they don't need matching counts. `default` can list four models and `armour 2` just one.

There is also a shorter form, one model per tier and no per-soldier variation:

```
armour_ug_levels  0 1 2
armour_ug_models  legionary  legionary_a1  legionary_a2
```

M2 already had this one; it now works in RTW too.

A few things to know:

- The `soldiers` block replaces the old `soldier` line, so don't also give the unit a `soldier` line or `armour_ug_*` lines. The parser reads whichever form comes first and chokes on the leftovers.
- Variant models in one unit should share a skeleton. They are meant to be the same soldier with a different look, so a model built on a wildly different skeleton will play its animations incorrectly.
- M2 already varies soldiers within a single model through mesh variations. The `soldiers` block does something different: it swaps the whole model. The two stack, so the block picks which model a soldier uses and mesh variations then vary that model further.
