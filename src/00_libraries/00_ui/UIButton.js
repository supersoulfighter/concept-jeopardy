// UIButton — a clickable label with optional icons on either side.
//   this.make.uiButton({
//       x, y, width, height,
//       text: 'Submit',
//       iconLeft:  'coin',                    // texture key, or:
//       iconRight: { key: 'arrow', size: 24 },
//       iconGap: 8, iconSize: 20,
//       onClick: (btn) => { ... },
//       style: { backgroundColor: '#ffcc00', hover: {...} },
//       add: true
//   })
// Leave out width/height to shrink-wrap around text + icons.
class UIButton extends UIComponent {

	constructor (scene, config) {
		super(scene, config);
		const style = this.resolveStyle();

		this.onClick = config.onClick;
		this.iconGap = UI.pick(config, 'iconGap', UI.DEFAULT_ICON_GAP);
		this.iconSize = UI.pick(config, 'iconSize', UI.DEFAULT_ICON_SIZE);

		this.label = scene.add.text(0, 0, config.text || '', style.textStyle || {});
		this.label.setOrigin(0.5);
		this.add(this.label);

		// Optional icons, laid out beside the text in layoutContent()
		this.iconLeft = this.makeIcon(config.iconLeft);
		this.iconRight = this.makeIcon(config.iconRight);

		// No size given? Fit the box to the content, plus padding.
		if (!this.width || !this.height) {
			const pad = UI.pick(style, 'padding', UI.DEFAULT_PADDING);
			this.setSize(
				config.width || this.contentWidth() + pad * 2,
				config.height || this.label.height + pad * 2
			);
		}

		this.enableInput();
		this.watchHover();
		this.wirePress();

		this.layoutContent();
		this.render();
	}


	// #region Content layout

	// iconConfig is a texture key ('coin') or { key, size, frame }.
	// Returns null when that side has no icon.
	makeIcon (iconConfig) {
		if (!iconConfig) return null;
		const conf = (typeof iconConfig === 'string')
			? { key: iconConfig }
			: iconConfig;
		const icon = this.scene.add.image(0, 0, conf.key, conf.frame);
		// Scale to the target height, keeping the aspect ratio
		const size = conf.size || this.iconSize;
		icon.setScale(size / icon.height);
		icon.setOrigin(0.5);
		this.add(icon);
		return icon;
	}


	// Width of the [icon] text [icon] row — used for shrink-wrap sizing.
	contentWidth () {
		let w = this.label.width;
		if (this.iconLeft) w += this.iconLeft.displayWidth + this.iconGap;
		if (this.iconRight) w += this.iconRight.displayWidth + this.iconGap;
		return w;
	}


	// Center the row [iconLeft] text [iconRight] inside the button.
	// Walks left to right from -totalWidth/2, dropping each piece in.
	layoutContent () {
		let total = this.label.width;
		if (this.iconLeft) total += this.iconLeft.displayWidth + this.iconGap;
		if (this.iconRight) total += this.iconRight.displayWidth + this.iconGap;

		let x = -total / 2;

		if (this.iconLeft) {
			x += this.iconLeft.displayWidth / 2;
			this.iconLeft.setPosition(x, 0);
			x += this.iconLeft.displayWidth / 2 + this.iconGap;
		}

		this.label.setPosition(x + this.label.width / 2, 0);
		x += this.label.width;

		if (this.iconRight) {
			x += this.iconGap + this.iconRight.displayWidth / 2;
			this.iconRight.setPosition(x, 0);
		}
	}

	// #endregion


	// #region Public setters

	setText (text) {
		this.label.setText(text);
		this.layoutContent();
		return this;
	}


	// Pass a texture key / icon config to set, or null to remove.
	setIconLeft (iconConfig) {
		if (this.iconLeft) this.iconLeft.destroy();
		this.iconLeft = this.makeIcon(iconConfig);
		this.layoutContent();
		return this;
	}


	setIconRight (iconConfig) {
		if (this.iconRight) this.iconRight.destroy();
		this.iconRight = this.makeIcon(iconConfig);
		this.layoutContent();
		return this;
	}

	// #endregion


	// #region Internals

	// Press feedback: 'pressed' while the pointer is held down,
	// onClick fires on release (pointerup) like a real button.
	wirePress () {
		this.on('pointerdown', () => this.setFlag('pressed', true));
		this.on('pointerup', () => {
			this.setFlag('pressed', false);
			if (!this.flags.disabled && this.onClick) {
				this.onClick(this);
			}
		});
	}


	// Called by render() — restyle the text, then re-center the row
	// since a state may have changed the font size.
	applyStyle (style) {
		if (!this.label) return; // render() runs before label exists
		if (style.textStyle) this.label.setStyle(style.textStyle);
		this.layoutContent();
	}

	// #endregion
}
