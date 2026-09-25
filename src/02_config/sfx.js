// Sound manifest — Preloader loads every entry listed here.
// Cues come from the "rubber" pack of the uisfx library
// (https://uisfx.com), downloaded into assets/sfx/rubber/.
CJ.SFX = {
	// Widget feedback — wired via sfx configs on UIButton/UIInput
	HOVER:  { key: 'hover',  src: 'assets/sfx/rubber/hover.mp3' },
	PRESS:  { key: 'press',  src: 'assets/sfx/rubber/press.mp3' },
	SELECT: { key: 'select', src: 'assets/sfx/rubber/select.mp3' },
	FOCUS:  { key: 'focus',  src: 'assets/sfx/rubber/focus.mp3' },
	TYPE:   { key: 'typing', src: 'assets/sfx/rubber/typing.mp3' },
	SUBMIT: { key: 'send',   src: 'assets/sfx/rubber/send.mp3' },

	// Game events — played directly via scene.sound.play(...)
	CORRECT:   { key: 'success',     src: 'assets/sfx/rubber/success.mp3' },
	INCORRECT: { key: 'error',       src: 'assets/sfx/rubber/error.mp3' },
	EXPIRED:   { key: 'warning',     src: 'assets/sfx/rubber/warning.mp3' },
	WIN:       { key: 'achievement', src: 'assets/sfx/rubber/achievement.mp3' },
	LOSE:      { key: 'cancel',      src: 'assets/sfx/rubber/cancel.mp3' },
};
