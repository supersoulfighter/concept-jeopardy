// Host — the NPC emcee. Lives only on the GameBoard scene.
//   const host = new Host(this);   // inside a scene
//
// He wanders left and right around the middle of the screen,
// pausing to idle between walks, and reacts to the player's
// answer when the scene comes back from a clue:
//   host.react(true)  -> celebrate (correct answer)
//   host.react(false) -> cry       (wrong answer or time's up)
class Host extends Phaser.GameObjects.Sprite {

	//#region Configuration ////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Both sheets are 8 frames wide x 4 states tall; each row is one
	// animation. Named here so the row order is obvious when the art
	// changes. Unused rows are for future work.
	static ANIMS = [
		// host.gif rows, top to bottom
		{ key: 'host-idle',       sheet: 'host',  row: 0 },
		{ key: 'host-announce',   sheet: 'host',  row: 1 },
		{ key: 'host-cry',        sheet: 'host',  row: 2 },
		{ key: 'host-celebrate',  sheet: 'host',  row: 3 },
		// host2.gif rows, top to bottom
		{ key: 'host-walk',       sheet: 'host2', row: 0 },
		{ key: 'host-laugh',      sheet: 'host2', row: 1 },
		{ key: 'host-disagree',   sheet: 'host2', row: 2 },
		{ key: 'host-agree',      sheet: 'host2', row: 3 },
	];

	static SCALE = 1; 
	static WALK_SPEED = 60;    // px/sec while pacing
	static IDLE_MIN = 2000;      // ms — shortest idle pause
	static IDLE_MAX = 12000;     // ms — longest idle pause
	static REACT_MS = 3000;     // how long a reaction plays out
	static FRAMES_PER_ROW = 8;

	//#endregion




	//#region Constructor //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	constructor(scene, x, y) {
		Host.defineAnims(scene);
		super(scene, x, y, 'host', 0); // idle frame 0 to start
		this.setScale(Host.SCALE);
		scene.add.existing(this);

		this.mode = 'idle'; // wander loop: 'idle' <-> 'walk', or 'react'
		this.wander();
	}

	//#endregion




	//#region Reactions ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Announce the picked clue — plays until the scene switches,
	// so there's no timer handing control back to the wander loop.
	announce() {
		this.mode = 'announce';
		this.stopMoving();
		this.play('host-announce');
	}


	// Play a 3-second reaction to the player's answer, then go back
	// to wandering the board.
	react(won) {
		this.mode = 'react';
		this.stopMoving();
		this.play(won ? 'host-celebrate' : 'host-cry');
		this.scene.time.delayedCall(
			Host.REACT_MS,
			() => { this.mode = 'idle'; this.wander(); }
		);
	}

	//#endregion




	//#region Wandering ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// The wander loop: stand idle a moment, then walk a short hop
	// toward a random spot. Each leg calls back here for the next.
	// Reactions set mode to 'react'/'announce' — anything that
	// fires in those states is a stale callback and gets ignored.
	wander() {
		if (this.mode !== 'idle' && this.mode !== 'walk') return;
		this.mode = 'idle';
		this.play('host-idle');
		this.idleTimer = this.scene.time.delayedCall(
			Phaser.Math.Between(Host.IDLE_MIN, Host.IDLE_MAX),
			() => this.walkSomewhere()
		);
	}


	// Pick a spot in the middle third-to-third band around the
	// screen center and walk to it; farther hops take longer.
	walkSomewhere() {
		const width = this.scene.scale.width;
		const minX = width / 3 - width / 6; // a third left of center
		const maxX = width * 2 / 3 + width / 6; // a third right
		const targetX = Phaser.Math.Clamp(
			Phaser.Math.Between(minX, maxX),
			minX, maxX
		);

		this.mode = 'walk';
		this.setFlipX(targetX < this.x); // face the way he's walking
		this.play('host-walk');
		this.moveTween = this.scene.tweens.add({
			targets: this,
			x: targetX,
			duration: Math.abs(targetX - this.x) / Host.WALK_SPEED * 1000,
			onComplete: () => this.wander(),
		});
	}


	// Stop any in-progress walk or queued idle pause — reactions
	// interrupt whatever the wander loop was doing. Only removes
	// the host's own timer, not the whole scene's clock.
	stopMoving() {
		if (this.moveTween) {
			this.moveTween.stop();
			this.moveTween = null;
		}
		if (this.idleTimer) {
			this.idleTimer.remove();
			this.idleTimer = null;
		}
	}

	//#endregion




	//#region Internals ////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// Register every row of both sheets as a looped animation.
	// generateFrameNumbers slices a sheet row: start..end frame
	// indexes, so row N is frames N*8 .. N*8+7.
	static defineAnims(scene) {
		if (scene.anims.exists('host-idle')) return; // once per game
		Host.ANIMS.forEach((anim) => {
			scene.anims.create({
				key: anim.key,
				frames: scene.anims.generateFrameNumbers(anim.sheet, {
					start: anim.row * Host.FRAMES_PER_ROW,
					end: anim.row * Host.FRAMES_PER_ROW
						+ Host.FRAMES_PER_ROW - 1,
				}),
				frameRate: 10,
				repeat: -1,
			});
		});
	}

	//#endregion
}
