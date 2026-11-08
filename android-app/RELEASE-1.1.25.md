# Android-Testbuild 1.1.25 · 8. November 2026

Version `1.1.25-test`, Versionscode `27`, Test-App-ID `de.heikeamthor.lesespiele.test`, Anzeigename **Lesespiele Test**. Die Test-App verwendet dieselbe Debug-Signatur wie 1.1.24-test und kann diese Testversion aktualisieren. Sie ersetzt die Produktions-App nicht.

Der Erwachsenenbereich bietet jetzt **Impressum**, **Datenschutz** und **Hinweise / Nachricht an die Entwicklerin** mit der Adresse `lesespiele.heike.amthor@gmx.de`. Die Anbieterangaben stammen aus dem vom Nutzer genannten Impressum. Die lokalen Rechtstexte sind auch ohne Kinderprofil und offline erreichbar; der Rückweg erhält die offene Erwachsenenansicht. Die E-Mail-App wird erst durch einen bewussten Tipp aufgerufen, eine Nachricht nicht automatisch verschickt.

Der vorhandene Canva-Website-Datenschutz bezieht sich auf die Informationswebsite. Die App-Datenschutzhinweise beschreiben zusätzlich lokale Profile, laufende Runden, Spielstände, Einstellungen, die lokale Android-Sicherung, selbst exportierte Dateien, Google Play und E-Mail-Kontakt. Externe Website-Links werden nur auf Wunsch geöffnet und laden keine externen Inhalte für das Spielen. Die Ergänzung für die Canva-Website steht separat in [DATENSCHUTZ-APP-ERGAENZUNG-WEBSITE.md](../DATENSCHUTZ-APP-ERGAENZUNG-WEBSITE.md).

`assembleDebug`, alle 9 Testdateien und die Paketprüfung sind erfolgreich. Die APK-Signatur, App-ID und Version wurden geprüft. Alle 304 Webpaket-Dateien stimmen bytegenau mit den APK-Assets überein. Im mobilen Chromium wurden Impressum und Datenschutz vor der Profilauswahl, offline, in Hoch- und Querformat sowie die Rückwege geprüft. Beim Lesen der lokalen Hinweise wurden keine externen Abrufe ausgelöst.

Datei: `Lesespiele-Test-1.1.25.apk`. Größe und SHA256: [RELEASE-1.1.25.json](RELEASE-1.1.25.json). Die APK ist ein separater Download und wird nicht in Git eingecheckt. Ein physischer Android-Gerätetest steht aus; kein Upload zu Google Play.

Handytest: „Lesespiele Test“ öffnen, vor der Profilauswahl „Für Erwachsene · Impressum, Datenschutz und Hilfe“ wählen, beide Hinweise lesen und mit Zurück wieder schließen. Im Flugmodus wiederholen. Kontaktadresse und den Wechsel zur E-Mail-App prüfen. Die Webversion trägt die Versionsnummer 1.1.23.
