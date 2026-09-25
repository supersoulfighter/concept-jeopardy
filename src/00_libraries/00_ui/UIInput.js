// UIInput — a click-to-focus text field typed on the keyboard.
//   this.make.uiInput({
//       x, y, width, height,
//       placeholder: 'Type here...',
//       value: '', maxLength: 20,
//       iconLeft: 'search',   // pinned just inside the box edges
//       onChange: (value, input) => { ... },
//       onSubmit: (value, input) => { ... },   // fires on Enter
//       style: { backgroundColor: '#fff', focused: {...} },
//       add: true
//   })
// Printable keys append, Backspace deletes, Enter submits, Escape blurs.
class UIInput extends UIComponent {

	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor (scene, config) {
		super(scene, config);
		const style = this.resolveStyle();

		this.value = config.value || '';
		this.placeholder = config.placeholder || '';
		this.maxLength = config.maxLength || 0; // 0 = no limit
		this.onChange = config.onChange;
		this.onSubmit = config.onSubmit;
		this.padding = UI.pick(
			style,
			'padding',
			UI.DEFAULT_PADDING
		);

		// The typed text, left-aligned inside the box
		this.label = scene.add.text(
			0,
			0,
			'',
			UI.textStyle(style)
		);
		this.label.setOrigin(0, 0.5);
		this.add(this.label);

		// The text cursor is just a thin rectangle that blinks
		const cursorColor = UI.pick(
			style,
			'cursorColor',
			'#ffffff'
		);
		this.cursor = scene.add.rectangle(
			0,
			0,
			2,
			20,
			UI.color(cursorColor)
		);
		this.cursor.setOrigin(0, 0.5);
		this.cursor.setVisible(false);
		this.add(this.cursor);

		// Optional icons — pinned to the box edges, see setupIcons()
		this.setupIcons(config);

		this.enableInput();
		this.watchHover();
		this.on('pointerdown', () => this.focus());

		// Clicking anywhere else blurs the field. 'over' is the list of
		// interactive objects under the pointer on a scene-level click.
		this.blurCheck = (pointer, over) => {
			if (!over.includes(this)) this.blur();
		};
		scene.input.on('pointerdown', this.blurCheck);

		// Unhook the scene-level listener if this input is destroyed
		this.once('destroy', () => {
			scene.input.off('pointerdown', this.blurCheck);
			this.blur();
		});

		this.render();
	}

	//#endregion



	//#region Focus ////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Give the field focus: show the cursor and start listening for
	// keystrokes on the scene's keyboard plugin.
	focus () {
		if (this.flags.disabled || this.flags.focused) return;
		this.setFlag('focused', true);
		this.cursor.setVisible(true);

		// Blink by toggling cursor visibility every half second
		this.blinkTimer = this.scene.time.addEvent({
			delay: 500,
			repeat: -1,
			callback: () => this.cursor.setVisible(!this.cursor.visible)
		});

		this.keyHandler = (event) => this.onTypeKey(event);
		this.scene.input.keyboard.on('keydown', this.keyHandler);
		return this;
	}


	// Drop focus: hide the cursor and stop listening for keystrokes.
	blur () {
		if (!this.flags.focused) return;
		this.setFlag('focused', false);
		this.cursor.setVisible(false);
		if (this.blinkTimer) {
			this.blinkTimer.remove();
			this.blinkTimer = null;
		}
		if (this.keyHandler) {
			this.scene.input.keyboard.off(
				'keydown',
				this.keyHandler
			);
			this.keyHandler = null;
		}
		return this;
	}

	//#endregion



	//#region Typing ///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Handle one keypress while focused.
	onTypeKey (event) {
		if (event.key === 'Enter') {
			if (this.onSubmit) this.onSubmit(this.value, this);
			return;
		}
		if (event.key === 'Escape') {
			this.blur();
			return;
		}
		if (event.key === 'Backspace') {
			this.value = this.value.slice(0, -1);
		} else if (event.key.length === 1) {
			// length 1 means a printable character (not Shift, Alt, ...)
			if (this.maxLength && this.value.length >= this.maxLength) {
				return;
			}
			this.value += event.key;
		}
		this.refreshText();
		if (this.onChange) this.onChange(this.value, this);
	}


	// Show the value (or the placeholder when empty) and park the
	// cursor right after the last character.
	refreshText () {
		const style = this.resolveStyle();
		const showingPlaceholder = (this.value === '');
		this.label.setText(showingPlaceholder ? this.placeholder : this.value);

		// Placeholder text gets its own dimmer color
		// textColor lands on fill inside UI.textStyle()
		const color = showingPlaceholder
			? UI.pick(style, 'placeholderColor', UI.DEFAULT_PLACEHOLDER_COLOR)
			: UI.pick(UI.textStyle(style), 'fill', '#ffffff');
		this.label.setFill(color);

		// Icons pin to the box edges, inside the padding
		if (this.iconLeft) {
			this.iconLeft.setPosition(
				-this.width / 2 + this.padding + this.iconLeft.displayWidth / 2, 0
			);
		}
		if (this.iconRight) {
			this.iconRight.setPosition(
				this.width / 2 - this.padding - this.iconRight.displayWidth / 2, 0
			);
		}

		// Left-align the text inside the box: padding, plus room for
		// a left icon when there is one
		let textX = -this.width / 2 + this.padding;
		if (this.iconLeft) {
			textX += this.iconLeft.displayWidth + this.iconGap;
		}
		this.label.setPosition(textX, 0);

		// Cursor hugs the end of the typed text — but when only the
		// placeholder is showing it belongs BEFORE the prompt text
		const cursorX = showingPlaceholder
			? textX
			: textX + this.label.width + 2;
		this.cursor.setSize(2, this.label.height || 20);
		this.cursor.setPosition(cursorX, 0);
	}

	//#endregion



	//#region Public API ///////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	setValue (value) {
		this.value = value;
		this.refreshText();
		return this;
	}


	getValue () {
		return this.value;
	}


	// Called by render() — restyle the text and icons, then re-place
	// them since a state may have changed the font size.
	applyStyle (style) {
		// render() runs before label exists, and the destroy-hook blur()
		// can re-render after Phaser has already destroyed it — either
		// way there's nothing to restyle.
		if (!this.label || !this.label.active) return;
		this.label.setStyle(UI.textStyle(style));
		this.styleIcons(style);
		this.refreshText();
	}

	//#endregion
}
