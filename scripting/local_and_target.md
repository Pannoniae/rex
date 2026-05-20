# local and target

Inside an event you already know which faction, settlement, or character it concerns: the attacker, the besieged town, whoever just moved. `local` and `target` are two new keywords that let you point at them directly, instead of hardcoding a name you already know. They work in every command and condition that takes a faction, settlement, or character argument, in both RTW and M2TW.

```
monitor_event GeneralAssaultsResidence TrueCondition
    set_faction_standing local target -0.5
end_monitor
```

In an event, `local` is the actor and `target` is the other side. For `GeneralAssaultsResidence` that makes `local` the attacking faction and `target` the defending one. Settlement arguments split the same way: `local` is the event's settlement and `target` the other settlement involved.

Characters only get `local`. No event tracks a target character yet, so writing `target` in a character argument logs an error and skips the line.

Outside an event, in the dev console or in scripts that run at game start, `local` falls back to whatever the UI has selected: your faction, the last settlement you clicked, the last character you clicked. `target` has no such fallback, so using it outside an event logs an error and skips the line.

Three things this doesn't help with:

- Regions have no shorthand. `freeze_recruit_pool` is the only command that takes a region, and no event tracks a current region, so there is nothing for `local` to resolve to. Name the region directly.
- Faction lists, like the `factions { ... }` block in `historic_event`, take a set of factions rather than one. `local` only ever resolves to a single faction, so it cannot fill a list. Use `all`, or list the factions explicitly.
- `sub_faction` inside `spawn_army` is read once, when the script file is first parsed, long before any event fires. `local` has nothing to resolve to that early, so it does nothing there.
