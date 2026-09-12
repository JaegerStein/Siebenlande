/**
 * Regression checks for the rules engine.
 *
 * These pin the worked examples printed in `Siebenlande/Regeln/Magie/Magie.md`
 * plus the binding rules the chapter states in prose, so a change to the
 * catalogue or the resolver that breaks the rule text fails loudly.
 *
 *   npm run test
 */
import { COMPONENTS, COMPONENT_BY_ID } from "../src/data/components"
import type { Placed } from "../src/data/types"
import { resolve } from "../src/engine/resolve"

let uid = 0
const chain = (...ids: string[]): Placed[] =>
  ids.map((componentId) => {
    if (!COMPONENT_BY_ID.has(componentId)) throw new Error(`Unbekannte Komponente: ${componentId}`)
    return { uid: `u${++uid}`, componentId }
  })

const failures: string[] = []
const check = (name: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  const detail = ok ? "" : ` — erwartet ${JSON.stringify(expected)}`
  console.log(`${ok ? "  ok" : "FAIL"}  ${name}: ${JSON.stringify(actual)}${detail}`)
  if (!ok) failures.push(name)
}

const line = (placed: Placed[], key: string) => resolve(placed).lines.find((l) => l.key === key)

console.log(`Katalog: ${COMPONENTS.length} Komponenten\n`)
check("Ids sind eindeutig", COMPONENT_BY_ID.size, COMPONENTS.length)

console.log("\n— Kostenbeispiele aus dem Regeltext —")

// 3 verschiedene Kleine, 2 verschiedene Mittlere, 1 Große = 1+1+1+2+2+3 = 10
check(
  "3 versch. Klein + 2 versch. Mittel + 1 Groß",
  resolve(
    chain(
      "reichweite.klein",
      "laenge.klein",
      "breite.klein",
      "reichweite.mittel",
      "laenge.mittel",
      "reichweite.gross",
    ),
  ).level,
  10,
)

// 3 identische Kleine + 1 Große = 1+2+3+3 = 9
check(
  "3 identische Klein + 1 Groß",
  resolve(chain("reichweite.klein", "reichweite.klein", "reichweite.klein", "ziele.gross")).level,
  9,
)

// 3 identische Mittlere + 1 Große = 2+4+6+3 = 15
check(
  "3 identische Mittel + 1 Groß",
  resolve(chain("reichweite.mittel", "reichweite.mittel", "reichweite.mittel", "ziele.gross"))
    .level,
  15,
)

console.log("\n— Identität läuft über die Tabellenzeile —")

// Zwei Mal dieselbe Zelle ist eine Wiederholung: 1 + 2 = 3.
check(
  "^1 zweimal = 3 Stufen",
  resolve(chain("bessere-wuerfel.klein", "bessere-wuerfel.klein")).level,
  3,
)
// ^1 und ^2 sind verschiedene Komponenten: 1 + 2 = 3, aber ohne Aufschlag.
check(
  "^1 + ^2 = 3 Stufen",
  resolve(chain("bessere-wuerfel.klein", "bessere-wuerfel.mittel")).level,
  3,
)
// Der Unterschied wird beim dritten Mal sichtbar: 1+2+3 = 6 gegen 1+2+2 = 5.
check(
  "^1 dreimal = 6 Stufen",
  resolve(chain("bessere-wuerfel.klein", "bessere-wuerfel.klein", "bessere-wuerfel.klein")).level,
  6,
)

console.log("\n— Steigerungen binden rückwärts —")

const feuerball = chain(
  "schaden.mittel",
  "feuer.klein",
  "bessere-wuerfel.klein",
  "mehr-wuerfel.klein",
  "flacher-wert.klein",
)
check("Feuerball-Wert", line(feuerball, "Schaden")?.value, "2W6+1")
check("Feuerball-Bezug", line(feuerball, "Schaden")?.note, "Feuer")
check("Feuerball-Stufe", resolve(feuerball).level, 6)
check("Feuerball ohne Warnung", resolve(feuerball).warnings, [])

// Die nächste passende Komponente davor gewinnt, nicht die erste.
const zweiWirkungen = chain(
  "schaden.mittel",
  "feuer.klein",
  "ausdauer-heilen.mittel",
  "mehr-wuerfel.klein",
)
check(
  "Steigerung trifft die nähere Wirkung",
  line(zweiWirkungen, "Ausdauer (heilen)")?.value,
  "2W4",
)
check("die fernere bleibt unverändert", line(zweiWirkungen, "Schaden")?.value, "1W4")

check("Steigerung ohne Bezugsobjekt warnt", resolve(chain("mehr-wuerfel.klein")).warnings.length, 1)
check(
  "Steigerung modifiziert keine Steigerung",
  resolve(chain("bessere-wuerfel.klein", "mehr-wuerfel.klein")).warnings.length,
  2,
)
check(
  "Würfelleiter endet bei W20",
  line(
    chain("schaden.mittel", "feuer.klein", "bessere-wuerfel.gross", "bessere-wuerfel.gross"),
    "Schaden",
  )?.value,
  "1W20",
)

console.log("\n— Bezug —")

check("Schaden ohne Bezug warnt", resolve(chain("schaden.mittel")).warnings.length, 1)
check("Bezug ohne Wirkung warnt", resolve(chain("feuer.klein")).warnings.length, 1)
// Art-Interaktionen laufen zwischen Gruppen, nicht innerhalb: eine Schadensart
// bedient "RW unterstützen" nicht, obwohl beide die Art Würfel tragen.
check(
  "Schadensart bedient RW unterstützen nicht",
  resolve(chain("rw-unterstuetzen.mittel", "feuer.klein")).warnings.length,
  2,
)
check(
  "Attribut bedient RW unterstützen",
  resolve(chain("rw-unterstuetzen.mittel", "weisheit.klein")).warnings,
  [],
)
check(
  "Alle Zustände bedient Zustand aufheben",
  resolve(chain("zustand-aufheben.mittel", "alle-zustaende.gross")).warnings,
  [],
)

console.log("\n— SG erschweren: die dokumentierte Ausnahme in derselben Gruppe —")

const zustand = chain("zustand-verursachen.klein", "zustand.klein", "sg-erschweren.mittel")
check("Zustand-Stufe", resolve(zustand).level, 4)
check("Zustand-RW", line(zustand, "Zustand verursachen")?.note, "RW 15 (10 + 4 - 1 + 2)")

console.log("\n— Stapeln, Ziele, Dauer —")

check(
  "Reichweiten stapeln",
  line(chain("reichweite.klein", "reichweite.mittel"), "Reichweite")?.value,
  "90 Fuß",
)
check("Standarddauer ist eine Runde", line(chain("konzentration.klein"), "Dauer")?.value, "1 Runde")
check(
  "Runden skalieren flach",
  line(chain("runden.gross", "flacher-wert.mittel"), "Dauer")?.value,
  "4 Runden",
)
check(
  "Ziele skalieren flach",
  line(chain("ziele.gross", "flacher-wert.gross"), "Ziele")?.value,
  "5",
)
check(
  "ohne Reichweite gilt Berührung",
  line(chain("vorteil.gross"), "Reichweite")?.value,
  "Berührung",
)

console.log(
  failures.length === 0
    ? "\nAlle Prüfungen bestanden."
    : `\n${failures.length} fehlgeschlagen: ${failures.join(", ")}`,
)
if (failures.length > 0) process.exitCode = 1
