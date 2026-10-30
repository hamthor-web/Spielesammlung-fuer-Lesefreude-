# Android 1.1.23 · korrigierte Märchenfrage

- Version: **1.1.23**, Versionscode **25**.
- Kaufpaket: `de.heikeamthor.lesespiele`.
- Grundlage: Quellcommit 566b85af4a99a5a4cea59fc4c1cbd5dd71648ec8.
- Datum: 30.10.2026.

## Bestätigte Änderung

„Würdest du lieber auf einem Pferd reiten oder in einer Kutsche fahren?“

Der neue Satz wurde in der veröffentlichten Webversion direkt abgerufen und bestätigt. Der Android-Webinhalt wurde aus den korrigierten Quellen erneut erzeugt; die Projektprüfung ist erfolgreich.

## Erzeugung und Prüfung

Da ausschließlich Webinhalt geändert wurde, wurde die bestehende kompilierte Android-Hülle aus 1.1.22 wiederverwendet. Das neu erzeugte Märchenspiel wurde im Bundle ersetzt und die Manifestversion auf 1.1.23 / 25 angehoben. **Keine erneute Gradle-Kompilierung der nativen Klassen.** Der Paketvergleich bestätigt, dass genau die HTML-Datei und das Manifest verändert sind. Der übrige Bundle-Inhalt einschließlich DEX, Hintergrund und übriger Spiele ist bytegleich erhalten.

Bundletool 1.18.3 validiert das fertige Bundle. Der Manifest-Dump bestätigt Paket, Versionsname und Versionscode. Die Signierhilfe wurde an den neuen Bundle-Hash und Dateinamen angepasst und mit einem getrennten Prüfschlüssel am vollständigen Bundle getestet; nach der Signierung wurden alle Inhaltsdateien zur kryptografischen Prüfung gelesen. Der vorhandene private Upload-Schlüssel wurde dafür nicht verwendet.

## Artefakt und offene Schritte

- Datei: `Lesespiele-Play-1.1.23-unsigned.aab`
- Größe: 53983267 Bytes.
- SHA-256: `A1D4D1C4990ED677B1769296A5A41D17224B1454D2E57789A8A73617D4B5B775`
- Signierstatus: **unsigned; lokale Signierung mit bisherigem Upload-Schlüssel offen**.

Das neue ZIP enthält das Bundle, Signierhilfe und Anleitung. Die Signierhilfe prüft den bisherigen Upload-Zertifikatsfingerabdruck und erzeugt lokal `Lesespiele-Play-1.1.23.aab`. Es wurde keine neue Test-APK erstellt. Die bisherigen 1.1.22-Downloads bleiben als frühere Fassungen erhalten. Ein physischer Gerätetest dieser neuen Fassung und ein Play-Upload sind nicht erfolgt.

Projektstatus: Hintergrund-Testfassung von Heike bestätigt; Kartenkorrektur in Web und neuem Android-Bundle enthalten; lokale Upload-Signierung und Store-Veröffentlichung ausstehend.
