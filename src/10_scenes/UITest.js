// UITest — a dev overlay that shows every UI component in every state.
// Press F2 anywhere to open it over the running scene, F2 again to
// close (the key listener lives in main.js). The matrix cells have
// their state forced on so all of them are visible at once; the LIVE
// row at the bottom stays fully interactive for real hovering,
// clicking, and typing.
class UITest extends Phaser.Scene {

	//#region Configuration ////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// One column per state flag. 'normal' means no flags turned on.
	static COLUMNS = [
		'normal',
		'selected',
		'hover',
		'pressed',
		'focused',
		'disabled'
	];

	// One row per component — matches the this.add.* names the factory
	// registration in UIRegister.js creates.
	static ROWS = ['uiLabel', 'uiButton', 'uiInput'];

	static LAYOUT = {
		GRID_LEFT: 220,                 // left edge of the matrix
		GRID_RIGHT: CJ.GAME_WIDTH - 30, // right edge of the matrix
		TITLE_Y: CJ.SPACING.XS,         // scene title at the top
		HEADER_Y: CJ.SPACING.L,         // column header row
		ROW_TOP: 150,                   // top edge of the first row
		ROW_HEIGHT: 150,                // vertical space per row
		ROW_LABEL_X: 30,                // left edge of the row labels
		WIDGET_WIDTH: 150,
		WIDGET_HEIGHT: 46,
		LIVE_GAP: 50,                   // gap between matrix and live row
	};

	// The style every demo widget shares. Each state key holds the
	// overrides merged in when that flag is on — see UI.resolveStyle().
	static DEMO_STYLE = {
		backgroundColor: CJ.PALETTE.BLUE,
		borderRadius: 8,
		padding: CJ.SPACING.XXS,
		// Icons render solid black — iconColor recolors them
		iconColor: CJ.PALETTE.WHITE,
		textStyle: {
			...CJ.TYPE_LEVELS.P_BIG,
			fill: CJ.PALETTE.WHITE,
		},

		selected: { backgroundColor: CJ.PALETTE.GREEN },
		hover:    { backgroundColor: CJ.PALETTE.BLUE_PURE },
		pressed:  { backgroundColor: CJ.PALETTE.BLUE_NAVY },
		focused:  {
			borderColor: CJ.PALETTE.AMBER,
			borderWidth: 3,
		},
		disabled: {
			backgroundColor: CJ.PALETTE.GRAY_DARK,
			textStyle: { ...CJ.TYPE_LEVELS.P_BIG, fill: '#777777' },
		},
	};

	//#endregion


	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor () {
		super({ key: CJ.SCENES.UI_TEST });
	}

	//#endregion


	//#region Events ///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	create () {
		const L = UITest.LAYOUT;

		// Dim whatever scene is running underneath the overlay.
		// setInteractive() also makes it an input blocker: the scene
		// below is still running, and without a fullscreen interactive
		// object here its tiles keep receiving pointer events — which
		// steals hover/over state from this overlay's widgets.
		this.add.rectangle(
			0, 0, CJ.GAME_WIDTH, CJ.GAME_HEIGHT, 0x000000, 0.85
		)
			.setOrigin(0)
			.setInteractive();

		this.add.text(
			CJ.GAME_WIDTH / 2, L.TITLE_Y,
			'UI TEST — press F2 to close',
			{ ...CJ.TYPE_LEVELS.H4, fill: CJ.PALETTE.WHITE }
		).setOrigin(0.5, 0);

