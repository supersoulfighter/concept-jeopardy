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
// public/assets/icons/, but any image format works: the loader
// picks .svg vs plain image from the file extension. 'key' is the
// texture key, so `iconLeft: 'search'` works on UI components.
CJ.ICONS = [
	{ key: 'check',         src: 'assets/icons/check.svg' },
	{ key: 'chevron-left',  src: 'assets/icons/chevron-left.svg'},
	{ key: 'chevron-right', src: 'assets/icons/chevron-right.svg'},
	{ key: 'close',         src: 'assets/icons/close.svg' },
	{ key: 'heart',         src: 'assets/icons/heart.svg' },
	{ key: 'user',          src: 'assets/icons/user.svg' },
	{ key: 'search',        src: 'assets/icons/search.svg' },
	{ key: 'alert',         src: 'assets/icons/alert.svg' },
	{ key: 'coin',          src: 'assets/icons/coin.svg' },
	{ key: 'trophy',        src: 'assets/icons/trophy.svg' },
	{ key: 'star',          src: 'assets/icons/star.svg' },
	{ key: 'home',          src: 'assets/icons/home.svg' },
];
