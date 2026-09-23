// 2. The Main Jeopardy Board Scene
class GameBoard extends Phaser.Scene {
	constructor() {
		super({ key: CJ.SCENES.BOARD });
	}

	init(data) {
		// Track score across scene switches
		this.score = data.score || 0;
		this.visitedClues = data.visitedClues || [];
	}

	create() {
		const L = CJ.LAYOUT.BOARD;
		const width = this.scale.width;
		const cx = width / 2;
		const cy = this.scale.height / 2;
		this.add.image(cx, cy, CJ.ASSETS.ROOM.key).setOrigin(0.5).setScale(L.BG_SCALE);

		this.scoreText = this.add.text(
			width - L.SCORE_MARGIN,
			L.SCORE_MARGIN,
			`SCORE: $${this.score}`,
			{
				fontFamily: CJ.FONT.key(700),
				fontSize: L.SCORE_SIZE,
				fill: CJ.TEXT.SCORE
			}
		).setOrigin(1, 0);

		GAME_DATA.forEach((catData, colIdx) => {
			// Render Category Header
			this.add.text(
				L.START_X + (colIdx * L.COL_WIDTH),
				L.START_Y,
				catData.category,
				{
					fontFamily: CJ.FONT.key(400),
					fontSize: L.CATEGORY_SIZE,
					fill: CJ.TEXT.CATEGORY,
					align: 'center',
					wordWrap: { width: L.COL_WIDTH - L.HEADER_PAD }
				}
			).setOrigin(0.5);

			// Render Point Tiles
			catData.clues.forEach((clue, rowIdx) => {
				const x = L.START_X + (colIdx * L.COL_WIDTH);
				const y = L.START_Y + ((rowIdx + 1) * L.ROW_HEIGHT);
				const clueId = `${colIdx}-${rowIdx}`;

				// Check if this clue was already picked
				const isVisited = this.visitedClues.includes(clueId);

				// Draw Tile Background
				const tileBg = this.add.rectangle(
					x,
					y,
					L.COL_WIDTH - L.TILE_PAD,
					L.ROW_HEIGHT - L.TILE_PAD,
					isVisited ? CJ.COLORS.TILE_VISITED : CJ.COLORS.TILE
				);

				// Draw Text Value
				this.add.text(
					x,
					y,
					isVisited ? '' : `$${clue.points}`,
					{
						fontSize: L.POINTS_SIZE,
						fill: CJ.TEXT.POINTS,
						fontFamily: CJ.FONT.key(600),
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
							visitedClues: this.visitedClues
						});
					});
				}
			});
		});
	}
}

