// Global configuration
// LOCAL - The triple-underscore prefix makes this
// file run first among all src files (see vite/config.dev.mjs).
// CJ is the one global config object; every other file in config/
// adds properties to it. Global helper functions live here too.
const CJ = {};


// Text styles take the PALETTE CSS strings as-is; shapes want
// numeric hex, so convert '#rrggbb' to a number.
const hexToInt = (str) => parseInt(str.slice(1), 16);

// Phaser font key for a Barlow Condensed weight, e.g. (700) ->
// 'Barlow-Condensed-700'. Hyphens only — spaces break keys.
const getFontFamilyName = (w) => `Barlow-Condensed-${w}`;

// Return up to n randomly chosen items from array (Fisher-Yates shuffle).
const pickRandom = (arr, n) => {
	const pool = [...arr];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, n);
};

// Reduce a Jeopardy "question" (or the player's typed response) to the
// part that matters: drops the "What/Who/When is/are" prefix, accent
// marks, punctuation, articles, whitespace, and case — so "Pokémon"
// matches "pokemon" and "What is Mario?" matches "mario".
const normalizeResponse = (str) => str
	.toLowerCase()
	.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accent marks (U+0300–U+036F)
	.replace(/^(what|who|when)\s+(is|are)\s+/, '')
	.replace(/[^a-z0-9\s]/g, '')
	.split(/\s+/)
	.filter((w) => w && !['a', 'an', 'the'].includes(w))
	.join('');
