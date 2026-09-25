// UILabel — a text label with an optional background box.
//   this.make.uiLabel({ x, y, text, style: {...}, add: true })
// Leave out width/height to shrink-wrap around the text (+ padding).
class UILabel extends UIComponent {

	constructor (scene, config) {
		super(scene, config);
		const style = this.resolveStyle();

		this.label = scene.add.text(0, 0, config.text || '', style.textStyle || {});
		this.label.setOrigin(0.5);
		this.add(this.label);

		// No size given? Fit the box to the text, plus padding.
		if (!this.width || !this.height) {
			const pad = UI.pick(style, 'padding', 0);
			this.setSize(
				this.label.width + pad * 2,
				this.label.height + pad * 2
			);
		}

		this.render();
	}


	setText (text) {
		this.label.setText(text);
		return this;
	}


	// Called by render() — restyle the text for the current state.
	applyStyle (style) {
		// render() fires in the base constructor, before label exists
		if (!this.label) return;
		if (style.textStyle) this.label.setStyle(style.textStyle);
	}
}
