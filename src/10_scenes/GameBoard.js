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

	static MESH_SUBDIV = 8;   // quad grid density — smooths the warp
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
		// it under a texture key the mesh can use. draw() only queues
		// commands — render() is what actually paints them.
		const rt = this.add.renderTexture(0, 0, gridW, gridH);
		rt.draw(layer);
		rt.render();
		rt.saveTexture(GameBoard.BOARD_TEX);
		rt.destroy();
		layer.destroy();

		// Board mesh // a subdivided quad warped onto the studio
		// frame — each grid vertex is pushed to its projected spot
		const meshData = this.buildBoardMesh();
		this.boardMesh = this.add.mesh2d(
			0,
			0,
			GameBoard.BOARD_TEX,
			meshData.vertices,
			meshData.indices
		);

		// Per-tile hit polys + hover paint, in projected space
		this.buildCellQuads();
		this.hoverGfx = this.add.graphics();
		this.hoveredCell = null;
		this.flying = false;
		this.input.on('pointermove', (p) => this.onBoardMove(p));
		this.input.on('pointerdown', (p) => this.onBoardDown(p));


		// Host // added after the board layer so he draws in front,
		// standing at screen center while he wanders
		this.host = new Host(this, cx, cy+100);

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


	// Build the subdivided quad the board texture stretches over.
	// vertices are [x, y, u, v] quads; indices are [a, b, c, page]
	// triples+page — two triangles per grid cell.
	buildBoardMesh() {
		const n = GameBoard.MESH_SUBDIV;
		const vertices = [];
		const indices = [];

		for (let j = 0; j <= n; j++) {
			for (let i = 0; i <= n; i++) {
				const u = i / n;
				const v = j / n;
				const p = this.project(u, v);
				// boardTex lives y-flipped in GL space — sample (u, 1-v)
				vertices.push(p.x, p.y, u, 1 - v);
			}
		}
		const row = n + 1;
		for (let j = 0; j < n; j++) {
			for (let i = 0; i < n; i++) {
				const tl = j * row + i;
				const tr = tl + 1;
				const bl = tl + row;
				const br = bl + 1;
				indices.push(tl, tr, br, 0);
				indices.push(tl, br, bl, 0);
			}
		}
		return { vertices, indices };
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

		// Flyer: a tiny mesh that draws just this cell's slice of
		// the baked board texture. Its vertices start on the
		// projected quad and end on the screen corners.
		const { u0, v0, u1, v1 } = cell.uv;
		// same (u, 1-v) flip as the board mesh
		const verts = [
			cell.pts[0].x, cell.pts[0].y, u0, 1 - v0,
			cell.pts[1].x, cell.pts[1].y, u1, 1 - v0,
			cell.pts[2].x, cell.pts[2].y, u1, 1 - v1,
			cell.pts[3].x, cell.pts[3].y, u0, 1 - v1,
		];
		this.flyer = this.add.mesh2d(
			0,
			0,
			GameBoard.BOARD_TEX,
			verts,
			[0, 1, 2, 0, 0, 2, 3, 0]
		).setDepth(10); // above everything, it becomes the screen

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


	// One frame of the flight: slide each corner toward its
	// screen edge, ending flat and face-on.
	flyStep(start, end, t) {
		const v = this.flyer.vertices;
		for (let i = 0; i < 4; i++) {
			v[i * 4] = start[i].x + (end[i].x - start[i].x) * t;
			v[i * 4 + 1] = start[i].y + (end[i].y - start[i].y) * t;
		}
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