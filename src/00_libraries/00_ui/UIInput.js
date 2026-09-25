// UIInput — a click-to-focus text field typed on the keyboard.
//   this.make.uiInput({
//       x, y, width, height,
//       placeholder: 'Type here...',
//       value: '', maxLength: 20,
//       onChange: (value, input) => { ... },
//       onSubmit: (value, input) => { ... },   // fires on Enter
//       style: { backgroundColor: '#fff', focused: {...} },
//       add: true
//   })
// Printable keys append, Backspace deletes, Enter submits, Escape blurs.
class UIInput extends UIComponent {

	constructor (scene, config) {
		super(scene, config);
		const style = this.resolveStyle();

		this.value = config.value || '';
		this.placeholder = config.placeholder || '';
		this.maxLength = config.maxLength || 0; // 0 = no limit
		this.onChange = config.onChange;
		this.onSubmit = config.onSubmit;
		this.padding = UI.pick(style, 'padding', UI.DEFAULT_PADDING);

		// The typed text, left-aligned inside the box
		this.label = scene.add.text(0, 0, '', style.textStyle || {});
		this.label.setOrigin(0, 0.5);
		this.add(this.label);

		// The text cursor is just a thin rectangle that blinks
		const cursorColor = UI.pick(style, 'cursorColor', '#ffffff');
		this.cursor = scene.add.rectangle(0, 0, 2, 20, UI.color(cursorColor));
		this.cursor.setOrigin(0, 0.5);
		this.cursor.setVisible(false);
		this.add(this.cursor);

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


	// #region Focus

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
			this.scene.input.keyboard.off('keydown', this.keyHandler);
			this.keyHandler = null;
		}
		return this;
	}

	// #endregion


	// #region Typing

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
		const fill = showingPlaceholder
			? UI.pick(style, 'placeholderColor', UI.DEFAULT_PLACEHOLDER_COLOR)
			: UI.pick(style.textStyle || {}, 'fill', '#ffffff');
		this.label.setFill(fill);

		// Left-align inside the box with padding
		const textX = -this.width / 2 + this.padding;
		this.label.setPosition(textX, 0);

		// Cursor hugs the end of the text
		this.cursor.setSize(2, this.label.height || 20);
		this.cursor.setPosition(textX + this.label.width + 2, 0);
	}

	// #endregion


	// #region Public API

	setValue (value) {
		this.value = value;
		this.refreshText();
		return this;
	}


	getValue () {
		return this.value;
	}


	// Called by render() — restyle the text, then re-place it since a
	// state may have changed the font size.
	applyStyle (style) {
		if (!this.label) return; // render() runs before label exists
		if (style.textStyle) this.label.setStyle(style.textStyle);
		this.refreshText();
	}

	// #endregion
}
