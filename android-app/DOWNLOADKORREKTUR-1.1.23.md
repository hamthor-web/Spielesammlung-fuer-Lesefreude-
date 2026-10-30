# Downloadkorrektur 1.1.23 · 30.10.2026

Heike meldete beim Entpacken unter Windows „Der ZIP-komprimierte Ordner ist leer“. Die nachträgliche Prüfung bestätigte eine unvollständige ZIP-Datei ohne lesbares Abschlussverzeichnis. Die AAB und JAR in den Ausgangsdateien waren intakt.

Die AAB und die Signierhilfe wurden erneut auf CRC und SHA-256 geprüft und zusätzlich einzeln bereitgestellt, zusammen mit einem eigenständigen Windows-Starter. Dieser Starter benötigt nur UpdateSignieren.jar im gleichen Ordner und sucht die bisherige Java-Installation. Die AAB kann anschließend im Dialog ausgewählt werden. Ein Entpacken ist für diesen Weg nicht erforderlich.

Das ZIP wurde außerdem atomar als unkomprimiertes, Windows-kompatibles ZIP mit sechs geprüften Einträgen neu erstellt und unter derselben Datei-Identität ersetzt. Die App-Inhalte und die Bundle-Prüfsumme aus RELEASE-1.1.23.json bleiben unverändert. Die lokale Upload-Signatur steht weiterhin aus.
