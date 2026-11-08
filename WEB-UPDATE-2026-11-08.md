# Bedienung und Wiederaufnahme · 8. November 2026

Die Spielregeln und Belohnungsmechanik bleiben erhalten.

- Einheitliche Rückwege: „Spielauswahl“ führt zur Kategorie, „Startmenü“ zur Übersicht.
- „Für Erwachsene“ bleibt auf dem Startbildschirm erreichbar. Zurücksetzen ohne gewähltes Profil ist gesperrt. Zurückgesetzte Fortschritte werden sofort in der Auswahl aktualisiert.
- Die Spielauswahl zeigt pro Kinderprofil „Runde fortsetzen“, „Weiterlesen“ oder die Zahl fertiger Aufgaben.
- Geschichten öffnen die zuletzt angezeigte Lesekarte wieder. Der höchste erreichte Stand bleibt beim Zurückblättern erhalten. Erneutes Finden einer begonnenen Geschichte überspringt keine Karte. Ein schneller Wechsel des Suchbildes kann keine veraltete Lesekarte mehr öffnen.
- Jedes Spiel bietet kurze Regeln unter „So geht’s“. Die Android-Zurücktaste schließt zuerst offene Dialoge im Spiel, einschließlich dieser Regeln.
- Direkte Spieladressen mit `#spiel-…` öffnen das Spiel auch nach einem Neuladen.
- Der Offlinehinweis wird vom tatsächlichen Cachezustand bestimmt. Fehler beim Laden des Offlinepakets werden angezeigt. Cacheversion und Webversion wurden erhöht.

Geprüft: Android-Webpaket bauen, Projektprüfung und alle Node-Tests einschließlich Regressionstests zur Lesewiederaufnahme und Android-Zurücktaste. Mobile Chromium-Prüfung mit 390 × 844 Pixeln: Navigation, Regeln, Wiederaufnahme der drei Würfelwelten (auch mit offener Karte), genaue Lesewiederaufnahme und Trennung zweier Profile. Mit 360 × 740 Pixeln: vollständiges Offlinepaket laden, Netzwerk abschalten, neu laden und alle sieben Spiele öffnen; keine JavaScript-Fehler oder horizontales Überlaufen der Spielseiten.

Handytest: Zuerst online öffnen. Unter „Für Erwachsene“ auf „Alle Spiele sind auf diesem Gerät offline bereit“ warten. Eine Würfelrunde beginnen und verlassen, eine Geschichte bis Karte 3 lesen und verlassen, beide erneut öffnen. Zweites Profil auswählen und getrennte Fortschritte prüfen. Danach im Flugmodus neu öffnen und die Spiele starten. Die installierte Android-App benötigt für diese Änderungen einen neuen Build; die Webversion erhält sie über den Service Worker.
