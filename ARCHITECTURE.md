# WORLD WEDDING — Living System Architecture

## Decision

WORLD WEDDING is the visible experience. The other projects are engines or projections behind it.

The product is not a collection of dashboards. It is one continuous editorial surface with several deterministic views of the same underlying objects.

## Core model

WORLD
→ DESTINATION
→ STORY / CONTENT
→ PEOPLE / PLACES / SERVICES
→ MY WEDDING
→ TIMELINE
→ MEMORY

## Engines

### 1. Universal Grid — semantic projection engine

Current implementation:
- `universal-grid.html`
- `universal-grid-core.js`
- `universal-translator.js`

Responsibilities:
- preserve the original source
- convert source into a semantic object
- provide deterministic projections
- support number, sign, music, value, relation and memory views
- keep provenance visible
- remain a laboratory / engine, not a primary navigation destination

Important: the existing 365-cell grid is an engine/lab representation. It must not be reintroduced as the main WORLD WEDDING homepage.

### 2. AIME — relation / memory / transmission layer

Current implementation:
- `aime-universal.js`
- `aime-universal.css`
- existing AIME Network architecture remains the larger relation layer

Responsibilities:
- identity
- relations
- traces
- contributions
- collection / archive
- transmission
- permissions and provenance

AIME should not become a visible second dashboard inside WORLD WEDDING.

### 3. WORLD WEDDING — editorial surface

Current implementation:
- `index.html`
- `destinations.js`

Responsibilities:
- discovery
- destination storytelling
- visual editorial navigation
- continuous magazine experience

The 365 days / 24 hours are background content structure, not a visible grid.

### 4. My Wedding — personal mirror

Current implementation:
- `my-wedding.html`

Responsibilities:
- transform selected world content into a personal wedding project
- retain local-first behaviour until a real persistence layer is connected
- never fabricate verified suppliers, prices or availability

The long-term flow is:

DISCOVER → SAVE → VERIFY → CONTACT → BOOK

### 5. Timeline — temporal projection

Timeline Theater remains the specialist engine for the wedding day.

It should consume the same objects selected in My Wedding instead of requiring duplicate data entry.

### 6. DISPOO — concrete availability / booking layer

DISPOO remains a specialist engine.

It should be invoked when a user moves from editorial discovery to an actual request, quote, availability check or booking.

WORLD WEDDING remains editorial; DISPOO handles the transaction workflow.

## Data rule

One source of truth.

An object should exist once and be projected into:

- editorial
- relation
- destination
- wedding
- timeline
- booking
- archive

Do not create duplicate objects for each interface.

## Reality rule

Every object must carry, when relevant:

- source
- date
- origin
- context
- version
- confidence
- verification status

A prototype, convention or generated visual must never be presented as verified real-world data.

## Migration rule

Do not merge repositories blindly.

1. Keep existing repositories intact.
2. Identify stable engines.
3. Define shared data contracts.
4. Port one engine at a time.
5. Retest the visible experience after each migration.
6. Remove duplicate implementations only after the replacement is verified.

## Current priority

The next implementation phase is not another homepage redesign.

It is:

**WORLD WEDDING editorial surface**
+
**Universal Grid semantic model**
+
**AIME relation / memory model**

with My Wedding consuming the resulting objects.

The first concrete shared object should be:

`WorldObject`

with a stable identity and optional relations to destination, person, place, service, event, media, timeline moment and wedding.

## UX principle

The user should feel:

> I am exploring one world.

Not:

> I am switching between six applications.

The architecture can be complex. The experience must remain simple.
