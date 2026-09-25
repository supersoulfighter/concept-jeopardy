class MainMenu extends Phaser.Scene {

	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor() {
		super(CJ.SCENES.MENU);
	}

	//#endregion



	//#region Events ///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	create() {
		const cx = this.scale.width / 2;

		// Background //
		this.add.image(
			cx,
			0,
			CJ.IMAGES.SPLASH.key
		).setOrigin(0.5, 0);


		// "CLICK TO START" prompt near the bottom of the splash
		this.add.uiLabel({
			x: cx,
			y: this.scale.height - CJ.SPACING.XL,
			text: 'CLICK TO START',
			style: { ...CJ.TYPE_LEVELS.H2, textColor: CJ.PALETTE.WHITE },
		});


		// Click anywhere to proceed. pointerup (not pointerdown) so the
		// release can't land on a board tile in the freshly-started scene.
		this.input.once('pointerup', () => {
			this.sound.play(CJ.SFX.SELECT.key);
			this.scene.start(CJ.SCENES.BOARD);
		});
	}

	//#endregion
}