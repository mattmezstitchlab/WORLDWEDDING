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

## Generic object creation

The browser prototype can create other object types without changing the contract:

- `person`
- `place`
- `service`
- `event`
- `media`
- `timeline`
- `wedding`

Use `WORLD_OBJECT.create(type, data, provenance)`. IDs are stable by convention: `type:sourceId`.

## Relations

Allowed relation buckets:

`people`, `places`, `services`, `events`, `media`, `timeline`, `weddings`.

The relation API is deliberately small:

- `link(id, type, targetId)`
- `unlink(id, type, targetId)`
- `related(id, type)`
- `relate(id, type, targetId, { reverse, reverseType })`

A relation is data, not navigation. Interfaces may project it differently.

## Universal Grid projection

`world-object-universal.js` provides a deterministic adapter:

`WorldObject → semanticType + stable grid cell + relation count + provenance`

The grid cell is derived from the stable object ID. It is a product convention, not a historical, scientific or universal meaning.

## Reality rule

Objects created by the prototype remain `verified: false` unless a real source explicitly establishes verification. A relation never creates evidence by itself.
