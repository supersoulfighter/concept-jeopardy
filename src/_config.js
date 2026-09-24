// 0. Global configuration — the underscore prefix makes this file
// concatenate first (see vite/config.dev.mjs). All design values live
// here so layout can be tuned without touching scene code.
const deepFreeze = (obj) => {
	Object.values(obj).forEach((v) => {
		if (v && typeof v === 'object') deepFreeze(v);
	});
	return Object.freeze(obj);
};

// Design tokens — global so scenes can use them directly.

// Color palette — named by appearance, never by use. Stored as CSS
// strings so IDE color pickers work on them.
const PALETTE = deepFreeze({
	BLACK:       '#000000',
	WHITE:       '#ffffff',
	GRAY_DARK:   '#333333',
	BLUE:        '#1155ff',
	BLUE_PURE:   '#0000ff',
	BLUE_NAVY:   '#0000af',
	AMBER:       '#ffcc00',
	GREEN:       '#00aa00',
	RED:         '#aa0000',
	LIME:        '#00ff00',
	YELLOW:      '#ffff00',
	YELLOW_SOFT: '#fffb00',
});

// Text styles take the CSS strings as-is; shapes want numeric hex.
const hexToInt = (str) => parseInt(str.slice(1), 16);

// Font size tiers in px. Phaser accepts plain numbers for fontSize.
const FONT_SIZE = deepFreeze({
	XXXS: 10,
	XXS:  12,
	XS:   14,
	S:    16,
	M:    20,
	L:    24,
	XL:   30,
	XXL:  40,
	XXXL: 56,
});

// Spacing tiers in px — margins, pads, and offsets pick from this ramp
// instead of using one-off numbers.
const SPACING = deepFreeze({
	XXXS: 4,
	XXS:  8,
	XS:   20,
	S:    40,
	M:    60,
	L:    100,
	XL:   120,
	XXL:  150,
	XXXL: 200,
});

const getFontFamilyName = (w) => `Barlow-Condensed-${w}`;

// Type ramp — semantic text styles, like CSS classes. Each is a
// complete Phaser text style; UI elements and scenes spread them
// and override per-instance attributes (fill, align, fontSize...).
const TYPE = deepFreeze({
	H1:      { fontFamily: getFontFamilyName(800), fontSize: FONT_SIZE.XXXL },
	H2:      { fontFamily: getFontFamilyName(700), fontSize: FONT_SIZE.XXL },
	H3:      { fontFamily: getFontFamilyName(700), fontSize: FONT_SIZE.XL },
	H4:      { fontFamily: getFontFamilyName(600), fontSize: FONT_SIZE.L },
	H5:      { fontFamily: getFontFamilyName(500), fontSize: FONT_SIZE.M },
	H6:      { fontFamily: getFontFamilyName(500), fontSize: FONT_SIZE.S },
	P_BIG:   { fontFamily: getFontFamilyName(400), fontSize: FONT_SIZE.M },
	P:       { fontFamily: getFontFamilyName(400), fontSize: FONT_SIZE.S },
	P_SMALL: { fontFamily: getFontFamilyName(400), fontSize: FONT_SIZE.XS },
});

