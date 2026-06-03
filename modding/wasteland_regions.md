# Wasteland regions

The Total War map is a huge square. This normally suffices but this forces you to fill the entire map with provinces even if you don't want to, or you explicitly want to block some areas off. The usual trick for this was a "deep forest" province with a settlement buried somewhere unreachable, which still left a phantom city on the books with all the rebel, AI and territory bookkeeping that comes with it, confusing the campaign AI and still having rebels as their owner.

A **wasteland region** does all of this properly. Wastelands have no settlement, no owner, and no economy. The AI never targets it, it never counts towards a map-control victory, and no rebels or brigands spawn in it. Combined with the `impassable_shrouded` ground type (below), it becomes a black void that units cannot enter and players cannot see into. Both work in RTW and M2TW.

## Making a region a wasteland

A wasteland is defined in `descr_regions.txt` like any other region, with one change: where you would normally put the settlement name, you put the keyword `wasteland` instead.

A normal region block looks like this:

```
Britannia_Province
londinium
romans_julii
britons_rebels
70 130 180
gold
0
2
```

The same block as a wasteland:

```
Sahara_Province
wasteland
romans_julii
slave_rebels
80 40 20
none
0
0
```

The first line is still the region's name key, and it still has to exist in your `<campaign>_regions_and_settlement_names.txt` file. The three numbers are still the region's RGB colour in `map_regions.tga`. The faction, rebel faction, resources, triumph value and farm level lines are still read but they are all ignored for a wasteland, because it has no settlement.

On the map side, paint the region's colour into `map_regions.tga` exactly as you would for any region. The one difference is that a wasteland does **not** need a settlement-position pixel, because it has no settlement.

That is the whole feature. The region now loads belonging to nobody. You can confirm it has worked by checking that no faction starts owning it and the AI leaves it alone.

## Terrain

By itself a wasteland region is still made of whatever terrain you painted in it, so units could in principle walk across it. To turn it into a proper black void, you paint its tiles with the `impassable_shrouded` ground type in `map_ground_types.tga`:

```
impassable_shrouded   RGB 32 32 32
```

A tile painted this colour is **impassable** (no land unit can move onto it) and **permanently shrouded** (it stays black under the fog of war forever, so the player never sees what is there). That combination is what gives a wasteland its empty, off-the-edge-of-the-world look.

There is a related, visible option if you want a barrier you can still see:

```
impassable_land       RGB 64 64 64
```

`impassable_land` blocks movement the same way, but it stays visible: the player sees the terrain, it just cannot be crossed. Use `impassable_shrouded` for hidden void and `impassable_land` for a visible wall like an impassable mountain range. Both ground types now work in RTW as well as M2TW.

`impassable_shrouded` is not tied to wasteland regions. You can paint it inside a normal faction's region to wall off an unreachable, unseen corner without making the whole region ownerless. The region keeps its settlement and owner; those particular tiles are just dead and dark.