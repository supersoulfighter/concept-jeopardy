// Image manifest — Preloader loads every entry listed here.
CJ.IMAGES = {
	SPLASH: { key: 'splash', src: 'assets/images/splash.jpg' },
	ROOM:   { key: 'room',   src: 'assets/images/room.jpg' },
};

// Icon manifest — pixel-art SVGs (pixelarticons, MIT) in
// public/assets/icons/, but any image format works: the loader
// picks .svg vs plain image from the file extension. 'key' is the
// texture key, so `iconLeft: 'search'` works on UI components.
CJ.ICONS = [
	{ key: 'check',         src: 'assets/icons/check.svg' },
	{ key: 'chevron-left',  src: 'assets/icons/chevron-left.svg' },
	{ key: 'chevron-right', src: 'assets/icons/chevron-right.svg' },
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
