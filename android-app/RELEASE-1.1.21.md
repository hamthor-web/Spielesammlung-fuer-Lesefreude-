# Android 1.1.21 – Update der Würfelspiele

- Paket-ID: de.heikeamthor.lesespiele
- Versionsname: 1.1.21
- Versionscode: 23
- Grundlage der Würfeländerungen: Web-Commit 33a4e6211266b5d7d9bf24d0814bc237382eef0e
- Datum: 29. Oktober 2026

## Änderungen

Die drei Würfelspiele enthalten große Fertig-Buttons unter den selbst ausgeführten Bewegungs- und Erzählaufgaben. Ein Tipp auf den Kartentext beendet keine Aufgabe mehr. Die Hinweise erklären weiter, was das Kind selbst tun soll. Bei einer Joker-Bewegungsauswahl erscheint Fertig erst nach der Auswahl; Wochentags- und Bildsuchaufgaben behalten ihre Zielauswahl. Mehrfaches Tippen beendet einen Zug nicht doppelt.

Die Würfel bleiben flach, mit den bisherigen Augenmustern. Sie sind nun 108 × 108 Pixel groß, mit größeren Augen und einer 124 × 124 Pixel großen Tippfläche. Die abgelehnte 3D-Variante und die Steuerelemente der separaten Testdatei sind nicht enthalten.

Die Lesefunktionen und die aufgeräumten Auswahlseiten aus 1.1.20 bleiben erhalten. Web-Installationsbutton und iPhone-Installationshinweise sind im nativen Paket nicht enthalten. Paket-ID, Profile und Fortschrittsschlüssel bleiben erhalten.

## Prüfung

- npm run android:sync erfolgreich: Webpaket gebaut und mit Capacitor synchronisiert.
- Alle 31 vorhandenen Regressionstests erfolgreich.
- npm run check erfolgreich: dokumentierte Quell-Hashes, lokale Verweise, keine Web-Installation und keine externen Laufzeitadressen.
- Abschlussverhalten aller drei Würfelspiele geprüft: Texttipp, Fertig, Doppeltipp-Schutz, fünf Joker-Typen und Bewegungsauswahl.
- Textzoom, große Leseansicht, Zurücksetzen und Zwei-Finger-Zoom auf allen sieben nativen Spielen erfolgreich geprüft; auch gesperrter lokaler Speicher ist abgedeckt.
- Android-Release-Kompilierung und lintVitalRelease erfolgreich. Die generierte BuildConfig bestätigt Paket-ID, Version 1.1.21 und Versionscode 23.

## Signiertes Bundle

Das Bundle wurde am 29. Oktober 2026 erfolgreich mit bundleRelease gebaut. Die Signierhilfe hat alle Inhaltsdateien der AAB gelesen und ihre Signatur mit dem Upload-Zertifikat der bisherigen AAB abgeglichen. Paket-ID, Version 1.1.21, Versionscode 23, die Fertig-Buttons in allen drei Würfelspielen, der flache 108-Pixel-Würfel und das Fehlen von Teststeuerung und Web-Installationsskripten wurden im fertigen Bundle geprüft.

- Datei: Lesespiele-Play-1.1.21.aab
- Größe: 54.065.023 Bytes
- SHA-256: FC84F9C0BF203170B52E7F122DC84C3C494B18B6F076131D19070F777FCA1A32
- Upload-Zertifikat SHA-256: EA14AD75C7EFFEA842B6E8BF9FFF61DF3863DC56AC2C1DF60A6889148F0EE70C

Die AAB liegt im lokalen Arbeitsordner und ist nicht Teil dieses Repositorys. Signierschlüssel und Passwörter werden nicht veröffentlicht. Ein physischer Gerätetest ist nicht dokumentiert. Der aktuelle Upload- und Veröffentlichungsstatus in Google Play ist nicht bestätigt.

## Stand der Quellsicherung

Der vollständige Android-Quellstand 1.1.21 wurde am 30. Oktober 2026 mit dem aktuellen Repository abgeglichen und gesichert. Die sieben geänderten Quelldateien stimmen mit dem lokal gebauten Stand überein. Neuere Repository-Änderungen und die bestehenden Release-Dokumente bleiben erhalten. Der Startbildschirm wurde bei dieser Sicherung nicht verändert.

Build-Ausgaben, installierte Abhängigkeiten, lokale SDK-Pfade und Signierschlüssel sind ausgeschlossen. Diese Dateien gehören nicht zum übertragbaren Quellprojekt. Die vorhandenen Build-Skripte erzeugen das Offline-Spielepaket erneut; zum Signieren ist weiterhin der private Upload-Schlüssel nötig.
