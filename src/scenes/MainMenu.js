class MainMenu extends Phaser.Scene {

	// "CLICK TO START" prompt near the bottom of the splash image
	static START_TEXT = {
		BOTTOM: CJ.SPACING.XL, // distance up from the bottom edge
		STYLE: { ...CJ.TYPE_LEVELS.H2, fill: CJ.PALETTE.WHITE },
	};


	constructor() {
		super(CJ.SCENES.MENU);
	}


	create() {
		const cx = this.scale.width / 2;

		this.add.image(cx, 0, CJ.IMAGES.SPLASH.key).setOrigin(0.5, 0);

		this.add.text(
			cx,
			this.scale.height - MainMenu.START_TEXT.BOTTOM,
			'CLICK TO START',
			{...MainMenu.START_TEXT.STYLE}
		).setOrigin(0.5);

		this.input.once('pointerdown', () => {
			this.scene.start(CJ.SCENES.BOARD);
		});
	}
}