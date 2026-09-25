class Preloader extends Phaser.Scene {

	// Loading progress bar: an outline plus a fill that grows with progress
	static PROGRESS_BAR = {
		W: 468,
		H: 32,
		PAD: CJ.SPACING.XXXS,
		BORDER: 1, // stroke width, not spacing
		COLOR: hexToInt(CJ.PALETTE.WHITE),
	};


	constructor() {
		super(CJ.SCENES.PRELOADER);
	}


	init() {
		const B = Preloader.PROGRESS_BAR;
		//  A simple progress bar. This is the outline of the bar.
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;
		this.add.rectangle(cx, cy, B.W, B.H).setStrokeStyle(B.BORDER, B.COLOR);
		//  This is the progress bar itself. It will increase in size from the left based on the % of progress.
		const bar = this.add.rectangle(cx - (B.W / 2) + B.PAD, cy, B.PAD, B.H - B.PAD, B.COLOR);
		//  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
		this.load.on('progress', (progress) => {
			//  Update the progress bar (the fill area is W - 2*PAD wide)
			bar.width = B.PAD + ((B.W - 2 * B.PAD) * progress);
		});
	}


	preload() {
		// BUG-desktop: load.setPath fails. Use full paths in CJ.IMAGES instead.
		Object.values(CJ.IMAGES).forEach((asset) => {
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
