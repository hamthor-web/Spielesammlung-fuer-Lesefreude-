# Android 1.1.22 · Hintergrundkorrektur

- Versionsname: **1.1.22**; Versionscode: **24**.
- Kaufpaket: `de.heikeamthor.lesespiele`.
- Grundlage: gesicherter Quellstand 1.1.21 plus bestätigte Hintergrundkorrektur (8af10337de2d22f2ba9e61b14b00a91e0c775575).
- Bau und Prüfung: 30. Oktober 2026.

## Änderung

Die Startseite verwendet in beiden Ausrichtungen das unveränderte Originalbild (683 × 1536 Pixel) und füllt ihre gesamte Fläche mit `cover`. Die kleine Hochformatgrafik (180 × 270 Pixel) wird auf der Startseite übersteuert. Die bestätigten Kacheln stehen im Hochformat untereinander und im Querformat nebeneinander; die Höhe der Profilnavigation wird berücksichtigt. Die vorhandenen sieben Spiele, Fertig-Buttons, Profile und Fortschrittsschlüssel bleiben erhalten.

## Dateien und Signierstatus

Das Store-Bundle **Lesespiele-Play-1.1.22-unsigned.aab** ist gebaut und strukturell geprüft, aber noch **nicht mit dem bisherigen Upload-Schlüssel signiert**.

- Größe: 53983263 Bytes.
- SHA-256: `29E93B481E15B27A1F8E9224DF162E4716ED7EB7EE2F6528FD717DD6F74CF5D1`.

Für die Kompilierung wurde ein temporärer Schlüssel verwendet. Dessen JAR-Signatur wurde vollständig aus der ausgelieferten unsigned.aab entfernt. Die ausgelieferte Datei enthält keine temporäre oder fremde Release-Signatur. Die bisherige Signierpflicht des Quellprojekts wurde nicht entfernt.

Die beiliegende `UpdateSignieren.jar` signiert genau diese geprüfte unsigned.aab lokal mit der bestehenden `android.keystore`. Sie prüft den erwarteten Upload-Zertifikatsfingerabdruck, signiert die Datei und liest anschließend alle Inhaltsdateien zur Signaturprüfung. Die Ausgabe heißt `Lesespiele-Play-1.1.22.aab`. Passwort und Schlüssel bleiben lokal. Eine tatsächliche Signierung mit Heikes Upload-Schlüssel wurde hier nicht durchgeführt. Der Quelltext liegt unter `tools/update-signing-1.1.22/`.

Die direkt installierbare Testdatei **Lesespiele-Test-1.1.22.apk** verwendet `de.heikeamthor.lesespiele.test`, Version `1.1.22-test`, Code 24 und ein Android-Debugzertifikat. Sie läuft neben der Kauf-App mit eigenen Profilen und Spielständen.

- Größe: 53464083 Bytes.
- SHA-256: `7E0458A63A864222DD40BCD464D957B4BAD4D11A1B20C983E9E885C7171F9C5A`.

## Prüfung

- Webpaket erzeugt, mit Capacitor nach Android synchronisiert, Projektprüfung und alle 31 bestehenden Tests erfolgreich.
- Nativer Bau `assembleInternalTest`, `bundleRelease` und `lintVitalRelease` erfolgreich.
- Bundletool 1.18.3 validiert die unsigned.aab. Manifest bestätigt Paket, Version 1.1.22 und Code 24.
- APK-Signatur mit apksigner geprüft; aapt bestätigt Test-Paket, Version 1.1.22-test und Code 24.
- In beiden fertigen Android-Dateien sind die Hintergrundpixel identisch mit dem Original; die abschließende CSS-Regel verwendet `cover`. Die drei Würfelspiele enthalten die Fertig-Buttons. Keine Web-Installationsskripte auf der Startseite.
- Browserdarstellung der Quellkorrektur bereits bei Handy-Hoch-/Querformat, Tablet- und Laptopgröße geprüft.
- Signierhilfe mit einem getrennten Prüfschlüssel getestet: Signierung, vollständige Inhaltsprüfung sowie Abweisung falscher Schlüssel und veränderter Dateien erfolgreich. Der private Upload-Schlüssel ist weder enthalten noch für diesen Test verwendet worden.

## Offene Schritte / Projektakte

Bearbeitungsstand: **Android-Update 1.1.22 gebaut; lokale Upload-Signierung und physischer Gerätetest offen.** Die Test-APK dient dem Gerätetest. Anschließend die unsigned.aab lokal signieren und die signierte Ausgabe in Google Play hochladen. Dieser Arbeitsschritt hat keine Play-Veröffentlichung ausgelöst.


## Installationskorrektur der Test-APK · 30.10.2026

Heike meldet: „App aktualisieren?“ und anschließend „Die App wurde nicht installiert“. Das spricht für einen Konflikt mit einer bereits installierten Test-App; die unspezifische Meldung beweist die genaue Ursache nicht. Die ursprüngliche Test-APK war mit einem neu erzeugten Debugzertifikat signiert und nutzte die allgemeine Kennung `.test`.

Zusätzliche Testfassung: `Lesespiele-Hintergrundtest-1.1.22.apk`, Kennung `de.heikeamthor.lesespiele.bg22`, sichtbarer Name „Lesespiele Bildprüfung“, Version 1.1.22-test, Code 24. Sie aktualisiert weder die Kauf-App noch die alte allgemeine Test-App. Spielstände der bestehenden Apps bleiben in deren eigenen App-Bereichen.

Die bereits gebaute Test-APK wurde ausschließlich in Manifest- und Ressourcenmetadaten isoliert, neu ausgerichtet und mit einem separaten Testzertifikat signiert. Kein erneuter nativer Vollbau. Alle Assets und DEX-Dateien wurden byteweise mit der ursprünglichen Test-APK verglichen und sind unverändert. APK-Signaturen v2/v3 und Manifestangaben wurden erfolgreich geprüft. SHA-256: `85438117B23591B4C39699C391B1B7354D845F5471B9CCBC9D6FF8C1E1F409F7`. Ein Gerätetest bleibt offen. Die Gradle-Konfiguration für internalTest übernimmt Kennung und sichtbaren Namen für spätere Quellbauten. Store-Bundle und Kaufpaket werden dadurch nicht geändert.
