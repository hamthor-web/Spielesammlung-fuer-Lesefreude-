# Web-Update: Eingangsanimationen · 05.11.2026

Heike hat die drei Eingangsanimationen nach Test der separaten Webfassung
bestätigt und die Veröffentlichung im GitHub-Repository der Webversion beauftragt.

- Würfeln: Würstchen mit Würfel auf dem Spielbrett.
- Geschichten: Drachenflug im Herbstpark.
- Verrücktes: Ameise auf der Schulter, rosa Eiskugel in die Eiswaffel vor dem Eisladen.
- Jede Einleitung läuft beim Einstieg über die vorhandene Kachel einmal.
- Das Schlussbild bleibt zwei zusätzliche Sekunden stehen.
- Überspringen öffnet die Auswahl sofort; Zurück bricht die Einleitung ab.
- Rückkehr aus einem Spiel in seine Auswahl startet keine neue Einleitung.
- Startseiten-Markup und vorhandene Inline-Stile bleiben unverändert.
- Der Offlinecache enthält alle 36 verlustfreien Animationsframes und die
  beiden neuen Laufzeitdateien. Eine Hintergrundaktualisierung lädt die
  Seite während einer Einleitung nicht automatisch neu.

Die separate Testfassung wurde einschließlich der verlängerten Schlussbildzeit
freigegeben. Die drei Sequenzen bestehen aus jeweils zwölf Originalframes;
es wurden keine neuen Bewegungen generiert. Die Pixelauflösung bleibt 358×358.

Prüfung: Übereinstimmung mit der bestätigten Testfassung, JavaScript-Syntax,
unveränderte Startseitenstile und -Markups sowie vollständige Offline-Dateiliste.
Die zusätzliche Standzeit und sofortiges Überspringen wurden für alle drei
Welten in einer kontrollierten Laufzeitprüfung geprüft. Frühere Browserprüfung:
Handy und Tablet hoch/quer, Desktop, Wiederholung und Rücknavigation.
Echte Geräte- und vollständige Offlineabnahme bleiben offen.

Dieses Update betrifft ausschließlich die Webversion. Android-Quellen,
Signierung, APK/AAB und Google-Play-Veröffentlichung werden nicht geändert.

## Hochformat-Korrektur nach Rückmeldung

Die bisherige Einspalten-Regel galt nur bis 760 CSS-Pixel Breite. Auf größeren
Tablets oder schmalen hohen Desktopfenstern wurden deshalb im Hochformat drei
Spalten angezeigt. Heike hat die senkrechte Anordnung für jedes Hochformat
beauftragt. Die Regel gilt nun unabhängig von der Breite. Die quadratischen
Kacheln teilen die verfügbare Höhe nach Abzug von Profilnavigation, Banner,
Abständen und unterem Rand; Mindestgröße 144 Pixel zur Lesbarkeit auf sehr
kurzen Ansichten, bei Bedarf bleibt Scrollen möglich.

Chromium-Viewportprüfung: 390×844, 768×1024, 820×1180 und 1024×1366 zeigen
drei Kacheln untereinander und innerhalb der verfügbaren Höhe. Wechsel nach
844×390 stellt wieder die bestehende Reihe her; beim Zurückdrehen wird erneut
eine Spalte angezeigt. Eingangsanimation und anschließende Spielauswahl geprüft.
Die Hintergrundbilder, Kachelmotive und die Querformatregeln bleiben erhalten.
Der Service-Worker-Cache wird zur Auslieferung der Korrektur erneuert.
