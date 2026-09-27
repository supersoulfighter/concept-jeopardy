// The Main Jeopardy Board Scene
class GameBoard extends Phaser.Scene {

	//#region Configuration ////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Screen-space corners of the quad the board texture is
	// stretched over — a cheap perspective projection. TWEAK these
	// numbers until the board sits inside the studio frame painted
	// into room.jpg. tl/tr/br/bl = top-left, top-right,
	// bottom-right, bottom-left.
	static QUAD = {
		tl: { x: 65, y: 120 },
		tr: { x: 687, y: 178 },
		br: { x: 692, y: 563 },
		bl: { x: 70, y: 596 },
	};

	static STRIPS = 64;        // column slices faking the warp
	static FLY_STRIPS = 16;    // column slices on the flying cell
	static FLY_MS = 2000;      // ms, cell's flight to the camera
	static BOARD_TEX = 'boardTex'; // texture key for the baked grid

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
		// 'correct'/'wrong' when returning from Clue, undefined on
		// fresh launches — feeds the host's reaction
		this.result = data.result;
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
			-100,
			-40,
			CJ.IMAGES.ROOM.key
		).setOrigin(0).setScale(1.45); // zoom the room photo to fill


		// Score readout // 'top-right' pins that corner at the margin;
		// red when the player is in the hole. Depth keeps it floating
		// above the projected board.
		this.scoreText = this.add.uiLabel({
			x: width * .77,
			y: height * .566,
			align: 'center',
			text: `$${this.score}`,
			style: {
				...CJ.TYPE_LEVELS.H4,
				fontStyle: '700', // bump the weight from H5's 500
				textColor: this.score < 0
					? CJ.PALETTE.RED_BRIGHT
					: CJ.PALETTE.LIME,
			},
		}).setDepth(4);


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

		// Board texture //
		// The grid is built flat in a container (board-local coords
		// 0..gridW x 0..gridH), baked into a texture, then thrown away
		// — everything on screen is a projected image of it.
		const layer = this.add.container(0, 0);

		this.board.forEach((catData, colIdx) => {
			const x = (colIdx + 0.5) * colW;

			// Category Header // font size and wrap come from the
			// grid math so categories shrink to fit their column
			layer.add(this.add.uiLabel({
				x,
				y: rowH / 2,
				text: catData.category,
				style: {
					...CJ.TYPE_LEVELS.P_BIG,
					textColor: CJ.PALETTE.YELLOW,
					align: 'center',
					fontSize: categorySize,
					wordWrap: { width: colW - CJ.SPACING.XS },
				},
			}));


			// Tiles //
			catData.clues.forEach((clue, rowIdx) => {
				const y = (rowIdx + 1.5) * rowH;
				const clueId = `${colIdx}-${rowIdx}`;

				// Check if this clue was already picked
				const isVisited = this.visitedClues.includes(clueId);


				// Tile // 'disabled' tiles get the gray visited look.
				// No onClick — the buttons are baked pixels now; real
				// hits are caught by the projected polygons below.
				layer.add(this.add.uiButton({
					x,
					y,
					width: colW - CJ.SPACING.XXXS,
					height: rowH - CJ.SPACING.XXXS,
					text: isVisited ? '' : `$${clue.value}`,
					disabled: isVisited,
					style: {
						...CJ.TYPE_LEVELS.H3,
						textColor: CJ.PALETTE.YELLOW_SOFT,
						align: 'center',
						fontSize: pointsSize,
						backgroundColor: CJ.PALETTE.BLUE,
						disabled: {
							backgroundColor: CJ.PALETTE.GRAY_DARK,
						},
					},
				}));
			});
		});

		// Bake: draw the layer into a RenderTexture, then register
		// it under a texture key the strips can use. draw() only queues
		// commands — render() is what actually paints them.
		const rt = this.add.renderTexture(0, 0, gridW, gridH);
		rt.draw(layer);
		rt.render();
		rt.saveTexture(GameBoard.BOARD_TEX);
		rt.destroy();
		layer.destroy();

		// Board strips // the baked texture sliced into thin
		// columns — each plain Image stretches between the quad's
		// top and bottom edges. Heights vary across the quad, and
		// that reads as perspective. No Mesh needed.
		this.boardW = gridW;
		this.boardH = gridH;
		this.boardStrips = this.buildStrips(
			GameBoard.QUAD,
			{ x: 0, y: 0, w: gridW, h: gridH },
			GameBoard.STRIPS
		);

		// Per-tile hit polys + hover paint, in projected space
		this.buildCellQuads();
		this.hoverGfx = this.add.graphics();
		this.hoveredCell = null;
		this.flying = false;
		this.input.on('pointermove', (p) => this.onBoardMove(p));
		this.input.on('pointerdown', (p) => this.onBoardDown(p));


		// Host //
		// added after the board layer so he draws in front,
		// standing at screen center while he wanders
		this.host = new Host(this, cx, cy+100);
		//
		// Back from a clue? He reacts to how the player did
		if (this.result) {
			this.host.react(this.result === 'correct');
		}

		// Theme music //
		// Loops for as long as the board is on screen. The sound object
		// lives in the registry so every board visit shares one instance;
		// pausing (not stopping) keeps the playback position between clues.
		let theme = this.registry.get('theme');
		if (!theme) {
			theme = this.sound.add(CJ.SFX.THEME.key, { loop: true });
			this.registry.set('theme', theme);
		}
		if (theme.isPaused) {
			theme.resume();
		} else if (!theme.isPlaying) {
			theme.play();
		}

		// Leaving the board — clue opens or game over — pauses the theme
		this.events.once('shutdown', () => theme.pause());
	}

	//#endregion



	//#region Internals ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Bilinear projection: point (u,v) in board space, 0..1, lands
	// somewhere inside the screen quad. u runs left->right,
	// v top->bottom.
	project(u, v) {
		const q = GameBoard.QUAD;
		const top = u * (q.tr.x - q.tl.x) + q.tl.x;
		const topY = u * (q.tr.y - q.tl.y) + q.tl.y;
		const bot = u * (q.br.x - q.bl.x) + q.bl.x;
		const botY = u * (q.br.y - q.bl.y) + q.bl.y;
		return {
			x: top + (bot - top) * v,
			y: topY + (botY - topY) * v,
		};
	}


	// Point a->b at t. Tiny helper the strip code leans on.
	lerpPt(a, b, t) {
		return {
			x: a.x + (b.x - a.x) * t,
			y: a.y + (b.y - a.y) * t,
		};
	}


	// Cut a texture rect into `count` thin column Images standing
	// over a screen quad. Each strip's crop covers one slice of
	// the rect; layoutStrips() does the stretching.
	buildStrips(quad, rect, count, depth = 0) {
		// Crops take source-texture pixels; the renderer divides the
		// crop by the source's resolution to get logical size.
		// Measure both so strips scale right at any density.
		const tex = this.textures.get(GameBoard.BOARD_TEX);
		const src = tex.getSourceImage();
		const res = tex.frames.__BASE.source.resolution;
		const pxW = src.width / this.boardW;
		const pxH = src.height / this.boardH;
		const strips = [];
		const sliceW = (rect.w * pxW) / count;
		for (let i = 0; i < count; i++) {
			const strip = this.add.image(0, 0, GameBoard.BOARD_TEX);
			// crop rect in texture pixels — +1px wide hides seams
			const cx = rect.x * pxW + i * sliceW;
			const cy = rect.y * pxH;
			const cw = sliceW + 1;
			const ch = rect.h * pxH;
			strip.setOrigin(0.5, 0.5)
				.setCrop(cx, cy, cw, ch)
				// a cropped Image still pivots on the FULL frame —
				// move the display origin to this slice's center
				// or every strip is shoved sideways by crop.x
				.setDisplayOrigin(cx + cw / 2, cy + ch / 2)
				.setDepth(depth);
			// source slice size in LOGICAL units — the renderer
			// divides crop pixels by resolution before scaling
			strip.srcW = (sliceW + 1) / res;
			strip.srcH = (rect.h * pxH) / res;
			strips.push(strip);
		}
		this.layoutStrips(strips, quad);
		return strips;
	}


	// Midpoint of the column at u — halfway down between the
	// quad's top and bottom edges.
	quadEdge(quad, u) {
		const top = this.lerpPt(quad.tl, quad.tr, u);
		const bot = this.lerpPt(quad.bl, quad.br, u);
		return {
			x: (top.x + bot.x) / 2,
			y: (top.y + bot.y) / 2,
		};
	}


	// Stretch every strip between the quad's top and bottom edges
	// at its column position — that's the whole fake: columns
	// shrink toward the far edge, which reads as perspective.
	layoutStrips(strips, quad) {
		const n = strips.length;
		for (let i = 0; i < n; i++) {
			const u = (i + 0.5) / n;
			const top = this.lerpPt(quad.tl, quad.tr, u);
			const bot = this.lerpPt(quad.bl, quad.br, u);
			const h = Math.hypot(bot.x - top.x, bot.y - top.y);
			// column width: actual spacing between this column's
			// left and right edges, measured at mid-height, plus a
			// little overlap to hide seams
			const mid0 = this.quadEdge(quad, i / n);
			const mid1 = this.quadEdge(quad, (i + 1) / n);
			const w = Math.hypot(mid1.x - mid0.x, mid1.y - mid0.y) * 1.08;
			strips[i]
				.setPosition((top.x + bot.x) / 2, (top.y + bot.y) / 2)
				.setScale(w / strips[i].srcW, h / strips[i].srcH)
				// tilt the column when the quad's edges aren't vertical
				.setRotation(Math.atan2(bot.x - top.x, bot.y - top.y));
		}
	}


	// Turn every unvisited tile into a hit record: its projected
	// screen polygon (for picking) plus its uv rect inside the
	// baked texture (for the fly animation).
	buildCellQuads() {
		const G = this.GRID;
		const width = this.scale.width;
		const gridW = width - 2 * G.MARGIN_X;
		const gridH = this.scale.height
			- G.MARGIN_TOP - G.MARGIN_BOTTOM;
		const colW = gridW / G.COL_NUM;
		const rowH = gridH / (G.ROW_NUM + 1);

		this.cells = [];
		this.board.forEach((catData, colIdx) => {
			catData.clues.forEach((clue, rowIdx) => {
				const u0 = colIdx * colW / gridW;
				const u1 = (colIdx + 1) * colW / gridW;
				const v0 = (rowIdx + 1) * rowH / gridH;
				const v1 = (rowIdx + 2) * rowH / gridH;
				// tl, tr, br, bl in projected screen space
				const pts = [
					this.project(u0, v0),
					this.project(u1, v0),
					this.project(u1, v1),
					this.project(u0, v1),
				];
				this.cells.push({
					clue,
					clueId: `${colIdx}-${rowIdx}`,
					visited: this.visitedClues
						.includes(`${colIdx}-${rowIdx}`),
					poly: new Phaser.Geom.Polygon([
						pts[0].x, pts[0].y,
						pts[1].x, pts[1].y,
						pts[2].x, pts[2].y,
						pts[3].x, pts[3].y,
					]),
					pts,
					uv: { u0, v0, u1, v1 },
				});
			});
		});
	}


	// First unvisited tile under the pointer, or null.
	cellAt(x, y) {
		for (const cell of this.cells) {
			if (!cell.visited
				&& Phaser.Geom.Polygon.Contains(cell.poly, x, y)) {
				return cell;
			}
		}
		return null;
	}


	// Hover paint: white wash over the cell's projected quad so the
	// player sees what they'll click even while it's in perspective.
	onBoardMove(pointer) {
		const cell = this.flying ? null
			: this.cellAt(pointer.worldX, pointer.worldY);
		if (cell === this.hoveredCell) return;
		this.hoveredCell = cell;
		this.hoverGfx.clear();
		if (!cell) return;
		this.sound.play(CJ.SFX.HOVER.key);
		this.hoverGfx.fillStyle(0xffffff, 0.15);
		this.hoverGfx.fillPoints(cell.pts, true);
	}


	// Click: mark the clue taken, let the host announce, then fly
	// the cell's quad up to fill the screen before the Clue opens.
	onBoardDown(pointer) {
		if (this.flying) return;
		const cell = this.cellAt(pointer.worldX, pointer.worldY);
		if (!cell) return;
		this.flying = true;
		this.hoverGfx.clear();
		this.visitedClues.push(cell.clueId);
		cell.visited = true;
		this.sound.play(CJ.SFX.SELECT.key);
		this.host.announce();

		// Flyer: the cell's slice of the baked texture, cut into
		// strips like the board. It starts on the projected quad
		// and morphs up to cover the screen.
		const { u0, v0, u1, v1 } = cell.uv;
		const rect = {
			x: u0 * this.boardW,
			y: v0 * this.boardH,
			w: (u1 - u0) * this.boardW,
			h: (v1 - v0) * this.boardH,
		};
		this.flyer = this.buildStrips(
			{
				tl: cell.pts[0],
				tr: cell.pts[1],
				br: cell.pts[2],
				bl: cell.pts[3],
			},
			rect,
			GameBoard.FLY_STRIPS,
			10 // above everything, it becomes the screen
		);

		const start = cell.pts;
		const w = this.scale.width;
		const h = this.scale.height;
		const end = [
			{ x: 0, y: 0 },
			{ x: w, y: 0 },
			{ x: w, y: h },
			{ x: 0, y: h },
		];
		const prog = { t: 0 };
		this.tweens.add({
			targets: prog,
			t: 1,
			duration: GameBoard.FLY_MS,
			ease: 'Cubic.easeInOut',
			onUpdate: () => this.flyStep(start, end, prog.t),
			onComplete: () => this.openClue(cell.clue),
		});
	}


	// One frame of the flight: lerp the flyer's quad toward the
	// screen corners, then re-stretch its strips over it.
	flyStep(start, end, t) {
		this.layoutStrips(this.flyer, {
			tl: this.lerpPt(start[0], end[0], t),
			tr: this.lerpPt(start[1], end[1], t),
			br: this.lerpPt(start[2], end[2], t),
			bl: this.lerpPt(start[3], end[3], t),
		});
	}


	// Hand off to the Clue scene once the cell covers the screen.
	openClue(clue) {
		this.scene.start(CJ.SCENES.CLUE, {
			clue: clue,
			score: this.score,
			visitedClues: this.visitedClues,
			board: this.board,
			layout: this.GRID
		});
	}


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