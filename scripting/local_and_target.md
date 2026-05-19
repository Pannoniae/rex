# local and target

Two new script keywords. `local` and `target` work in any faction, settlement, or character argument, across every command and condition, in both RTW and M2TW. So you can stop typing faction names you already know from the event.

```
monitor_event GeneralAssaultsResidence TrueCondition
    set_faction_standing local target -0.5
end_monitor
```

`local` is the event's actor (the attacker here). `target` is the event's target (the defender). Same with settlements. Characters only get `local`, because no event has a "target character" yet, so writing `target` in a character slot logs an error and skips the line.

Outside an event, like in the dev console or in scripts that run at game start, `local` falls back to the UI: your faction, the last settlement you clicked, the last character you clicked. `target` has no fallback. It just fails.

Three things this doesn't help with:

- Regions. `freeze_recruit_pool` is the only command that takes a region, and no event tracks a "current region". Spell out the region name.
- Faction lists, like the `factions { ... }` block in `historic_event`. You can only use one faction name, not a set. Use `all` or list factions explicitly.
- `sub_faction` inside `spawn_army`. The value bakes at parse time, so writing `local` there does nothing.
