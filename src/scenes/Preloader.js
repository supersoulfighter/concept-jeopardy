class Preloader extends Phaser.Scene {
	constructor() {
		super(CJ.SCENES.PRELOADER);
	}


	init() {
		const L = CJ.LAYOUT.PRELOADER;
		//  A simple progress bar. This is the outline of the bar.
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;
		this.add.rectangle(cx, cy, L.BAR_W, L.BAR_H).setStrokeStyle(L.BORDER, CJ.COLORS.BAR);
		//  This is the progress bar itself. It will increase in size from the left based on the % of progress.
		const bar = this.add.rectangle(cx - (L.BAR_W / 2) + L.BAR_PAD, cy, L.BAR_PAD, L.BAR_H - L.BAR_PAD, CJ.COLORS.BAR);
		//  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
		this.load.on('progress', (progress) => {
			//  Update the progress bar (the fill area is BAR_W - 2*BAR_PAD wide)
			bar.width = L.BAR_PAD + ((L.BAR_W - 2 * L.BAR_PAD) * progress);
		});
	}


	preload() {
		// BUG-desktop: load.setPath fails. Use full paths in CJ.ASSETS instead.
		Object.values(CJ.ASSETS).forEach((asset) => {
			this.load.image(asset.key, asset.src);
		});

		// BUG-desktop: Spaces in the key parameter (font name) cause problems. Use hyphens.
		CJ.FONT.WEIGHTS.forEach((w) => {
			this.load.font(CJ.FONT.key(w), CJ.FONT.url(w), 'woff2');
		});
	}


	create() {
		//  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
		//  For example, you can define global animations here, so we can use them in other scenes.
		//  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
		this.scene.start(CJ.SCENES.MENU);
	}
}
