# Play-Store-/TWA-Vorbereitung

Stand: 20.09.2026

## Bereits vorhanden und geeignet

- PWA-Manifest: `manifest.webmanifest`
- Start-URL und Scope: `./`
- Standalone-Anzeige
- 192x192- und 512x512-PNG-Icon
- Service Worker: `sw.js`
- Offline-Caching der App-Hülle und der nachgeladenen Spiele
- HTTPS über GitHub Pages

## Geplante Android-Paket-ID

`de.heikeamthor.lesenentdeckenerzaehlen`

Diese ID sollte ab jetzt nicht mehr geändert werden, sobald das Android-Projekt bzw. der Play-Store-Eintrag damit erstellt wurde.

## Digital Asset Links

Für die Trusted Web Activity wird später benötigt:

`/.well-known/assetlinks.json`

Eine Vorlage liegt unter:

`/.well-known/assetlinks.template.json`

Der SHA-256-Fingerprint kann erst endgültig eingetragen werden, wenn der Android-Signaturschlüssel bzw. die Play-App-Signing-Zertifikatsinformation feststeht.

## Maskierbares Android-/PWA-Icon

Das vorhandene 512x512-Icon ist als normales Icon geeignet. Für Android sollte zusätzlich eine eigene maskierbare 512x512-Version erzeugt werden, bei der das Hauptmotiv vollständig innerhalb der sicheren Zone liegt.

Erst wenn diese Bilddatei vorliegt, wird sie im Manifest ergänzt, z. B.:

```json
{
  "src": "./icon-maskable-512.png",
  "sizes": "512x512",
  "type": "image/png",
  "purpose": "maskable"
}
```

Das vorhandene normale Icon wird dabei nicht ersetzt.

## Nächste technische Schritte

1. Maskierbares 512x512-Icon erzeugen und testen.
2. Bubblewrap installieren bzw. TWA-Projekt erzeugen.
3. Paket-ID `de.heikeamthor.lesenentdeckenerzaehlen` verwenden.
4. Android-Projekt mit aktuellem Play-Store-Target-SDK konfigurieren.
5. Signaturschlüssel / Play App Signing einrichten.
6. SHA-256-Fingerprint in `assetlinks.json` eintragen.
7. `assetlinks.json` unter `/.well-known/` veröffentlichen.
8. Android App Bundle (`.aab`) bauen.
9. Test auf einem Android-Gerät: Start, Vollbild, Zurück-Taste, Ton, Offline-Modus, Zoom und Navigation.
10. Danach Upload in die Google Play Console.
