class MainMenu extends Phaser.Scene {
	constructor() {
		super('MainMenu');
	}

	create() {
		const cx = this.scale.width / 2;
		const cy = this.scale.height / 2;

		this.add.image(cx,0,"splash").setOrigin(.5,0)


		this.add.text(cx, this.scale.height - 124, 'CLICK TO START', {
			fontFamily: 'Barlow-Condensed-400',
			fontSize: 48,
			color: '#ffffffff',
		}).setOrigin(0.5);

		this.input.once('pointerdown', () => {
			this.scene.start('GameBoard');
		});
	}
}
