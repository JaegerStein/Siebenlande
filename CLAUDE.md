# Claude Code Instructions - Siebenlande Projekt

## Projekt-Übersicht

**Siebenlande** ist ein D&D/RPG Kampagnen-Management-Portal mit eigenem Regelwerk:
- **Quartz v4.5.2** Static Site Generator für Veröffentlichung
- **Obsidian Vault** für Content-Authoring
- **Deployment**: GitHub Actions → siebenlande.de
- **Sprache**: Deutsch (de-DE)

### Technischer Stack
- TypeScript/Node.js 22, Preact
- Obsidian-Flavored Markdown
- Features: Dark Mode, Volltext-Suche, Graph-Visualisierung, Wiki-Links

### Content-Struktur
```
Siebenlande/
├── Legende/           # Worldbuilding - Lore der Spielwelt
│   ├── Geografie/     # Orte, Regionen, Reiche
│   ├── Gruppierungen/ # Organisationen (Kulte, Sekten, Orden, etc.)
│   ├── Wesen/         # Völker, Kreaturen, Bestien
│   ├── Personen/      # NPCs und wichtige Figuren
│   └── Kultur/        # Währungen, Traditionen, etc.
├── Regeln/            # Spielsystem - Mechaniken & Regelwerk
│   ├── Charakter/     # Charaktererstellung & -entwicklung
│   ├── Grundlagen/    # Basis-Spielmechaniken
│   ├── Kampf/         # Kampfsystem (Nah-, Fernkampf, Rüstung)
│   └── Spielbare Völker/ # Rasseneigenschaften
├── Journal/           # Kampagnen-Tracking - Laufende Spielsitzungen
│   ├── Charaktere/    # Spieler-Charaktere & wichtige NPCs
│   ├── Episoden/      # Chronologische Spielsitzungen
│   └── Questen/       # Kampagnen- & Personal-Quests
└── Werkzeuge/         # Spielhilfen - Praktische Tools für Spielleitung
```

### Aktueller Stand (Stand: Februar 2026)
- **Legende**: ~57 Dateien - 7 etablierte Königreiche
- **Regeln**: ~28 Dateien - Vollständiges Charaktersystem mit Stufen & Talenten
- **Journal**: ~57 Dateien
  - Episoden: Prolog bis Episode 9
  - Mehrere Spieler-Charaktere & Fraktionen dokumentiert
  - Aktive Kampagne: "Fäulnis in Malravien" + Personal-Quests
- **Werkzeuge**: Excel-Charakterbogen (50KB), Preisliste

## Meine Rolle & Aufgaben

### ✅ Was ich tun soll:
- **Kategorisierung** - Inhalte strukturieren und organisieren
- **Aufräumen** - Dateien sortieren, umbenennen, verschieben
- **Design-Standards einhalten** - Konsistenz in Formatierung und Struktur
- **Ordnung schaffen** - Systematik und Übersicht wahren

### ❌ Was ich NICHT tun soll:
- **Keine Inhaltserstellung** - Ich schreibe keine Lore, Regeln oder Story-Content
- Nur auf explizite Anfrage kreativ werden

## Sprachgebrauch-Regel (WICHTIG!)

### 🇩🇪 Deutsch = Rollenspiel-Inhalt
- **Wann**: User schreibt auf Deutsch
- **Arbeitsbereich**: `Siebenlande/` Ordner (Legende, Regeln, Journal)
- **Antwort**: Deutsch
- **Thema**: Worldbuilding, Spielregeln, Kampagne

### 🇬🇧 English = Technical Development
- **When**: User writes in English
- **Working Area**: `quartz/` folder, config files (root)
- **Response**: English
- **Topic**: Quartz development, build configuration, deployment

Diese Sprachregel hilft mir schnell zu verstehen, wo ich arbeiten soll und welcher Kontext gemeint ist.
