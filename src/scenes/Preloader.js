class Preloader extends Phaser.Scene {
	constructor() {
		super('Preloader');
	}


	init() {
		//  A simple progress bar. This is the outline of the bar.
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;
		this.add.rectangle(cx, cy, 468, 32).setStrokeStyle(1, 0xffffff);
		//  This is the progress bar itself. It will increase in size from the left based on the % of progress.
		const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
		//  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
		this.load.on('progress', (progress) => {
			//  Update the progress bar (our bar is 464px wide, so 100% = 464px)
			bar.width = 4 + (460 * progress);
		});
	}


	preload() {
		// BUG-desktop: load.setPath fails. Use variable instead.
		// Even a plain variable fails!
		// this.load.setPath('assets/images/');
		this.load.image('splash', 'assets/images/splash.jpg');
		this.load.image('room', 'assets/images/room.jpg');

		// BUG-desktop: Spaces in the key parameter (font name) cause problems. Use hyphens.
		this.load.font(
			'Barlow-Condensed-100',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-100-normal.woff2',
			'woff2',
		);
		this.load.font(
			'Barlow-Condensed-200',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-200-normal.woff2',
			'woff2',
		);
		this.load.font(
			'Barlow-Condensed-300',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-300-normal.woff2',
			'woff2',
		);
		this.load.font(
			'Barlow-Condensed-400',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-400-normal.woff2',
			'woff2',
		);
		this.load.font(
			'Barlow-Condensed-500',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-500-normal.woff2',
			'woff2',
		);
		this.load.font(
			'Barlow-Condensed-600',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-600-normal.woff2',
			'woff2',
		);
		this.load.font(
			'Barlow-Condensed-700',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-700-normal.woff2',
			'woff2',
		);
		this.load.font(
			'Barlow-Condensed-800',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-800-normal.woff2',
			'woff2',
		);
		this.load.font(
			'Barlow-Condensed-900',
			'https://cdn.jsdelivr.net/npm/@fontsource/barlow-condensed@5.3.0/files/barlow-condensed-latin-900-normal.woff2',
			'woff2',
		);
	}


	create() {
		//  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
		//  For example, you can define global animations here, so we can use them in other scenes.
		//  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
		this.scene.start('MainMenu');
	}
}
