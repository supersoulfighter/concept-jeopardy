// Color palette — named by appearance, never by use.
// LOCAL - Stored as CSS strings so IDE color pickers work on them.
CJ.PALETTE = {
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
};

// Semantic colors shared by the whole game. Colors used by just one
// scene live as static fields on that scene's class instead.
CJ.COLORS = {
	BG: CJ.PALETTE.BLACK, // canvas background, used by z_main.js
};
