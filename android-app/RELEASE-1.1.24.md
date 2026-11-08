# Android-Testbuild 1.1.24 · 8. November 2026

Der neue Stand enthält die Bedienungs- und Wiederaufnahme-Korrekturen aus Commit `01b709a`. Die Spielmechanik wurde beibehalten. Siehe auch [Änderungen für den Handytest](../WEB-UPDATE-2026-11-08.md).

- Versionsname: `1.1.24-test`, Versionscode: `26`.
- Test-App-ID: `de.heikeamthor.lesespiele.test`.
- Anzeigename: **Lesespiele Test**.
- Debug-signierte APK; kein Play-Release und keine Signierung mit dem Upload-Schlüssel.
- Die Test-App installiert sich neben der Produktions-App und hat eigene lokale Profile und Fortschritte. Vorhandene Profile können über eine Sicherungsdatei übertragen werden.
- Alle sieben Spiele und die neuen kurzen Spielregeln sind lokal enthalten.

## Bau und Prüfung

`assembleDebug` erfolgreich. Die APK-Signatur wurde mit `apksigner` geprüft. Paketkennung, Version, Anzeigename und Mindestversion Android 7.0 wurden aus der fertigen APK ausgelesen. Alle 303 Dateien des erzeugten Webpakets stimmen bytegenau mit den APK-Assets überein. Die automatischen Prüfungen und der mobile Chromium-Test des Android-Webpakets sind erfolgreich.

Testdatei: `Lesespiele-Test-1.1.24.apk` (56.806.046 Bytes). SHA256 und Prüfnachweis: [RELEASE-1.1.24.json](RELEASE-1.1.24.json). Die APK ist ein separater Download und wird nicht ins Quellrepository eingecheckt.

## Test auf dem Handy

1. Die APK auf das Android-Handy herunterladen und installieren. Falls Android danach fragt, die Installation für die verwendete Download-App zulassen.
2. **Lesespiele Test** öffnen und ein Profil anlegen.
3. Eine Würfelrunde beginnen, zur Spielauswahl zurückkehren und dieselbe Runde wieder öffnen. Die Positionen und die offene Aufgabe müssen erhalten bleiben.
4. Eine Geschichte bis Karte 3 lesen, das Spiel verlassen und wieder öffnen. Karte 3 muss wieder erscheinen. Zurückblättern und erneutes Öffnen sollen ebenfalls die zuletzt angezeigte Karte erhalten.
5. Ein zweites Kinderprofil anlegen und prüfen, dass es eigene Fortschritte hat. Zurück zum ersten Profil wechseln und dessen Stand kontrollieren.
6. „So geht’s“ und anschließend die Android-Zurücktaste testen: Zuerst schließen sich die Regeln; das Spiel bleibt geöffnet.
7. App schließen, Flugmodus einschalten, App erneut starten und alle sieben Spiele öffnen.

Die Webversion ist unter https://hamthor-web.github.io/Spielesammlung-fuer-Lesefreude-/ verfügbar. Unter „Für Erwachsene“ wird Web-Version 1.1.22 angezeigt. Ihre wichtigsten veröffentlichten Dateien wurden per SHA256 mit dem geprüften Quellstand verglichen.

Ein physischer Android-Gerätetest muss noch durchgeführt werden. Vor einem späteren Play-Upload den höchsten verwendeten Versionscode abgleichen und ein separates Release mit dem vorhandenen Upload-Schlüssel signieren.
