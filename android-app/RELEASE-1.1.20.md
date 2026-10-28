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
- Alle 31 Regressionstests erfolgreich; npm ci, npm run build, npx cap sync android und npm run check erfolgreich.
- Textzoom, große Leseansicht, Zurücksetzen, Zwei-Finger-Zoom und ausbleibende versehentliche Aufgabenabschlüsse auf den vollständigen nativen DOM-Vorlagen aller sieben Spiele erfolgreich geprüft.
- Die gemeinsamen Lesefunktionen wurden zuvor in der Webfassung an allen sieben Spielen geprüft.
- CSS, Kategorieauswahl, sieben Spielverweise und native Offline-Umwandlung geprüft.

Portable Java 21 ist eingerichtet. Die vollständige npm-Build-/Paketprüfung und Android lintVitalRelease sind erfolgreich. Die nativen Release-Java-Quellen sind kompiliert. Die hochgeladene bisherige AAB stimmt anhand SHA-256 mit RELEASE-1.1.19.json überein. Die Signierdatei ist vorhanden; ihre Passwortprüfung und der Zertifikatsabgleich stehen noch aus. Es gibt noch keine signierte 1.1.20-AAB, keine neue AAB-Prüfsumme und keine Veröffentlichung in Google Play. Ein Gerätetest der 1.1.20 wurde noch nicht ausgeführt.

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

