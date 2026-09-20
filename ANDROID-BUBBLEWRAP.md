# Android / Bubblewrap

Dieses Repository enthält jetzt die Konfiguration für die Android-TWA-Version der Spielesammlung.

## Web-App

https://hamthor-web.github.io/Spielesammlung-fuer-Lesefreude-/

## Android-Paket-ID

de.heikeamthor.lesenentdeckenerzaehlen

## Bubblewrap-Konfiguration

twa-manifest.json

## Wichtig zum Signaturschlüssel

Die Datei android.keystore darf niemals in dieses öffentliche GitHub-Repository hochgeladen werden.
Sie ist deshalb in .gitignore ausgeschlossen.

Der Signaturschlüssel wird im nächsten Schritt lokal erzeugt. Danach wird sein SHA-256-Fingerprint
in /.well-known/assetlinks.json eingetragen.

## Vorgesehene Bubblewrap-Befehle

Installation:

npm install -g @bubblewrap/cli

Initiales Projekt aus der vorhandenen PWA:

bubblewrap init --manifest https://hamthor-web.github.io/Spielesammlung-fuer-Lesefreude-/manifest.webmanifest

Danach muss die erzeugte Konfiguration mit der hier festgelegten Paket-ID übereinstimmen:

de.heikeamthor.lesenentdeckenerzaehlen

Nach Änderungen an twa-manifest.json:

bubblewrap update --skipVersionUpgrade

Build:

bubblewrap build

Bubblewrap erzeugt dabei APK und Android App Bundle (AAB).
