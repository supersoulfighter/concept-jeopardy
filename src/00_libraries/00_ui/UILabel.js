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
// config.align picks which part of the label sits at x/y — 'center'
// (default), an edge ('left', 'top'...) or corner ('top-right'...).
class UILabel extends UIComponent {

	//#region Configuration ////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// How far x/y sits from the label's center for each align value,
	// as a fraction of its width/height. 'top-right' means the
	// label's top-right corner lands on x/y.
	static ALIGN = {
		'center':       [0, 0],
		'left':         [0.5, 0],
		'right':        [-0.5, 0],
		'top':          [0, 0.5],
		'bottom':       [0, -0.5],
		'top-left':     [0.5, 0.5],
		'top-right':    [-0.5, 0.5],
		'bottom-left':  [0.5, -0.5],
		'bottom-right': [-0.5, -0.5],
	};

	//#endregion



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

		// Shift the center so the aligned edge/corner lands on x/y
		const shift = UILabel.ALIGN[config.align || 'center'];
		this.x += this.width * shift[0];
		this.y += this.height * shift[1];

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
		this.label.setStyle(UI.textStyle(style));
		this.styleIcons(style);
		this.layoutContent();
	}
}
