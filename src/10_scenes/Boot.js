//  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
//  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
class Boot extends Phaser.Scene {

	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor() {
		super(CJ.SCENES.BOOT);
	}

	//#endregion



	//#region Events ///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	preload() {
		// Any tiny asset the loading screen itself needs (background,
		// logo, fonts) belongs here. Larger assets load in Preloader.
	}


	create() {
		// this.sound.pauseOnBlur = false;
		this.scene.start(CJ.SCENES.PRELOADER);
	}

	//#endregion
}
