// UIButton — a clickable label with optional icons on either side.
//   this.make.uiButton({
//       x, y, width, height,
//       text: 'Submit',
//       iconLeft:  'coin',                          // texture key, or:
//       iconRight: { key: 'arrow', size: 24, align: 'edge' },
//       iconGap: 8, iconSize: 20,
//       onClick: (btn) => { ... },
//       sfx: { press: 'press', click: 'select', hover: 'hover' },
//       style: { backgroundColor: '#ffcc00', iconColor: '#fff' },
//       add: true
//   })
// Icon align is 'inline' (rides beside the text) or 'edge' (pinned
// to that side of the box). Leave out width/height to shrink-wrap
// around text + inline icons.
class UIButton extends UIComponent {

	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor (scene, config) {
		super(scene, config);
		const style = this.resolveStyle();

		this.onClick = config.onClick;
		this.padding = UI.pick(
			style,
			'padding',
			UI.DEFAULT_PADDING
		);

		this.label = scene.add.text(
			0,
			0,
			config.text || '',
			UI.textStyle(style)
		);
		this.label.setOrigin(0.5);
		this.add(this.label);

		// Optional icons — see UIComponent.setupIcons()
		this.setupIcons(config);

		// No size given? Fit the box to the content, plus padding.
		const pad = this.padding;
		if (!this.width || !this.height) {
			this.setSize(
				config.width || this.contentWidth() + pad * 2,
				config.height || this.contentHeight() + pad * 2
			);
		}

		this.enableInput();
		this.watchHover();
		this.wirePress();

		this.layoutContent();
		this.render();
	}

	//#endregion



	//#region Public API ///////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

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

	//#endregion



	//#region Internals ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Press feedback: 'pressed' while the pointer is held down,
	// onClick fires on release (pointerup) like a real button.
	wirePress () {
		this.on('pointerdown', () => {
			if (!this.flags.disabled) UI.playSfx(this, 'press');
			this.setFlag('pressed', true);
		});
		this.on('pointerup', () => {
			this.setFlag('pressed', false);
			if (!this.flags.disabled && this.onClick) {
				UI.playSfx(this, 'click');
				this.onClick(this);
			}
		});
	}


	// Called by render() — restyle the text and icons, then re-center
	// the row since a state may have changed the font size.
	applyStyle (style) {
		if (!this.label) return; // render() runs before label exists
		this.label.setStyle(UI.textStyle(style));
		this.styleIcons(style);
		this.layoutContent();
	}

	//#endregion
}
