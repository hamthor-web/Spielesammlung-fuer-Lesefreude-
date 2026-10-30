# Android: bestätigte Hintergrundkorrektur · 30. Oktober 2026

Grundlage: gesicherter Android-Quellstand 1.1.21, Commit 9a37b61c4f80b70b164a55f46cafa0c4358a3152.

Heike hat die lokale Vorschau `Startbildschirm_Hintergrund_Test.html` bestätigt und die Übernahme in Android beauftragt.

## Übernommene Darstellung

- Das vorhandene Original `web-source/start-wiese.png` (683 × 1536 Pixel) ersetzt auf der Android-Startseite die kleine Hochformatdatei (180 × 270 Pixel).
- Der Hintergrund füllt die gesamte Startseitenfläche einschließlich gegebenenfalls überlaufender Inhalte mit `cover`, ohne Verzerrung und ohne den bisherigen grünen Abschlussstreifen. Je nach Seitenverhältnis wird ein Bildausschnitt sichtbar.
- Die drei vorhandenen Spielkacheln stehen im Hochformat untereinander und im Querformat nebeneinander. Ihre Größe berücksichtigt die verfügbare Bildschirmhöhe und die vorhandene Profilnavigation.
- Die Umsetzung verwendet die bestätigte Originalauflösung. Auf großen Bildschirmen bleibt die Auflösung des Originals die Grenze der Schärfe; es wurde keine künstliche Nachschärfung vorgenommen.
- Die Test-Steuerleiste und die Platzhalterfunktionen der Vorschau werden nicht übernommen. Vorhandene Spielverknüpfungen, Profile, Fortschrittsschlüssel und Navigation bleiben erhalten.

Die Änderung liegt in `src/native-layout.css` und wird über den vorhandenen Android-Build eingebunden. Die Bildoptimierung im Projekt erhält die Bildpixel und löst den lokalen Bildpfad auf. Die Web-App außerhalb von `android-app` wird nicht geändert.

## Release-Status

Das Update ist anschließend als 1.1.22 mit Versionscode 24 gebaut und geprüft worden. Test-APK und unsigned.aab sind fertig; siehe `RELEASE-1.1.22.md`. Die ursprünglichen Unterlagen zu 1.1.21 bleiben erhalten. Lokale Signierung mit dem bisherigen Upload-Schlüssel, physischer Gerätetest und Play-Veröffentlichung stehen noch aus.

## Prüfung der Quellkorrektur

- `npm run build`, `npm run check` und alle 31 vorhandenen Tests erfolgreich.
- `npx cap sync android` erfolgreich; das korrigierte Offline-Webpaket liegt auch im lokalen nativen Android-Projekt.
- Browserprüfung des erzeugten `www/home.html` bei 393 × 852, 852 × 393, 768 × 1024 und 1366 × 768 Pixeln: Originalauflösung 683 × 1536, Hintergrundgröße `cover`, Hochformatkacheln untereinander, kein horizontaler Überlauf; die drei Kacheln bleiben sichtbar.
- Die Würfelkachel öffnet weiterhin die bestehende Kategorie. Keine JavaScript-Fehler bei dieser Prüfung.
- Beim ursprünglichen Schritt der Quellkorrektur noch kein nativer APK/AAB-Bau. Der anschließende erfolgreiche Bau ist in RELEASE-1.1.22.md dokumentiert; der physische Gerätetest bleibt offen.

## Projektverwaltung / nächster Schritt

Bestätigte Entscheidung: Darstellung der Testdatei übernehmen. Bearbeitungsstand: Hintergrundkorrektur im Android-Quellprojekt umgesetzt und geprüft; Test-APK und unsigned.aab 1.1.22 gebaut; Upload-Signierung und Gerätetest offen. Diese Akten-Ergänzung ergänzt die älteren zentralen Projektquellen; sie ersetzt nicht die Release-Unterlagen zu 1.1.21.
