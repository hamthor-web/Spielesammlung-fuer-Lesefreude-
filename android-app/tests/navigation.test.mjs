import test from 'node:test';
import assert from 'node:assert/strict';
import { backTarget } from '../src/navigation.mjs';

test('Zurueck fuehrt aus allen sieben Spielen zur zugehoerigen Auswahl', () => {
  for (const id of ['freizeit', 'sport', 'maerchen']) assert.equal(backTarget('#spiel-' + id), 'dice');
  for (const id of ['herbstgeschichten', 'fussballgeschichten']) assert.equal(backTarget('#spiel-' + id), 'stories');
  for (const id of ['finde-fehler', 'verruecktes-fussball']) assert.equal(backTarget('#spiel-' + id), 'crazy');
});

test('Zurueck fuehrt aus jeder Kategorie ins Startmenue', () => {
  for (const hash of ['#dice', '#stories', '#crazy', '']) assert.equal(backTarget(hash), 'home');
});
