# Android-Update 1.1.24 · 05.11.2026

Paket `de.heikeamthor.lesespiele`, Versionscode 26. Webgrundlage: `83bf1f56549a59378b1f0e012a4adf892dfaf556`. Neuer Quellstand wird im separaten Branch `android/update-1.1.24-2026-11-05` gesichert; main und die veröffentlichte Webfassung werden durch diesen Auftrag nicht ersetzt.

## Inhalt
Die sieben vorhandenen Spiele erhalten die aktuellen Webverbesserungen: drei freigegebene Eingangsanimationen mit Überspringen/Abbruch und zwei Sekunden Schlussbildstandzeit, Originalhintergrund und Hochformat-Auswahlen, vergrößerbare Suchbilder in eigener Zeile mit Pfeilen, sowie untereinander angeordnete Suchspiel-Lesekarten im Hochformat mit automatischer Sichtbarmachung. Native Navigation, Profile, Spielstandssicherung, Lesezoom und Offlinebetrieb bleiben enthalten. Keine zusätzlichen Spiele oder Memorys integriert.

Die aktuelle Webfassung enthält bereits optimierte Bildressourcen. Sie werden direkt und ohne Neukompression eingebettet. Browserinstallation, Web-Update-Skripte und Service Worker werden beim nativen Build entfernt. Die gemeinsamen Layout-Skripte werden genau einmal pro Spiel eingebunden. Herkunft und Hashes aller importierten Quellen stehen in lite-source-provenance.json.

## Erzeugung und Prüfung
Vollständiger Gradle-Neubau mit JDK 21, Android API 36 und Gradle 8.14.3; assembleDebug und bundleUnsignedRelease erfolgreich, einschließlich lintVitalUnsignedRelease. Kein Patch einer älteren App-Hülle.

35 automatisierte Tests bestanden. Paketprüfung: dokumentierte Quell-Hashes, vorhandene lokale Verweise, keine Browserinstallation, keine Service-Worker-Registrierung und keine externen Laufzeitadressen. Alle 364 erzeugten Webdateien sind im APK und AAB bytegleich nachgewiesen. APK-Signatur v2 verifiziert. Bundletool 1.18.3 validiert das AAB; Manifestprüfung bestätigt Paket, Version/Code, API 24–36 und nicht-debuggable Produktionskonfiguration.

Die Test-APK trägt die separate Kennung de.heikeamthor.lesespiele.test und Version 1.1.24-test. Sie ersetzt die Kauf-App nicht. Das Produktions-AAB ist absichtlich unsigniert. Die Signierhilfe ist auf den exakten AAB-Hash und bisherigen Upload-Zertifikatsfingerabdruck festgelegt. Ein vollständiger Signier-/Signaturtest mit einem getrennten temporären Prüfschlüssel ist dokumentiert; der private Upload-Schlüssel wurde nicht verwendet. Ein falscher Bundle-Hash wird abgewiesen.

## Grenzen und offene Schritte
Der lokale Vorschau-Browser erreichte den Prüfserver nicht. Keine neue visuelle Browserabnahme, kein physischer Handy-/Tablet-Test und kein Store-Upload in diesem Auftrag. Vor Upload sind Gerätetest, Abgleich des höchsten Play-Versionscodes und lokale Signierung mit dem bisherigen Upload-Schlüssel erforderlich. Die Prüfsummen und exakten Artefaktgrößen stehen in RELEASE-1.1.24.json.

## Erneut bauen
Im android-app-Verzeichnis: npm ci, npm run android:sync, npm test, npm run check. Anschließend npm run android:debug für die Test-APK oder npm run android:aab:unsigned für ein unsigniertes Bundle. Der signierte Release-Bau bleibt mit npm run android:aab und den bisherigen LESESPIELE_* Signierwerten verfügbar. Schlüssel und Passwörter gehören nicht ins Repository.
