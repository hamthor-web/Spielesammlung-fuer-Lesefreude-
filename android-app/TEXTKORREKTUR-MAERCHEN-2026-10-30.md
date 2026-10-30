# Märchenfrage: Textkorrektur · 30. Oktober 2026

Heike bestätigt die separat installierbare Hintergrund-Testfassung mit „ok, das ist in Ordnung so“ und beauftragt folgende Korrektur einer Märchenfrage:

- Bisher: „Würdest du lieber auf einem Pferd oder in einer Kutsche fahren?“
- Verbindlicher neuer Wortlaut: „Würdest du lieber auf einem Pferd reiten oder in einer Kutsche fahren?“

Der Wortlaut ist in der Webversion und in `android-app/web-source/wuerfeln-maerchen.html` korrigiert. Der Android-Quellnachweis wurde aktualisiert. Die Web-Offline-Cachekennung ist erhöht, damit das aktualisierte Spiel geladen werden kann.

Prüfung: genau ein Texttreffer je aktiver Quelldatei ersetzt; hochgeladene Blob-Hashes mit den lokal bearbeiteten Bytes abgeglichen; Android-Webpaket neu erzeugt und Projektprüfung erfolgreich.

Bereits bereitgestellte APK- und AAB-Dateien der Version 1.1.22 sind unveränderte frühere Bauartefakte und enthalten diese nachträgliche Satzkorrektur noch nicht. Für die Übernahme auf dem Handy beziehungsweise in das Store-Bundle ist ein erneuter Bau nötig. Die vorhandenen Bauartefakte und Signierhilfe wurden in diesem Textänderungsschritt nicht ersetzt.
