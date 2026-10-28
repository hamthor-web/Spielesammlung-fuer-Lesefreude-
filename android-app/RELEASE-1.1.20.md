# Android 1.1.20 – signiertes Play-Store-Bundle

Paket `de.heikeamthor.lesespiele`, Version **1.1.20**, Versionscode **22**. Erstellt am 29. Oktober 2026 aus dem Android-Quellstand a2d9cf62ff71de389b8182f53407f995f4a65885.

## Änderungen

Alle sieben Spiele erhalten größere Aufgabenschrift, A−/A+ mit 100–300 Prozent Textgröße, Zwei-Finger-Zoom und „Groß lesen“. Das Öffnen und Schließen der Leseansicht erledigt keine Aufgabe. Haupt- und Kategorieauswahl enthalten größere, zentrierte Schaltflächen und getrennte Überschriftsbereiche. Die Würfelspiele erhalten die geordnete Aufgabenstation und Spielfeld-Zoomtasten. Web-Installationsbutton und iPhone-Installierhinweis sind in der nativen App nicht enthalten.

## Validierung

Alle 31 Regressionstests, die Leseinteraktionen auf den nativen DOM-Vorlagen aller sieben Spiele, npm build, Paketprüfung und Capacitor-Synchronisierung waren erfolgreich. Android lintVitalRelease und bundleRelease waren erfolgreich. Alle signierten Inhaltsdateien der AAB wurden vollständig gelesen und mit dem Upload-Zertifikat der bisherigen veröffentlichten AAB abgeglichen. Die gebündelten Assets enthalten die Kategorie- und Leseänderungen und keine Web-Installationsskripte. Die gebündelte Manifestdatei bestätigt Paket-ID, Versionsname und Versionscode.

Artefakt: `Lesespiele-Play-1.1.20.aab`, 54.063.944 Bytes.

SHA-256: `C2893D3841E3EF81432C7588ECD56DC351C6979C49F11C871C69EC39519B5B05`.

Upload-Zertifikat SHA-256: `EA14AD75C7EFFEA842B6E8BF9FFF61DF3863DC56AC2C1DF60A6889148F0EE70C`.

Ein physischer Gerätetest steht noch aus. Das Bundle wurde nicht zu Google Play hochgeladen oder veröffentlicht. Vor einer Produktionsfreigabe die AAB über einen internen Test auf einem Android-Gerät prüfen. Signierschlüssel und Passwörter sind nicht Teil des Repositorys.
