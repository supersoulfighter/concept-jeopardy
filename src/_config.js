// 0. Global configuration — the underscore prefix makes this file
// concatenate first (see vite/config.dev.mjs). All design values live
// here so layout can be tuned without touching scene code.
const deepFreeze = (obj) => {
	Object.values(obj).forEach((v) => {
		if (v && typeof v === 'object') deepFreeze(v);
	});
	return Object.freeze(obj);
};

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
		key: (w) => `Barlow-Condensed-${w}`,
		url: (w) => `https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-${w}-normal.woff2`,
	},

	// Shape/rectangle fills (numeric hex)
	COLORS: {
		BG:           '#000000',
		TILE:         0x1155ff,
		TILE_HOVER:   0x0000ff,
		TILE_VISITED: 0x333333,
		CLUE_BG:      0x0000af,
		BTN_REVEAL:   0xffcc00,
		BTN_CORRECT:  0x00aa00,
		BTN_WRONG:    0xaa0000,
		BAR:          0xffffff,
	},

	// Text fills (CSS strings)
	TEXT: {
		SCORE:     '#00ff00',
		CATEGORY:  '#ffff00',
		POINTS:    '#fffb00',
		CLUE:      '#ffffff',
		ANSWER:    '#00ff00',
		BTN_DARK:  '#000000',
		BTN_LIGHT: '#ffffff',
		MENU:      '#ffffff',
	},

	// Per-scene layout. Scenes derive positions from these base values
	// and the canvas center, so nothing here is an absolute coordinate.
	LAYOUT: {
		// Board is parameterized: the grid is COL_NUM x ROW_NUM and every
		// dimension is derived from the screen size at scene start. Any of
		// these can be overridden per launch via scene data (data.layout).
		BOARD: {
			BG_SCALE: 1.5,
			COL_NUM: 5,          // categories per board
			ROW_NUM: 5,          // clue tiles per category
			MARGIN_X: 60,        // left/right margin around the grid
			MARGIN_TOP: 100,     // room for the score line
			MARGIN_BOTTOM: 40,
			TILE_PAD: 5,
			HEADER_PAD: 20,
			SCORE_MARGIN: 40,
			SCORE_SIZE: '24px',
			MAX_CLUE_VALUE: 1000, // dollar value of a max-weight clue
			WEIGHT_MAX: 5,        // highest weight used in GAME_DATA
		},
		CLUE: {
			PANEL_W: 800,
			PANEL_H: 600,
			TEXT_WRAP: 600,
			PROMPT_DY: -100,
			ANSWER_DY: 20,
			REVEAL_DY: 100,
			REVEAL_W: 250,
			BTN_ROW_DY: 150,
			BTN_W: 160,
			BTN_H: 50,
			BTN_DX: 120,
			PROMPT_SIZE: '28px',
			ANSWER_SIZE: '26px',
			BTN_SIZE: '20px',
		},
		PRELOADER: {
			BAR_W: 468,
			BAR_H: 32,
			BAR_PAD: 4,
			BORDER: 1,
		},
		MENU: {
			START_BOTTOM: 124,
			START_SIZE: '48px',
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
