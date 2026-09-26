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

// Web font manifest — one entry per family, served from the
// Fontsource CDN (https://fontsource.org, files via jsDelivr).
// Phaser Desktop can't upload local font files, so we load them
// over the network with the browser's FontFace API.
// File names follow fontsource's scheme:
//   fonts/<dir>@latest/<subset>-<weight>-<style>.<format>
// Each 'files' group shares a subset (character set), style, and
// format; add another group to the same family for italics, a
// different subset, or a different format. Swapping fonts means
// a new 'dir' slug plus one entry here — no loader changes needed.
//
// Every file in a family loads under the SAME key (the family
// name) with FontFace weight/style descriptors, so text styles
// pick a face with fontStyle ('700', 'italic') not fontFamily.
CJ.FONTS = [
	{
		family: 'Barlow Condensed',
		dir: 'barlow-condensed',
		files: [
			{
				subset: 'latin',
				style: 'normal',
				format: 'woff2',
				weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
			},
		],
	},
];

// Shorthand for the primary family — used all over the type ramp.
CJ.FONT_FAMILY = CJ.FONTS[0].family;

// Builds the CDN URL for one font file on jsDelivr's fontsource
// mirror. Only the Preloader needs this; text styles use
// family + fontStyle.
CJ.fontFile = (font, file, weight) =>
	'https://cdn.jsdelivr.net/fontsource/fonts/' +
	`${font.dir}@latest/` +
	`${file.subset}-${weight}-${file.style}.${file.format}`;

// Type ramp — semantic text styles, like CSS classes. Each is a
// complete Phaser text style; UI elements and scenes spread them
// and override per-instance attributes (fill, align, fontSize...).
// fontStyle holds the numeric weight ('800'): Phaser builds the
// canvas font string as "<fontStyle> <fontSize> <fontFamily>", and
// the browser matches the weight against the loaded FontFaces.
CJ.TYPE_LEVELS = {
	H1: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '800',
		fontSize: CJ.FONT_SIZE.XXXL,
	},
	H2: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '700',
		fontSize: CJ.FONT_SIZE.XXL,
	},
	H3: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '700',
		fontSize: CJ.FONT_SIZE.XL,
	},
	H4: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '600',
		fontSize: CJ.FONT_SIZE.L,
	},
	H5: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '500',
		fontSize: CJ.FONT_SIZE.M,
	},
	H6: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '500',
		fontSize: CJ.FONT_SIZE.S,
	},
	P_BIG: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '400',
		fontSize: CJ.FONT_SIZE.M,
	},
	P: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '400',
		fontSize: CJ.FONT_SIZE.S,
	},
	P_SMALL: {
		fontFamily: CJ.FONT_FAMILY,
		fontStyle: '400',
		fontSize: CJ.FONT_SIZE.XS,
	},
};
