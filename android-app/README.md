# Lesen, entdecken, erzählen – Android-App

**Gesicherter Android-Quellstand: 1.1.21 · Versionscode 23 · 30. Oktober 2026**

Der vollständige Quellstand der am 29. Oktober 2026 gebauten und signierten Version 1.1.21 ist jetzt gesichert. Änderungen, Prüfungen und AAB-Prüfsumme stehen in [RELEASE-1.1.21.md](RELEASE-1.1.21.md) und [RELEASE-1.1.21.json](RELEASE-1.1.21.json). Neuere Repository-Änderungen wurden erhalten. Der Startbildschirm wurde bei der Quellsicherung nicht verändert. Der aktuelle Veröffentlichungsstatus in Google Play ist nicht bestätigt.

Vollständige Kauf-App, einmalig 5,99 EUR über Google Play. Alle sieben Spiele enthalten; keine In-App-Käufe und kein Abo. Dieser Ordner archiviert die aktuelle native Capacitor-App. Die Browser-/GitHub-Pages-Fassung im übergeordneten Repository wird damit nicht ersetzt.

## Enthaltene Verbesserungen

- Größere Aufgabenschrift, Textzoom von 100 bis 300 Prozent, Zwei-Finger-Zoom und separate Ansicht „Groß lesen“ in allen sieben Spielen.
- Aufgeräumte Hauptauswahl und Kategorien: eigene Überschriftsleiste, mittige Spielkacheln, mehr Abstand und größere Kacheln auf großen Bildschirmen.
- Überarbeitete Würfelspiel-Anordnung und zusätzliche Tasten für die Spielfeldgröße.
- Keine Web-Installationsfunktion im nativen Paket; der Paketcheck weist eine versehentliche Übernahme zurück.

- Sieben Spiele vollständig verfügbar, ohne Kauf- oder Freischaltmenüs.
- Belohnungen in drei Würfelwelten nach 1, 3, 7, 12, 18, 25 und 32 Abschlüssen, je Profil gespeichert.
- Einheitliche Kartenmechanik, Navigation und Neustart-Verhalten.
- Pinch-Zoom bis 35 Prozent, bessere Darstellung im Querformat und Rückkehr zur bewusst gewählten Grundgröße.
- Profile, Sicherung und Wiederherstellung vorhandener Spielstände.
- Verlustfreie Bildoptimierung; zwei unbenutzte alte Vorschaudateien aus dem Build ausgeschlossen.

## Voraussetzungen

Node.js 22 oder neuer, npm, Java 21, Android SDK mit API 36 und passenden Build Tools. ANDROID_HOME auf das SDK setzen oder Android Studio den lokalen SDK-Pfad anlegen lassen. Die Datei android/local.properties bleibt lokal. Mindestversion auf Geräten: Android 7.0 (API 24).

## Bauen und prüfen

Alle Befehle in diesem Ordner ausführen. Unter Linux/macOS vor dem Android-Bau einmal `chmod +x android/gradlew` ausführen:

```sh
npm ci
npm run android:sync
npm test
npm run check
```

Der Sync erzeugt www/, Android-Web-Assets und Capacitor-Konfiguration aus den Quellen. Diese erzeugten Dateien gehören nicht ins Git-Repository. Der leere Ordner migration/ wird für die generierten Sicherungshilfen benötigt und durch .gitkeep erhalten.

Lokale Test-APK (separate Kennung, keine Produktions-App überschreiben):

```sh
npm run android:debug
```

## Play-Bundle signieren

Die ursprüngliche Upload-Signierdatei wird separat benötigt. Folgende Umgebungsvariablen nur lokal für den Prozess setzen, niemals committen:

- LESESPIELE_KEYSTORE: Pfad zur Signierdatei
- LESESPIELE_STORE_PASSWORD: Kennwort der Signierdatei
- LESESPIELE_KEY_ALIAS: Alias des Upload-Schlüssels
- LESESPIELE_KEY_PASSWORD: Kennwort des Schlüssels

```sh
npm run android:aab
```

Ergebnis: android/app/build/outputs/bundle/release/app-release.aab. Vor jedem neuen Upload Versionsname und Versionscode in release-settings.json aktualisieren; Code 21 ist bereits für 1.1.19 verwendet. Code 22 ist für 1.1.20 vorbereitet und vor einem Upload mit dem Play-Console-Stand abzugleichen. App-ID: de.heikeamthor.lesespiele. Veröffentlichungen erfolgen ausschließlich nach gesondertem Auftrag.

## Quelldateien und Bilder

src/ enthält gemeinsame App-Funktionen, web-source/ die Spiele, android/ das native Projekt, tests/ die Regressionstests. Die Dateinamen lite-policy.js und lite-view.js sind historische Kompatibilitätsnamen: Die Kaufversion ist immer vollständig und hat keine Lite-Beschränkung.

optimized-images/ enthält ausschließlich die im Manifest benötigten Dateien. Ein regulärer Build benötigt kein Python. Nur bei neuen/geänderten Bildquellen die Optimierungsdaten mit Python und Pillow neu erzeugen:

```sh
python -m pip install Pillow
python scripts/prepare-lossless-images.py
```

Anschließend npm run android:sync und die Prüfungen wiederholen. web-source/ enthält auch ursprüngliche, vom App-Build ausgeschlossene Dateien für die nachvollziehbaren SHA256-Herkunftsnachweise. source-provenance.json ist der ursprüngliche Herkunftsstand, lite-source-provenance.json dokumentiert spätere Quelländerungen. Hashes bei Quelländerungen bewusst nachführen; nicht die Prüfung deaktivieren.

## Dokumentation

Aktueller Stand: LITE-STATUS.md. Neuer vorbereiteter Stand: RELEASE-1.1.20.md. Letzte gebaute Release-Identität: RELEASE-1.1.19.json. Prüfumfang und Grenzen: PRUEFUNG.md. Alte In-App-Kaufanleitungen und lokale Diagnose-/Signierhelfer mit gerätespezifischen Pfaden gehören nicht zum aktuellen GitHub-Paket.

