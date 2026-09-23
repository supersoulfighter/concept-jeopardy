class MainMenu extends Phaser.Scene {
	constructor() {
		super(CJ.SCENES.MENU);
	}

	create() {
		const L = CJ.LAYOUT.MENU;
		const cx = this.scale.width / 2;

		this.add.image(cx, 0, CJ.ASSETS.SPLASH.key).setOrigin(0.5, 0);

		this.add.text(cx, this.scale.height - L.START_BOTTOM, 'CLICK TO START', {
			fontFamily: CJ.FONT.key(400),
			fontSize: L.START_SIZE,
			color: CJ.TEXT.MENU,
		}).setOrigin(0.5);

		this.input.once('pointerdown', () => {
			this.scene.start(CJ.SCENES.BOARD);
		});
	}
}
