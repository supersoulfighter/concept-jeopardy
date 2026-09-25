// The Main Jeopardy Board Scene
class GameBoard extends Phaser.Scene {

	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor() {
		super({ key: CJ.SCENES.BOARD });
	}

	//#endregion



	//#region Events ///////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	init(data) {
		// Track score across scene switches
		this.score = data.score || 0;
		this.visitedClues = data.visitedClues || [];
		// Grid parameters — the grid is COL_NUM x ROW_NUM and every
		// dimension is derived from the screen size in create().
		// data.layout can override any of these per launch.
		this.GRID = {
			COL_NUM: 5,               // categories per board
			ROW_NUM: 5,               // clue tiles per category
			MARGIN_X: CJ.SPACING.M,   // left/right margin around the grid
			MARGIN_TOP: CJ.SPACING.L, // room for the score line
			MARGIN_BOTTOM: CJ.SPACING.S,
			MAX_CLUE_VALUE: 1000,     // dollar value of a max-weight clue
			WEIGHT_MAX: 5,            // highest weight used in GAME_DATA
			HEADER_FONT_ROW: 0.28,    // category text: fraction of row height
			HEADER_FONT_COL: 0.12,    // category text: fraction of column width
			TILE_FONT_SCALE: 0.45,    // tile $ value: fraction of row height
			...data.layout,
		};
		// The board is built once and passed back from Clue so the same
		// random categories/clues persist for the whole game.
		this.board = data.board || this.buildBoard();
	}


	create() {
		const G = this.GRID;
		const width = this.scale.width;
		const height = this.scale.height;
		const cx = width / 2;
		const cy = height / 2;


		// Background //
		this.add.image(
			cx,
			cy,
			CJ.IMAGES.ROOM.key
		).setOrigin(0.5).setScale(1.5); // zoom the room photo to fill


		// Score readout // 'top-right' pins that corner at the margin;
		// red when the player is in the hole
		this.scoreText = this.add.uiLabel({
			x: width - CJ.SPACING.S,
			y: CJ.SPACING.S,
			align: 'top-right',
			text: `SCORE: $${this.score}`,
			style: {
				...CJ.TYPE_LEVELS.H5,
				fontStyle: '700', // bump the weight from H5's 500
				textColor: this.score < 0
					? CJ.PALETTE.RED_BRIGHT
					: CJ.PALETTE.LIME,
			},
		});


		// Grid //
		// Derive from the screen size: one extra row for header.
		const gridW = width - 2 * G.MARGIN_X;
		const gridH = height - G.MARGIN_TOP - G.MARGIN_BOTTOM;
		const colW = gridW / G.COL_NUM;
		const rowH = gridH / (G.ROW_NUM + 1);
		// Font sizes follow the tile size: categories cap at the
		// smaller of a row-based and column-based limit
		const categorySize = Math.min(
			rowH * G.HEADER_FONT_ROW,
			colW * G.HEADER_FONT_COL
		);
		const pointsSize = rowH * G.TILE_FONT_SCALE;

		this.board.forEach((catData, colIdx) => {
			const x = G.MARGIN_X + (colIdx + 0.5) * colW;

			// Category Header // font size and wrap come from the
			// grid math so categories shrink to fit their column
			this.add.uiLabel({
				x,
				y: G.MARGIN_TOP + rowH / 2,
				text: catData.category,
				style: {
					...CJ.TYPE_LEVELS.P_BIG,
					textColor: CJ.PALETTE.YELLOW,
					align: 'center',
					fontSize: categorySize,
					wordWrap: { width: colW - CJ.SPACING.XS },
				},
			});


			// Tiles //
			catData.clues.forEach((clue, rowIdx) => {
				const y = G.MARGIN_TOP + (rowIdx + 1.5) * rowH;
				const clueId = `${colIdx}-${rowIdx}`;

				// Check if this clue was already picked
				const isVisited = this.visitedClues.includes(clueId);


				// Tile // 'disabled' tiles get the gray visited look
				// and a dead hit area automatically
				this.add.uiButton({
					x,
					y,
					width: colW - CJ.SPACING.XXXS,
					height: rowH - CJ.SPACING.XXXS,
					text: isVisited ? '' : `$${clue.value}`,
					disabled: isVisited,
					sfx: {
						hover: CJ.SFX.HOVER.key,
						press: CJ.SFX.PRESS.key,
						click: CJ.SFX.SELECT.key,
					},
					style: {
						...CJ.TYPE_LEVELS.H3,
						textColor: CJ.PALETTE.YELLOW_SOFT,
						align: 'center',
						fontSize: pointsSize,
						backgroundColor: CJ.PALETTE.BLUE,
						hover: {
							backgroundColor: CJ.PALETTE.BLUE_PURE,
						},
						disabled: {
							backgroundColor: CJ.PALETTE.GRAY_DARK,
						},
					},
					onClick: () => {
						this.visitedClues.push(clueId);
						// Launch the Clue overlay scene
						this.scene.start(CJ.SCENES.CLUE, {
							clue: clue,
							score: this.score,
							visitedClues: this.visitedClues,
							board: this.board,
							layout: this.GRID
						});
					},
				});
			});
		});
	}

	//#endregion



	//#region Internals ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Randomly pick L.COL_NUM categories and up to L.ROW_NUM clues each.
	// Within a column, weights never repeat and run lowest to highest.
	// Each clue gets a dollar value from its relative weight.
	buildBoard() {
		const L = this.GRID;
		return pickRandom(GAME_DATA, L.COL_NUM).map((catData) => {
			const byWeight = {};
			catData.clues.forEach((clue) => {
				(byWeight[clue.weight] = byWeight[clue.weight] || []).push(clue);
			});
			const weights = pickRandom(Object.keys(byWeight), L.ROW_NUM)
				.map(Number)
				.sort((a, b) => a - b);
			return {
				category: catData.category,
				clues: weights.map((w) => ({
					...pickRandom(byWeight[w], 1)[0],
					value: Math.round(w * (L.MAX_CLUE_VALUE / L.WEIGHT_MAX)),
				})),
			};
		});
	}

	//#endregion
}