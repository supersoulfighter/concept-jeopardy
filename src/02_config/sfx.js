// Sound manifest — Preloader loads every entry listed here.
// Cues come from the "rubber" pack of the uisfx library (https://uisfx.com)
CJ.SFX = {
	// Widget feedback — wired via sfx configs on UIButton/UIInput
	HOVER:  { key: 'hover',  src: 'assets/sounds/sfx/rubber/hover.mp3' },
	PRESS:  { key: 'press',  src: 'assets/sounds/sfx/rubber/press.mp3' },
	SELECT: { key: 'select', src: 'assets/sounds/sfx/rubber/select.mp3' },
	FOCUS:  { key: 'focus',  src: 'assets/sounds/sfx/rubber/focus.mp3' },
	TYPE:   { key: 'typing', src: 'assets/sounds/sfx/rubber/typing.mp3' },
	SUBMIT: { key: 'send',   src: 'assets/sounds/sfx/rubber/send.mp3' },

	// Game events — played directly via scene.sound.play(...)
	CLUE:      { key: 'clue',        src: 'assets/sounds/sfx/jeopardy/clip-jeopardy-theme.mp3' },
	THEME:     { key: 'theme',       src: 'assets/sounds/sfx/jeopardy/jeopardy-50-secs.mp3' },
	CORRECT:   { key: 'success',     src: 'assets/sounds/sfx/jeopardy/yes-jeopardy-right-answer.mp3' },
	INCORRECT: { key: 'error',       src: 'assets/sounds/sfx/jeopardy/jeopardy-incorrect-answer.mp3' },
	EXPIRED:   { key: 'warning',     src: 'assets/sounds/sfx/jeopardy/snd-time-s-up-jeopardy.mp3' },
	WIN:       { key: 'achievement', src: 'assets/sounds/sfx/jeopardy/jeopardy-outro-no-talking.mp3' },
	LOSE:      { key: 'cancel',      src: 'assets/sounds/sfx/jeopardy/jeopardy-stinger-swedish-version.mp3' },
};
