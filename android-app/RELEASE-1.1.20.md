# 1.1.20 – vorbereiteter Android-Quellstand

- Paket-ID: de.heikeamthor.lesespiele
- Versionsname: 1.1.20
- Vorbereiteter Versionscode: 22
- Grundlage: Web-Änderungen bis Commit a9f23c6b0cddbe373120646d6e04470dcd0e4805
- Datum: 28. Oktober 2026

## Änderungen

Größere Aufgabenschrift mit A−/A+, 100–300 Prozent Textgröße, Zwei-Finger-Bedienung und „Groß lesen“ werden über die gemeinsamen nativen Layout-Dateien in alle sieben Spiele eingebunden. Die große Leseansicht schließt Aufgaben nicht ab. Haupt- und Kategorieauswahl erhalten die aktuellen Abstände, größeren Kacheln und getrennten Überschriftsbereiche. Die Würfelspiele übernehmen die geordnete Aufgabenstation und die Spielfeld-Zoomtasten.

Die nativen Spiele, Bildquellen, Sicherung, Profil-IDs und Fortschrittsschlüssel bleiben erhalten. Web-Installationsskripte werden nicht übernommen. Der Paketcheck prüft zusätzlich auf versehentlich eingebaute Web-Installationsfunktionen und auf alle dokumentierten geänderten Quell-Hashes.

## Prüfung dieses Quellstands

- JavaScript-Syntax der geänderten gemeinsamen Dateien geprüft.
- Neun vorhandene Tests zu Sicherung, Navigation und Android-Zurück erfolgreich.
- Textzoom, große Leseansicht, Zurücksetzen, Zwei-Finger-Zoom und ausbleibende versehentliche Aufgabenabschlüsse auf den abrufbaren nativen DOM-Vorlagen von Freizeit, Sport, Finde den Fehler und Verrücktes Fußballspiel erfolgreich geprüft.
- Die gemeinsamen Lesefunktionen wurden zuvor in der Webfassung an allen sieben Spielen geprüft.
- CSS, Kategorieauswahl, sieben Spielverweise und native Offline-Umwandlung geprüft.

Die vollständige npm-Build-/Paketprüfung und ein APK-/AAB-Gerätetest wurden für 1.1.20 nicht ausgeführt. Die Arbeitsumgebung stellt kein passendes Java 21 und keinen Upload-Schlüssel bereit. Es gibt daher noch keine signierte 1.1.20-AAB, keine neue Artefakt-Prüfsumme und keine Veröffentlichung in Google Play.

## Signierten Build erstellen

In der bisherigen Build-Umgebung mit Java 21, Android SDK und dem ursprünglichen Upload-Schlüssel:

```sh
npm ci
npm run android:sync
npm test
npm run check
npm run android:aab
```

Die Signierwerte über die bereits dokumentierten LESESPIELE_*-Umgebungsvariablen lokal bereitstellen. Paket-ID und höchsten verwendeten Versionscode vor dem Play-Upload prüfen. Ausgabe: android/app/build/outputs/bundle/release/app-release.aab.

