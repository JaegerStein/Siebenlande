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

Die Lore hängt vollständig unter `Legende/`, damit die vierteilige
Website-Navigation (Journal | Legende | Regeln | Werkzeuge) erhalten bleibt.

```
Siebenlande/
├── Legende/               # Worldbuilding - Lore der Spielwelt
│   ├── Welt/              # die Welt als Sache
│   │   └── Geografie/     # Gebiete/ (Rangstufen), Landschaften/, Orte/
│   ├── Wesen/             # die Handelnden
│   │   ├── Charaktere/    # Individuen, nach Volk; Unbekannt/ wo ungeklärt
│   │   ├── Kreaturen/     # Wesensarten ohne Individualität
│   │   └── Völker/        # Weltliche/{Sterbliche,Unsterbliche,Variationen}
│   ├── Gesellschaft/      # das Gemachte
│   │   ├── Herrschaft/    # 1 Sitze … 5 Reiche (politisch, nicht geografisch)
│   │   ├── Gruppen/       # Bünde/, Kirchen/
│   │   ├── Kultur/        # Maße/, Philosophie/Glaube/
│   │   └── Geschichte/    # Zeitrechnung/
│   └── Mythologie/        # Mythen/Geschöpfe/Idole/ (Götter etc.)
├── Regeln/                # Spielsystem - Mechaniken & Regelwerk
│   ├── Charakter/         # Charaktererstellung & -entwicklung
│   ├── Grundlagen/        # Basis-Spielmechaniken
│   ├── Kampf/             # Kampfsystem (Nah-, Fernkampf, Rüstung)
│   └── Spielbare Völker/  # Rasseneigenschaften
├── Journal/               # Kampagnen-Tracking - Laufende Spielsitzungen
│   ├── Die Questerei/     # Spielercharaktere, dazu Begleiter/ und Ehemals/
│   ├── Kampagne/          # chronologische Spielsitzungen (Episoden)
│   └── Questen/           # Kampagnen- & Personal-Quests
└── Werkzeuge/             # Spielhilfen - Praktische Tools für Spielleitung
```

Drei Regeln tragen den Baum:

- **Wesen werden nach dem Kenntnisstand der Spielergruppe einsortiert.** Dieses
  Repo ist öffentlich, und der Ablageort ist genauso sichtbar wie der Notiztext -
  er ist deshalb Teil der Darstellung, nicht bloß Ablage. Was die Gruppe über ein
  Wesen weiß, entscheidet, wo es liegt.
  - Maßgeblich ist der Kenntnisstand am Spieltisch, nicht der Notiztext - die
    Notizen hinken hinterher. Aus dem Fehlen einer Angabe folgt also nichts.
  - **Bei Wesen niemals aus einer anderen Quelle als diesem Repo ergänzen, und im
    Zweifel den Spielleiter fragen statt selbst zu schließen.** Bei Angaben ohne
    erzählerisches Gewicht - Herkunftsland eines Menschen etwa - ist Ergänzen
    unkritisch.
  - `Charaktere/Unbekannt/` ist für Wesen, deren Art am Tisch nie geklärt wurde.
    Es ist kein Fach für eigene Zweifel.
- **Journal vs. Legende** - im Journal steht nur, was die Gruppe selbst ist und
  tut; alle NSCs, Orte, Reiche und Kreaturen liegen in der Legende, auch wenn die
  Gruppe ihnen begegnet ist.
- **Geografie vs. Herrschaft** - `Welt/Geografie/` ist rein physisch, politische
  Einheiten (Königreiche, Grafschaften, Provinzen) hängen unter
  `Gesellschaft/Herrschaft/`. Ein Reich ist kein Ort.

`_attachments/` spiegelt diese Struktur; Obsidian löst `![[Datei.jpg]]` aber
vaultweit über den Dateinamen auf, der Ablageort ist also unkritisch.

### Aktueller Stand (Stand: September 2026)
- **Legende**: ~55 Dateien - 7 etablierte Königreiche
- **Regeln**: ~28 Dateien - Vollständiges Charaktersystem mit Stufen & Talenten
- **Journal**: ~33 Dateien
  - Episoden: Prolog bis Episode 9
  - Spielercharaktere, Begleiter und laufende Questen
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

## Design-Standards

### Episode-Struktur

**Template-Datei**: `Siebenlande/_templates/_Episode.md`
**Referenz-Beispiel**: `Siebenlande/Journal/Kampagne/Episode 0 - Prolog.md`

Episoden folgen einem standardisierten Format:

1. **Frontmatter**
   - Tags: `#Episode`
   - Aliases: Episodennummer + Kurzname/Titel
   - Optional: `draft: true` für Work-in-Progress

2. **Navigation**
   - Bidirektionale Links zu vorheriger/nächster Episode
   - Oben: Vorwärts-Link | Unten: Vorwärts + Rückwärts-Link

3. **Metadaten**
   - Dauer in Sitzungen
   - In-Game Zeitraum mit Zeitrechnungs-Link

4. **Narrativer Haupttext**
   - Zusammenhängende Prosa (keine Stichpunkte)
   - Extensive Wiki-Verlinkung ([[Charaktere]], [[Orte]], [[Konzepte]])
   - Lesbar wie eine Kurzgeschichte

5. **Strukturierte Schnellübersicht** (am Ende)
   - **Getroffene Charaktere** - NPCs mit Kurzbeschreibung
   - **Besuchte Orte** - Locations mit Kontext
   - **Erhaltene Artefakte** - Items, Schätze, wichtige Gegenstände
   - **Anmerkungen** - Verluste + Sonstiges (Cliffhanger, Quest-Fortschritte)

**Verwendung:**
- Für neue Episoden: Template in Obsidian verwenden, Platzhalter `{PLATZHALTER}` ersetzen
- Für Aufbereitung: Bestehende Episoden nach diesem Muster strukturieren
- Obsidian-Kommentare: `%% Kommentar %%` (nicht HTML-Kommentare)

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
