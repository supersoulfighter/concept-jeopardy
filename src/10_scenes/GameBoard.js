// The Main Jeopardy Board Scene
class GameBoard extends Phaser.Scene {

	//#region Configuration ////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Board grid parameters — the grid is COL_NUM x ROW_NUM and every
	// dimension is derived from the screen size at scene start. Any of
	// these can be overridden per launch via scene data (data.layout).
	static GRID = {
		COL_NUM: 5,               // categories per board
		ROW_NUM: 5,               // clue tiles per category
		MARGIN_X: CJ.SPACING.M,   // left/right margin around the grid
		MARGIN_TOP: CJ.SPACING.L, // room for the score line
		MARGIN_BOTTOM: CJ.SPACING.S,
		MAX_CLUE_VALUE: 1000,     // dollar value of a max-weight clue
		WEIGHT_MAX: 5,            // highest weight used in GAME_DATA
	};

	// Room photo behind the board
	static BG_SCALE = 1.5;

	// Score readout in the top-right corner
	static SCORE_READOUT = {
		MARGIN: CJ.SPACING.S,
		STYLE: {
			...CJ.TYPE_LEVELS.H5,
			fontStyle: '700', // bump the weight from H5's default 500
			fill: CJ.PALETTE.LIME,
		},
	};

	// Category header row above the tiles
	static HEADER_ROW = {
		PAD: CJ.SPACING.XS,
		STYLE: {
			...CJ.TYPE_LEVELS.P_BIG,
			fill: CJ.PALETTE.YELLOW,
			align: 'center',
		},
	};

	// Clue tiles: padding, fill colors, and dollar-value text
	static TILE = {
		PAD: CJ.SPACING.XXXS,
		COLOR: hexToInt(CJ.PALETTE.BLUE),
		HOVER: hexToInt(CJ.PALETTE.BLUE_PURE),
		VISITED: hexToInt(CJ.PALETTE.GRAY_DARK),
		STYLE: {
			...CJ.TYPE_LEVELS.H3,
			fill: CJ.PALETTE.YELLOW_SOFT,
			align: 'center',
		},
	};

	//#endregion



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
		// Grid params: GRID defaults, overridable per launch
		this.L = { ...GameBoard.GRID, ...data.layout };
		// The board is built once and passed back from Clue so the same
		// random categories/clues persist for the whole game.
		this.board = data.board || this.buildBoard();
	}


	create() {
		const L = this.L;
		const width = this.scale.width;
		const height = this.scale.height;
		const cx = width / 2;
		const cy = height / 2;


		// Background //
		this.add.image(
			cx,
			cy,
			CJ.IMAGES.ROOM.key
		).setOrigin(0.5).setScale(GameBoard.BG_SCALE);


		// Score readout //
		this.scoreText = this.add.text(
			width - GameBoard.SCORE_READOUT.MARGIN,
			GameBoard.SCORE_READOUT.MARGIN,
			`SCORE: $${this.score}`,
			{
				...GameBoard.SCORE_READOUT.STYLE,
				// Red when the player is in the hole
				fill: this.score < 0 ? CJ.PALETTE.RED_BRIGHT : CJ.PALETTE.LIME,
			}
		).setOrigin(1, 0);


		// Grid //
		// Derive from the screen size: one extra row for header.
		const gridW = width - 2 * L.MARGIN_X;
		const gridH = height - L.MARGIN_TOP - L.MARGIN_BOTTOM;
		const colW = gridW / L.COL_NUM;
		const rowH = gridH / (L.ROW_NUM + 1);
		const categorySize = Math.min(rowH * 0.28, colW * 0.12);
		const pointsSize = rowH * 0.45;

		this.board.forEach((catData, colIdx) => {
			const x = L.MARGIN_X + (colIdx + 0.5) * colW;

			// Category Header //
			this.add.text(
				x,
				L.MARGIN_TOP + rowH / 2,
				catData.category,
				{
					...GameBoard.HEADER_ROW.STYLE,
					fontSize: categorySize,
					wordWrap: { width: colW - GameBoard.HEADER_ROW.PAD }
				}
			).setOrigin(0.5);


			// Tiles //
			catData.clues.forEach((clue, rowIdx) => {
				const y = L.MARGIN_TOP + (rowIdx + 1.5) * rowH;
				const clueId = `${colIdx}-${rowIdx}`;

				// Check if this clue was already picked
				const isVisited = this.visitedClues.includes(clueId);


				// Tile Background //
				const tileBg = this.add.rectangle(
					x,
					y,
					colW - GameBoard.TILE.PAD,
					rowH - GameBoard.TILE.PAD,
					isVisited ? GameBoard.TILE.VISITED : GameBoard.TILE.COLOR
				);


				// Tile Text //
				this.add.text(
					x,
					y,
					isVisited ? '' : `$${clue.value}`,
					{
						...GameBoard.TILE.STYLE,
						fontSize: pointsSize,
					}
				).setOrigin(0.5);


				// Make Interactive
				if (!isVisited) {
					tileBg.setInteractive({ useHandCursor: true });
					tileBg.on(
						'pointerover',
						() => tileBg.setFillStyle(GameBoard.TILE.HOVER)
					);
					tileBg.on(
						'pointerout',
						() => tileBg.setFillStyle(GameBoard.TILE.COLOR)
					);
					tileBg.on('pointerdown', () => {
						this.visitedClues.push(clueId);
						// Launch the Clue overlay scene
						this.scene.start(CJ.SCENES.CLUE, {
							clue: clue,
							score: this.score,
							visitedClues: this.visitedClues,
							board: this.board,
							layout: this.L
						});
					});
				}
			});
		});
	}

	//#endregion



	//#region Internals ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Randomly pick COL_NUM categories and up to ROW_NUM clues each.
	// Within a column, weights never repeat and run lowest to highest.
	// Each clue gets a dollar value from its relative weight.
	buildBoard() {
		const L = this.L;
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