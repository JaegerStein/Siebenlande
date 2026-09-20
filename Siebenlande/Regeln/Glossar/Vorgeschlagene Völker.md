---
aliases:
  - Spielbare Völker
---
Eine Liste von [[Volk|Völkern]], die weiter ausgearbeitet sind als andere, und sich zum Spielen eigenen:

```base
views:
  - type: cards
    name: Übersicht
    filters:
      and:
        - file.tags.contains("Volk")
        - "!thumbnail.isEmpty()"
    sort:
      - property: file.name
        direction: ASC
    image: note.thumbnail
    imageAspectRatio: 1.5

```
