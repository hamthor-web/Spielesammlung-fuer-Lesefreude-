# Android 1.1.25 / Code 27 · Korrektur der Paketgröße · 05.11.2026

Heikes Screenshot aus der Play Console zeigt für den hochgeladenen Versionscode 26 eine Größenwarnung, keinen Signaturfehler. Der Upload wurde angenommen; eine Veröffentlichung ist dadurch nicht belegt.

## Ursache und Korrektur
Beim Import der aktuellen Webfassung wurden zusätzlich zu den bereits verwendeten verlustfreien WebP-Pokalbildern die 21 historischen PNG-Originale in die Android-Assets kopiert. Die neuen optimierten Quellen benötigen keine erneute Umwandlung; der neue Kopierpfad hatte aber die alten PNG-Dateien mit aufgenommen. Das war ein Fehler im Paketbau für 1.1.24.

Der Build schließt jetzt genau die 21 redundanten pokal-{sport,freizeit,maerchen}-{1..7}.png-Dateien aus. Die PNG-Originale bleiben in den Quellen erhalten. Alle 21 dynamischen Laufzeitpfade lösen durch image-paths.js auf vorhandene WebP-Dateien auf. Ein zusätzlicher Regressionstest prüft dies. Andere Bilder und die Animationen bleiben unverändert; keine neue verlustbehaftete Kompression.

Versionsname 1.1.25, Code 27, Paket de.heikeamthor.lesespiele. Neuer Code erforderlich, weil Code 26 bereits bei Google Play hochgeladen wurde. Die separate Test-APK 1.1.24 B wurde von Heike als funktionierend bestätigt; das ist keine dokumentierte vollständige Abnahme aller sieben Spiele. Die Korrektur dieses Releases betrifft den Paketumfang, nicht die Spiele.

## Prüfung
36 automatisierte Tests und die Quellen-/Paketprüfung bestanden. Gradle-Bau, Bundletool-Validierung, Manifestprüfung, Vergleich aller beibehaltenen Webdateien mit 1.1.24 sowie Artefaktgröße und Prüfsummen werden in RELEASE-1.1.25.json dokumentiert. Die Signierhilfe 1.1.25 ist auf den neuen AAB-Hash und denselben bisherigen Upload-Zertifikatsfingerabdruck festgelegt.

## Übergabe
AAB und Signierhilfe werden einzeln bereitgestellt, da der Download des großen ZIP-Pakets zuvor fehlschlug. Die neue AAB muss mit der neuen Signierhilfe lokal signiert werden. Das alte 1.1.24-Release noch nicht veröffentlichen; in der Play Console die signierte 1.1.25 / Code 27 verwenden. Lokale Signierung des neuen Bundles, Upload, erneute Bewertung der Größenwarnung und Veröffentlichung stehen aus.