const CJ = deepFreeze({
	// Game canvas
	GAME_WIDTH: 1352,
	GAME_HEIGHT: 878,
	GAME_HTML_ELEMENT: 'game-container',

	// Scene keys
	SCENES: {
		BOOT: 'Boot',
		PRELOADER: 'Preloader',
		MENU: 'MainMenu',
		BOARD: 'GameBoard',
		CLUE: 'Clue',
	},

	// Image manifest
	ASSETS: {
		SPLASH: { key: 'splash', src: 'assets/images/splash.jpg' },
		ROOM:   { key: 'room',   src: 'assets/images/room.jpg' },
	},

	// Web fonts. key() builds the Phaser font key, url() the fontsource file.
	FONT: {
		WEIGHTS: [100, 200, 300, 400, 500, 600, 700, 800, 900],
		key: getFontFamilyName,
		url: (w) => `https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-${w}-normal.woff2`,
	},

	// Design tokens (also reachable as CJ.PALETTE etc.)
	PALETTE,
	SIZE: FONT_SIZE,
	SPACING,
	TYPE,
	hexToInt,

	// Shape/rectangle fills (numeric hex) — semantic names over the palette
	COLORS: {
		BG:           PALETTE.BLACK,
		TILE:         hexToInt(PALETTE.BLUE),
		TILE_HOVER:   hexToInt(PALETTE.BLUE_PURE),
		TILE_VISITED: hexToInt(PALETTE.GRAY_DARK),
		CLUE_BG:      hexToInt(PALETTE.BLUE_NAVY),
		BTN_REVEAL:   hexToInt(PALETTE.AMBER),
		BTN_CORRECT:  hexToInt(PALETTE.GREEN),
		BTN_WRONG:    hexToInt(PALETTE.RED),
		BAR:          hexToInt(PALETTE.WHITE),
	},

	// Named UI element styles — Phaser text-style objects built on the
	// TYPE ramp. Scenes spread these and override per-instance attrs
	// (e.g. a dynamic fontSize or wordWrap width).
	UI: {
		SCORE:         { ...TYPE.H5, fontFamily: getFontFamilyName(700), fill: PALETTE.LIME },
		BOARD_HEADING: { ...TYPE.P_BIG, fill: PALETTE.YELLOW, align: 'center' },
		BOARD_CELL:    { ...TYPE.H3, fill: PALETTE.YELLOW_SOFT, align: 'center' },
		CLUE_PROMPT:   { ...TYPE.H3, fill: PALETTE.WHITE, align: 'center' },
		CLUE_ANSWER:   { ...TYPE.H4, fill: PALETTE.LIME, fontStyle: 'bold', align: 'center' },
		BUTTON:        { ...TYPE.P_BIG, fill: PALETTE.WHITE },
		BUTTON_DARK:   { ...TYPE.P_BIG, fill: PALETTE.BLACK },
		MENU_TITLE:    { ...TYPE.H2, fill: PALETTE.WHITE },
	},

	// Per-scene layout. Spacing values come from the SPACING tiers (px);
	// sizes are plain px. Scenes derive positions from these and the
	// canvas center, so nothing here is an absolute coordinate.
	LAYOUT: {
		// Board is parameterized: the grid is COL_NUM x ROW_NUM and every
		// dimension is derived from the screen size at scene start. Any of
		// these can be overridden per launch via scene data (data.layout).
		BOARD: {
			BG_SCALE: 1.5,
			COL_NUM: 5,          // categories per board
			ROW_NUM: 5,          // clue tiles per category
			MARGIN_X: SPACING.M,      // left/right margin around the grid
			MARGIN_TOP: SPACING.L,    // room for the score line
			MARGIN_BOTTOM: SPACING.S,
			TILE_PAD: SPACING.XXXS,
			HEADER_PAD: SPACING.XS,
			SCORE_MARGIN: SPACING.S,
			MAX_CLUE_VALUE: 1000, // dollar value of a max-weight clue
			WEIGHT_MAX: 5,        // highest weight used in GAME_DATA
		},
		CLUE: {
			PANEL_W: 800,
			PANEL_H: 600,
			TEXT_WRAP: 600,
			PROMPT_DY: -SPACING.L,
			ANSWER_DY: SPACING.XS,
			REVEAL_DY: SPACING.L,
			REVEAL_W: 250,
			BTN_ROW_DY: SPACING.XXL,
			BTN_W: 160,
			BTN_H: 50,
			BTN_DX: SPACING.XL,
		},
		PRELOADER: {
			BAR_W: 468,
			BAR_H: 32,
			BAR_PAD: SPACING.XXXS,
			BORDER: 1,              // stroke width, not spacing
		},
		MENU: {
			START_BOTTOM: SPACING.XL,
		},
	},
});

// Return up to n randomly chosen items from arr (Fisher-Yates shuffle).
const pickRandom = (arr, n) => {
	const pool = [...arr];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, n);
};
