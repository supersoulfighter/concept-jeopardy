// Global configuration
// CJ is the one global config object; every other file in config/
// adds properties to it. Global helper functions live here too.
const CJ = {};


// Text styles take the PALETTE CSS strings as-is; shapes want
// numeric hex, so convert '#rrggbb' to a number.
const hexToInt = (str) => parseInt(str.slice(1), 16);

// Return up to n randomly chosen items from array (Fisher-Yates shuffle).
const pickRandom = (arr, n) => {
	const pool = [...arr];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, n);
};