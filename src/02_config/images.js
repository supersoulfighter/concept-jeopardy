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

// Icon manifest — pixel-art SVGs from the pixelarticons npm package
// (MIT), served over jsDelivr: Phaser Desktop chokes on the local
// svg files, so we fetch them from the CDN instead. The loader
// still picks .svg vs plain image from the file extension; 'key' is
// the texture key, so `iconLeft: 'search'` works on UI components.
// NOTE: 'alert' and 'coin' were renamed upstream — the package only
// ships square-alert.svg and coins.svg, which is why the old local
// copies failed to decode.
CJ.ICON_CDN =
	'https://cdn.jsdelivr.net/npm/pixelarticons@2.4.1/svg/';
CJ.ICONS = [
	{ key: 'check',         src: CJ.ICON_CDN + 'check.svg' },
	{ key: 'chevron-left',  src: CJ.ICON_CDN + 'chevron-left.svg' },
	{ key: 'chevron-right', src: CJ.ICON_CDN + 'chevron-right.svg' },
	{ key: 'close',         src: CJ.ICON_CDN + 'close.svg' },
	{ key: 'heart',         src: CJ.ICON_CDN + 'heart.svg' },
	{ key: 'user',          src: CJ.ICON_CDN + 'user.svg' },
	{ key: 'search',        src: CJ.ICON_CDN + 'search.svg' },
	{ key: 'alert',         src: CJ.ICON_CDN + 'square-alert.svg' },
	{ key: 'coin',          src: CJ.ICON_CDN + 'coins.svg' },
	{ key: 'trophy',        src: CJ.ICON_CDN + 'trophy.svg' },
	{ key: 'star',          src: CJ.ICON_CDN + 'star.svg' },
	{ key: 'home',          src: CJ.ICON_CDN + 'home.svg' },
];
