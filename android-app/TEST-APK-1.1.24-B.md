# Installationskorrektur Test-APK · 05.11.2026

Heike meldet: Die erste Test-APK bietet eine Aktualisierung an und lässt sich nicht installieren. Die erste APK verwendete de.heikeamthor.lesespiele.test, eine bereits bei früheren Tests verwendete Kennung. Eine Signaturkollision mit einer installierten Testfassung ist wahrscheinlich; ohne Installationsprotokoll nicht abschließend nachgewiesen.

Neu gebaut: Lesespiele-Test-1.1.24-B.apk mit separater Kennung de.heikeamthor.lesespiele.test1124b und sichtbarem Namen Lesespiele Test 1.1.24 B. Auch der FileProvider verwendet die neue Kennung. Keine Deinstallation vorhandener Apps erforderlich. Vorhandene Spielstände werden durch die separate Installation nicht ersetzt; die neue Test-App hat eigene Profile.

Gradle :app:assembleDebug erfolgreich; APK-Signatur verifiziert, Manifestkennung und Provider geprüft; alle 364 Webdateien bytegleich erhalten. Die tatsächliche Installation auf Heikes Gerät steht noch aus.

Das Play-Store-Bundle bleibt unverändert und gehört weiterhin zur Produktionskennung de.heikeamthor.lesespiele. Ausschließlich die Test-App-Kennung wurde korrigiert.
