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

		// Web fonts via the browser's FontFace API. We can't use
		// load.font here: Phaser's loader refuses files whose key is
		// already queued, and every weight MUST share the same key
		// because the key becomes the CSS font-family. So each file
		// gets its own FontFace with a 'weight' descriptor — then
		// fontStyle: '700' in a text style picks the right face.
		this.fontPromises = [];
		CJ.FONTS.forEach((font) => {
			font.files.forEach((file) => {
				file.weights.forEach((w) => {
					const face = new FontFace(
						font.family,
						`url(${CJ.fontFile(font, file, w)}) format('${file.format}')`,
						{ weight: String(w), style: file.style }
					);
					// load() fetches the file; fonts.add() registers it
					this.fontPromises.push(
						face.load().then((loaded) => document.fonts.add(loaded))
					);
				});
			});
		});

		// Icons — .svg files rasterize at 48px so they stay crisp when
		// scaled; any other format loads as a plain image.
		CJ.ICONS.forEach((icon) => {
			if (icon.src.endsWith('.svg')) {
				this.load.svg(icon.key, icon.src, {
					width: 48,
					height: 48,
				});
			} else {
				this.load.image(icon.key, icon.src);
			}
		});
	}


	create() {
		// Wait for every font face before leaving — canvas text only
		// picks up a weight after its FontFace has loaded. A failed
		// file shouldn't block the game, so errors fall through.
		Promise.all(this.fontPromises)
			.catch(() => {})
			.finally(() => this.scene.start(CJ.SCENES.MENU));
	}
}
