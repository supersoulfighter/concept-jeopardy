// UI — a tiny component library (labels, buttons, inputs) built on
// Phaser GameObjects. This file holds the shared UI namespace plus
// UIComponent, the base class every widget extends.
// LOCAL - 'UI.js' sorts before 'UIButton.js' etc. alphabetically, so
// the base class is always defined before the files that extend it.
// The whole src/ui/ folder is self-contained (no project globals), so
// it can be copied into any other Phaser project as-is.
const UI = {

	// Style keys that hold per-state overrides instead of plain values,
	// like &:hover in CSS. resolveStyle() applies them in this order,
	// so a later state wins when several flags are on at once.
	STATES: ['selected', 'hover', 'pressed', 'focused', 'disabled'],

	// Fallbacks used when a config leaves them out
	DEFAULT_PADDING: 12,
	DEFAULT_ICON_SIZE: 20,
	DEFAULT_ICON_GAP: 8,
	DEFAULT_PLACEHOLDER_COLOR: '#888888',

	// Phaser fills want numeric colors (0xffcc00) but our style configs
	// use CSS strings ('#ffcc00'). ValueToColor accepts either.
	color (value) {
		if (value === undefined || value === null) return value;
		return Phaser.Display.Color.ValueToColor(value).color;
	},

	// Split a style config into the base style plus one sub-style per
	// state: { backgroundColor: '#fff', hover: {...} } becomes
	//   base:   { backgroundColor: '#fff' }
	//   states: { hover: {...} }
	splitStyle (style) {
		const base = {};
		const states = {};
		for (const key in style) {
			if (UI.STATES.includes(key)) {
				states[key] = style[key];
			} else {
				base[key] = style[key];
			}
		}
		return { base: base, states: states };
	},

	// Read style.prop, falling back to a default when it's undefined.
	// (|| would also swallow 0 and '', which are valid values here.)
	pick (style, prop, fallback) {
		return style[prop] === undefined ? fallback : style[prop];
	}
};




// Base class for every UI widget: a Container that takes a CSS-like
// style config, draws its own background (Graphics shapes or a texture
// image), and re-renders whenever a state flag changes.
//
// Style keys:  backgroundColor, backgroundAlpha, borderColor,
//              borderWidth, borderRadius, padding, image, textStyle,
//              plus one sub-object per state (hover, selected, ...).
class UIComponent extends Phaser.GameObjects.Container {

	constructor (scene, config) {
		super(scene, config.x || 0, config.y || 0);
		this.config = config;

		// Split the style into base values + per-state overrides
		const split = UI.splitStyle(config.style || {});
		this.baseStyle = split.base;
		this.stateStyles = split.states;

		// State flags — resolveStyle() merges the matching overrides
		this.flags = {
			selected: false,
			hover:    false,
			pressed:  false,
			focused:  false,
			disabled: !!config.disabled
		};

		// The container's size doubles as background size and hit area
		this.setSize(config.width || 0, config.height || 0);

		this.render();
	}


	// #region State

	// Merge the base style with whichever state overrides are active.
	resolveStyle () {
		let style = { ...this.baseStyle };
		for (const name of UI.STATES) {
			if (this.flags[name]) {
				style = { ...style, ...this.stateStyles[name] };
			}
		}
		return style;
	}


	// Flip a state flag and redraw. The public helpers below call this.
	setFlag (name, value) {
		if (this.flags[name] === value) return;
		this.flags[name] = value;
		this.render();
	}


	setSelected (value) {
		this.setFlag('selected', value);
		return this;
	}


	// Disabled widgets ignore the pointer and draw their disabled style.
	setDisabled (value) {
		this.setFlag('disabled', value);
		// this.input only exists after a subclass calls enableInput()
		if (this.input) {
			this.input.enabled = !value;
		}
		return this;
	}

	// #endregion


	// #region Rendering

	// Redraw everything for the current state. Called by setFlag() and
	// once at the end of each subclass constructor.
	render () {
		const style = this.resolveStyle();
		this.drawBackground(style);
		this.applyStyle(style);
		return this;
	}


	// Pick the background kind: a stretched texture, or drawn shapes.
	drawBackground (style) {
		if (style.image) {
			this.drawImageBackground(style);
		} else {
			this.drawGraphicsBackground(style);
		}
	}


	// Draw the box with Graphics: a rounded fill plus optional border.
	// Draws nothing while width/height are zero (shrink-wrap labels).
	drawGraphicsBackground (style) {
		if (this.bgImage) this.bgImage.setVisible(false);
		if (!this.bg) {
			this.bg = this.scene.add.graphics();
			this.addAt(this.bg, 0); // index 0 keeps it behind the content
		}
		const g = this.bg;
		g.clear();
		if (!this.width || !this.height) return;

		const x = -this.width / 2;
		const y = -this.height / 2;
		const radius = style.borderRadius || 0;

		if (style.backgroundColor !== undefined) {
			const alpha = UI.pick(style, 'backgroundAlpha', 1);
			g.fillStyle(UI.color(style.backgroundColor), alpha);
			if (radius > 0) {
				g.fillRoundedRect(x, y, this.width, this.height, radius);
			} else {
				g.fillRect(x, y, this.width, this.height);
			}
		}

		if (style.borderColor !== undefined && style.borderWidth) {
			g.lineStyle(style.borderWidth, UI.color(style.borderColor));
			if (radius > 0) {
				g.strokeRoundedRect(x, y, this.width, this.height, radius);
			} else {
				g.strokeRect(x, y, this.width, this.height);
			}
		}
	}


	// Stretch a texture across the component instead of drawing shapes.
	drawImageBackground (style) {
		if (this.bg) this.bg.clear(); // hide the drawn box if switching
		if (!this.bgImage) {
			this.bgImage = this.scene.add.image(0, 0, style.image);
			this.addAt(this.bgImage, 0);
		}
		this.bgImage.setTexture(style.image);
		// No size in the config? Fall back to the texture's own size.
		if (!this.width || !this.height) {
			this.setSize(this.bgImage.width, this.bgImage.height);
		}
		this.bgImage.setDisplaySize(this.width, this.height);
		this.bgImage.setAlpha(UI.pick(style, 'backgroundAlpha', 1));
		this.bgImage.setVisible(true);
	}


	// Subclasses override this to restyle their content (text fill,
	// cursor color...). Runs during the base constructor too, before
	// subclass content exists — so each override guards its own fields.
	applyStyle (style) {}

	// #endregion


	// #region Input

	// Rectangular hit area centered on the component + a hand cursor.
	// Containers have no default hit area, so we pass one explicitly.
	enableInput () {
		const w = this.width;
		const h = this.height;
		this.setInteractive({
			hitArea: new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
			hitAreaCallback: Phaser.Geom.Rectangle.Contains,
			useHandCursor: true
		});
		// A widget built disabled starts with its input switched off
		if (this.flags.disabled) this.input.enabled = false;
	}


	// Track the pointer to flip the hover flag on and off.
	watchHover () {
		this.on('pointerover', () => this.setFlag('hover', true));
		this.on('pointerout', () => {
			this.setFlag('hover', false);
			this.setFlag('pressed', false);
		});
	}

	// #endregion
}
