// Font size tiers in px. Phaser accepts plain numbers for fontSize.
CJ.FONT_SIZE = {
	XXXS: 10,
	XXS:  12,
	XS:   14,
	S:    16,
	M:    20,
	L:    24,
	XL:   30,
	XXL:  40,
	XXXL: 56,
};

// Type ramp — semantic text styles, like CSS classes. Each is a
// complete Phaser text style; UI elements and scenes spread them
// and override per-instance attributes (fill, align, fontSize...).
CJ.TYPE_LEVELS = {
	H1:      { fontFamily: getFontFamilyName(800), fontSize: CJ.FONT_SIZE.XXXL },
	H2:      { fontFamily: getFontFamilyName(700), fontSize: CJ.FONT_SIZE.XXL },
	H3:      { fontFamily: getFontFamilyName(700), fontSize: CJ.FONT_SIZE.XL },
	H4:      { fontFamily: getFontFamilyName(600), fontSize: CJ.FONT_SIZE.L },
	H5:      { fontFamily: getFontFamilyName(500), fontSize: CJ.FONT_SIZE.M },
	H6:      { fontFamily: getFontFamilyName(500), fontSize: CJ.FONT_SIZE.S },
	P_BIG:   { fontFamily: getFontFamilyName(400), fontSize: CJ.FONT_SIZE.M },
	P:       { fontFamily: getFontFamilyName(400), fontSize: CJ.FONT_SIZE.S },
	P_SMALL: { fontFamily: getFontFamilyName(400), fontSize: CJ.FONT_SIZE.XS },
};

// Web fonts. key() builds the Phaser font key, url() the fontsource file.
CJ.FONT = {
	WEIGHTS: [100, 200, 300, 400, 500, 600, 700, 800, 900],
	key: getFontFamilyName,
	url: (w) => `https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-${w}-normal.woff2`,
};
