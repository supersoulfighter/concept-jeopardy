// UILabel — a text label with an optional background box and icons.
//   this.make.uiLabel({
//       x, y, text: 'Score',
//       iconLeft: 'coin',                        // texture key, or:
//       iconRight: { key: 'star', align: 'edge' },
//       style: {...}, add: true
//   })
// Icon align is 'inline' (rides beside the text) or 'edge' (pinned
// to that side of the box). Leave out width/height to shrink-wrap
// around the text + inline icons (+ padding).
class UILabel extends UIComponent {

	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor (scene, config) {
		super(scene, config);
		const style = this.resolveStyle();

		this.padding = UI.pick(style, 'padding', 0);

		this.label = scene.add.text(
			0,
			0,
			config.text || '',
			style.textStyle || {}
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

		this.layoutContent();
		this.render();
	}

	//#endregion


	setText (text) {
		this.label.setText(text);
		this.layoutContent();
		return this;
	}


	// Called by render() — restyle the text and icons for the current
	// state, then re-center the row in case the font size changed.
	applyStyle (style) {
		// render() fires in the base constructor, before label exists
		if (!this.label) return;
		if (style.textStyle) this.label.setStyle(style.textStyle);
		this.styleIcons(style);
		this.layoutContent();
	}
}