		this.buildMatrix();
		this.buildLiveRow();
	}

	//#endregion


	//#region Matrix ///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// One column per state, one row per component type.
	buildMatrix () {
		const L = UITest.LAYOUT;
		const colW = (L.GRID_RIGHT - L.GRID_LEFT) / UITest.COLUMNS.length;

		// Column headers along the top
		UITest.COLUMNS.forEach((state, col) => {
			const x = L.GRID_LEFT + (col + 0.5) * colW;
			this.add.text(
				x, L.HEADER_Y, state,
				{ ...CJ.TYPE_LEVELS.H6, fill: CJ.PALETTE.WHITE }
			).setOrigin(0.5);
		});

		UITest.ROWS.forEach((name, row) => {
			const y = L.ROW_TOP + (row + 0.5) * L.ROW_HEIGHT;

			// Row label on the left edge
			this.add.text(
				L.ROW_LABEL_X, y, name,
				{ ...CJ.TYPE_LEVELS.H6, fill: CJ.PALETTE.LIME }
			).setOrigin(0, 0.5);

			UITest.COLUMNS.forEach((state, col) => {
				const x = L.GRID_LEFT + (col + 0.5) * colW;
				const widget = this.buildWidget(name, x, y);
				this.forceState(widget, state);
			});
		});
	}


	// Create one component for a matrix cell, by factory name.
	buildWidget (name, x, y) {
		const L = UITest.LAYOUT;
		if (name === 'uiLabel') {
			return this.add.uiLabel({
				x: x, y: y,
				text: 'Label',
				style: UITest.DEMO_STYLE,
			});
		}
		if (name === 'uiButton') {
			return this.add.uiButton({
				x: x, y: y,
				width: L.WIDGET_WIDTH,
				height: L.WIDGET_HEIGHT,
				text: 'Button',
				style: UITest.DEMO_STYLE,
			});
		}
		return this.add.uiInput({
			x: x, y: y,
			width: L.WIDGET_WIDTH,
			height: L.WIDGET_HEIGHT,
			placeholder: 'Input',
			style: UITest.DEMO_STYLE,
		});
	}


	// Turn a state on without real pointer input. The widget's own hit
	// area is then disabled — if it stayed live, moving the pointer off
	// the cell would clear the forced 'hover' or 'pressed' flag.
	forceState (widget, state) {
		if (state === 'disabled') {
			widget.setDisabled(true);
			return; // setDisabled() already kills the hit area
		}
		if (state !== 'normal') {
			widget.setFlag(state, true);
		}
		if (widget.input) widget.input.enabled = false;

		// A 'focused' input normally shows its blinking text cursor, but
		// the flag alone doesn't — switch it on for the demo.
		if (state === 'focused' && widget.cursor) {
			widget.cursor.setVisible(true);
		}
	}

	//#endregion


	//#region Live row /////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// The bottom row is fully wired: hover, click, and type for real.
	buildLiveRow () {
		const L = UITest.LAYOUT;
		const y = L.ROW_TOP + UITest.ROWS.length * L.ROW_HEIGHT + L.LIVE_GAP;

		this.add.text(
			L.ROW_LABEL_X, y, 'LIVE',
			{ ...CJ.TYPE_LEVELS.H6, fill: CJ.PALETTE.LIME }
		).setOrigin(0, 0.5);

		// Fixed slots spread the three widgets across the row
		const slot = (L.GRID_RIGHT - L.GRID_LEFT) / 3;

		this.add.uiLabel({
			x: L.GRID_LEFT + slot * 0.5, y: y,
			text: 'Label',
			iconLeft: 'heart', // inline — moves with the text
			style: UITest.DEMO_STYLE,
		});

		this.add.uiButton({
			x: L.GRID_LEFT + slot * 1.5, y: y,
			width: L.WIDGET_WIDTH + 50,
			height: L.WIDGET_HEIGHT,
			text: 'Click me',
			// align:'edge' pins the icon to the right edge of the box
			iconRight: { key: 'chevron-right', align: 'edge' },
			// Flips its own label — proves onClick and setText work
			onClick: (btn) => btn.setText('Clicked!'),
			style: UITest.DEMO_STYLE,
		});

		this.add.uiInput({
			x: L.GRID_LEFT + slot * 2.5, y: y,
			width: 240,
			height: L.WIDGET_HEIGHT,
			placeholder: 'Click, then type...',
			iconLeft: 'search',
			style: UITest.DEMO_STYLE,
		});
	}

	//#endregion
}
