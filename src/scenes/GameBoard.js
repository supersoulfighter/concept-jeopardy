// 2. The Main Jeopardy Board Scene
class GameBoard extends Phaser.Scene {
	constructor() {
		super({ key: CJ.SCENES.BOARD });
	}

	init(data) {
		// Track score across scene switches
		this.score = data.score || 0;
		this.visitedClues = data.visitedClues || [];
		// Layout params: CJ.LAYOUT.BOARD defaults, overridable per launch
		this.L = { ...CJ.LAYOUT.BOARD, ...data.layout };
		// The board is built once and passed back from Clue so the same
		// random categories/clues persist for the whole game.
		this.board = data.board || this.buildBoard();
	}

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

	create() {
		const L = this.L;
		const width = this.scale.width;
		const height = this.scale.height;
		const cx = width / 2;
		const cy = height / 2;
		this.add.image(cx, cy, CJ.ASSETS.ROOM.key).setOrigin(0.5).setScale(L.BG_SCALE);

		this.scoreText = this.add.text(
			width - L.SCORE_MARGIN,
			L.SCORE_MARGIN,
			`SCORE: $${this.score}`,
			{ ...CJ.UI.SCORE }
		).setOrigin(1, 0);

		// Derive the grid from the screen size: one extra row for headers.
		const gridW = width - 2 * L.MARGIN_X;
		const gridH = height - L.MARGIN_TOP - L.MARGIN_BOTTOM;
		const colW = gridW / L.COL_NUM;
		const rowH = gridH / (L.ROW_NUM + 1);
		const categorySize = Math.min(rowH * 0.28, colW * 0.12);
		const pointsSize = rowH * 0.45;

		this.board.forEach((catData, colIdx) => {
			const x = L.MARGIN_X + (colIdx + 0.5) * colW;

			// Render Category Header
			this.add.text(
				x,
				L.MARGIN_TOP + rowH / 2,
				catData.category,
				{
					...CJ.UI.BOARD_HEADING,
					fontSize: categorySize,
					wordWrap: { width: colW - L.HEADER_PAD }
				}
			).setOrigin(0.5);

			// Render Point Tiles
			catData.clues.forEach((clue, rowIdx) => {
				const y = L.MARGIN_TOP + (rowIdx + 1.5) * rowH;
				const clueId = `${colIdx}-${rowIdx}`;

				// Check if this clue was already picked
				const isVisited = this.visitedClues.includes(clueId);

				// Draw Tile Background
				const tileBg = this.add.rectangle(
					x,
					y,
					colW - L.TILE_PAD,
					rowH - L.TILE_PAD,
					isVisited ? CJ.COLORS.TILE_VISITED : CJ.COLORS.TILE
				);

				// Draw Text Value
				this.add.text(
					x,
					y,
					isVisited ? '' : `$${clue.value}`,
					{
						...CJ.UI.BOARD_CELL,
						fontSize: pointsSize,
					}
				).setOrigin(0.5);

				if (!isVisited) {
					// Make Interactive
					tileBg.setInteractive({ useHandCursor: true });
					tileBg.on('pointerover', () => tileBg.setFillStyle(CJ.COLORS.TILE_HOVER));
					tileBg.on('pointerout', () => tileBg.setFillStyle(CJ.COLORS.TILE));
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
}

