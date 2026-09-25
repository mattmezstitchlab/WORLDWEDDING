# WorldObject

The shared object contract for WORLD WEDDING.

## Purpose

One real-world or editorial entity is represented once, then projected into different experiences.

## Identity

Every object has:

- stable `id`
- `type`
- `source`
- `sourceId`
- `version`

## Common fields

```
{
  id,
  version,
  type,
  source,
  sourceId,
  identity,
  geo,
  editorial,
  relations,
  provenance
}
```

## First supported type

`destination`

A destination is created directly from `WORLD_WEDDING_DESTINATIONS`.

## Relations

Reserved relation arrays:

- people
- places
- services
- events
- media
- timeline
- weddings

## Provenance

The prototype distinguishes registration from verification.

A registered destination is not automatically a verified editorial claim, supplier, price or availability.

## Projection flow

```
SOURCE
  ↓
WorldObject
  ├── editorial
  ├── Universal Grid
  ├── AIME relations
  ├── My Wedding
  ├── Timeline
  └── DISPOO
```

## Persistence

The current browser prototype stores the object registry in localStorage.

This is intentionally not presented as production persistence.

A later server/database adapter can implement the same contract without changing the visible product model.
