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

## Nachkorrektur: Originalhintergrund und alle Spielauswahlen

Heike beanstandete den erneut unscharfen und nicht flächendeckenden
Startseitenhintergrund sowie weiterhin nebeneinanderliegende Spielvorschauen
im Hochformat. Die vorherige Korrektur hatte nur die Startkacheln erfasst.

- Der aktive Hochformat-Verweis auf die alte 180×270-Datei wird entfernt.
  Die Startseite verwendet in allen Ausrichtungen das vorhandene Original
  start-wiese.png, 683×1536 Pixel, mit background-size: cover. Der Hintergrund
  bedeckt auch über die sichtbare Höhe hinausgehende Inhalte. Keine künstliche
  Nachschärfung, kein neues Bild; Auflösung des Originals bleibt die Grenze.
- Alle drei Kategorieauswahlen nutzen im Hochformat eine senkrechte Anordnung.
  Würfeln erhält drei gleichmäßig bemessene Zeilen, Geschichten und Verrücktes
  je zwei. Bilder bleiben quadratisch und werden an die verfügbare Höhe
  angepasst. Auf sehr kurzen Ansichten sind mindestens 144 Pixel und Scrollen
  vorgesehen, um die Lesbarkeit zu erhalten.
- Der vorhandene Querformat-Aufbau und die sieben Spieldateien bleiben erhalten.

Vor der Veröffentlichung in einer lokalen, vollständigen App-Kopie geprüft:

| Prüfung | Umfang | Ergebnis |
|---|---|---|
| Auswahlansichten | Start, Würfeln, Geschichten, Verrücktes × acht Viewports | 32 Prüfungen ohne Kachelüberlagerung, Verzerrung oder horizontalen Kachelüberlauf; Hochformat jeweils eine Spalte |
| Viewports | 320×568, 360×640, 390×844, 768×1024, 820×1180, 1024×1366, 844×390, 1366×768 | Kleine, übliche und große Ansichten abgedeckt |
| Formatwechsel | Alle vier Auswahlseiten jeweils quer und wieder hoch | Acht Prüfungen, automatische Neuanordnung korrekt |
| Spieleinstiege | Alle sieben Spiele bei 390×844 und 768×1024 | 14 erfolgreiche Öffnungs-/Rückkehrprüfungen; Zielkategorie korrekt, keine neu gestartete Einleitung beim Rückweg |
| Hintergrund | Aktive CSS-Quelle und geladenes Bild im Browser | start-wiese.png, 683×1536, cover; Original visuell kontrolliert |
| Browserfehler | App-Meldungen der Prüfseite | Keine JavaScript-Fehler der App aufgezeichnet |
| Statische Prüfung | HTML-Skripte, Service Worker, Offline-Dateien | Syntax gültig, 348 Cachedateien vorhanden |

Die Einleitungen und ihre Laufzeitdatei wurden nicht verändert. Ihre Zielwelten
bleiben erreichbar; die zwei zusätzlichen Sekunden Schlussbildzeit bleiben
erhalten. Die Tests wurden mit Chromium-Viewports durchgeführt, nicht auf
physischen Endgeräten. Ein vollständiges Durchspielen aller sieben Spiele oder
eine neue vollständige Offlineabnahme wird damit nicht behauptet.
