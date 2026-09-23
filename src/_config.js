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
	GAME_WIDTH: 1280,
	GAME_HEIGHT: 720,
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
		BOARD: {
			BG_SCALE: 1.5,
			COL_WIDTH: 200,
			ROW_HEIGHT: 80,
			START_X: 150,
			START_Y: 120,
			TILE_PAD: 10,
			HEADER_PAD: 20,
			SCORE_MARGIN: 40,
			SCORE_SIZE: '24px',
			CATEGORY_SIZE: '20px',
			POINTS_SIZE: '30px',
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
