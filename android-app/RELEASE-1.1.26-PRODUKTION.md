# Android-Update 1.1.26 · Produktionspaket

Das Paket basiert auf dem veröffentlichten Quellstand `d389ae6d022e22cea82202a635ad85e6d732fbd4` einschließlich aller bis dahin umgesetzten Änderungen. Alle 304 Dateien der eingebauten Spiele sind bytegleich mit dem aktuellen Android-Webpaket. Das Paket wurde vollständig mit Gradle und R8 gebaut; es wurde keine alte Android-Hülle nachträglich verändert.

- Produktions-App-ID: `de.heikeamthor.lesespiele`.
- Version: `1.1.26`, Versionscode: `28`.
- Mindestversion: Android 7.0 / API 24; Ziel-API 36.
- Nicht debugfähig, kein `testOnly`, kein Test-Suffix.
- Offline-Impressum, ausschließlich auf die Google-Play-App bezogene Datenschutzhinweise und Kontakt zur Entwicklerin enthalten.
- Navigation, Profilfortschritte, Wiederaufnahme und Spielregeln entsprechen dem aktuellen App-Stand.

## Bauen

`npm run android:aab:unsigned` erzeugt ein ausdrücklich nicht signiertes Produktionspaket zur anschließenden lokalen Signierung. Die regulären Aufgaben `android:aab` und `android:apk` verlangen weiterhin die konfigurierten Upload-Schlüssel. Die neue Variante erlaubt keinen versehentlich debug-signierten Store-Upload.

Ausgabe: `android/app/build/outputs/bundle/unsignedRelease/app-unsignedRelease.aab`. Zur Weitergabe heißt die Datei `Lesespiele-Play-1.1.26-unsigned.aab`.

## Signieren und hochladen

Das Downloadpaket `Lesespiele-Android-Update-1.1.26.zip` enthält das Bundle, eine mit Java 11 kompatible lokale Signierhilfe, Windows-Startdatei, Anleitung, Versionshinweise und Prüfsummen. Der Quelltext der Hilfe liegt unter `tools/update-signing-1.1.26/`.

Die Signierhilfe ist auf den SHA256 dieses Bundles und das bisher dokumentierte Upload-Zertifikat aus 1.1.21 festgelegt. Sie verwendet die vorhandene Keystore-Datei und speichert oder überträgt keine Kennwörter. Die erzeugte Datei `Lesespiele-Play-1.1.26.aab` wird vor Abschluss vollständig kryptografisch geprüft.

## Prüfung und Status

- Gradle-Bau einschließlich R8 und Bundletool-Validierung erfolgreich.
- Produktions-App-ID und Version aus dem fertigen Bundle gelesen; keine Debug- oder Testkennzeichnung.
- Alle 304 Webpaket-Dateien im Bundle geprüft.
- Alle 9 Testdateien und die Paketprüfung erfolgreich.
- Signierhilfe am vollständigen Bundle mit einem getrennten Prüfschlüssel getestet; unpassender Bundle-Hash wird abgewiesen.
- Der reguläre signierte Release-Bau bleibt ohne Upload-Schlüssel gesperrt.

SHA256, Größe und Zertifikatsfingerabdruck stehen in RELEASE-1.1.26-PRODUKTION.json. Die hier vorhandenen Play-Console-Zugänge und Upload-Schlüssel reichen nicht für einen Store-Upload; es wurde nichts bei Google Play veröffentlicht. Offen bleiben die Signierung mit dem bisherigen Upload-Schlüssel, ein physischer Gerätetest und der Play-Console-Upload. Vor dem Upload den höchsten bereits verwendeten Versionscode abgleichen.
