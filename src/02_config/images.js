// Image manifest — Preloader loads every entry listed here.
CJ.IMAGES = {
	SPLASH: { key: 'splash', src: 'assets/images/splash.jpg' },
	ROOM:   { key: 'room',   src: 'assets/images/room.jpg' },
};

// Spritesheet manifest — even-grid sheets loaded frame by frame.
// host.gif rows (8 frames each): idle, announcing, crying,
// celebrating. host2.gif rows: walking, laughing, disagreeing,
// agreeing. Phaser flattens animated GIFs to their cells, which
// is all we need — we drive the frames ourselves via anims.
CJ.SHEETS = [
	{
		key: 'host',
		src: 'assets/images/host.gif',
		frameWidth: 176,
		frameHeight: 192,
	},
	{
		key: 'host2',
		src: 'assets/images/host2.gif',
		frameWidth: 176,
		frameHeight: 192,
	},
];

// Icon manifest — pixel-art SVGs (pixelarticons, MIT) in
// public/assets/images/icons/, but any image format works: the loader
// picks .svg vs plain image from the file extension. 'key' is the
// texture key, so `iconLeft: 'search'` works on UI components.
CJ.ICONS = [
	{ key: 'check',         src: 'assets/images/icons/check.svg' },
	{ key: 'chevron-left',  src: 'assets/images/icons/chevron-left.svg'},
	{ key: 'chevron-right', src: 'assets/images/icons/chevron-right.svg'},
	{ key: 'close',         src: 'assets/images/icons/close.svg' },
	{ key: 'heart',         src: 'assets/images/icons/heart.svg' },
	{ key: 'user',          src: 'assets/images/icons/user.svg' },
	{ key: 'search',        src: 'assets/images/icons/search.svg' },
	// Phaser Desktop gave this error message for the following 2 files:
	// WebGL: INVALID_VALUE: texImage2D: bad image data
	// { key: 'alert',         src: 'assets/images/icons/alert.svg' },
	// { key: 'coin',          src: 'assets/images/icons/coin.svg' },
	{ key: 'trophy',        src: 'assets/images/icons/trophy.svg' },
	{ key: 'star',          src: 'assets/images/icons/star.svg' },
	{ key: 'home',          src: 'assets/images/icons/home.svg' },
];
