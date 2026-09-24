// Clue / Question Database
const GAME_DATA = [
	{
		category: "JAVASCRIPT",
		clues: [
			{ weight: 1, answer: "The framework this game is built on.", question: "What is Phaser?" },
			{ weight: 2, answer: "Keyword used to declare a block-scoped variable.", question: "What is let (or const)?" },
			{ weight: 1, answer: "The punctuation that ends most JavaScript statements.", question: "What is a semicolon?" },
			{ weight: 2, answer: "Curly braces group code into one of these.", question: "What is a block?" },
			{ weight: 3, answer: "The method that prints messages to the developer console.", question: "What is console.log()?" },
			{ weight: 3, answer: "The operator that joins two strings together.", question: "What is + (concatenation)?" },
			{ weight: 4, answer: "true or false — the type named after mathematician George Boole.", question: "What is a boolean?" },
			{ weight: 4, answer: "The value of a variable that's been declared but never assigned.", question: "What is undefined?" },
			{ weight: 5, answer: "The structure that stores key-value pairs, like player.name.", question: "What is an object?" },
			{ weight: 5, answer: "JSON stands for JavaScript Object this.", question: "What is Notation?" }
		]
	},
	{
		category: "GAMING",
		clues: [
			{ weight: 1, answer: "Nintendo's famous Italian plumber.", question: "Who is Mario?" },
			{ weight: 2, answer: "The blocky sandbox game acquired by Microsoft.", question: "What is Minecraft?" },
			{ weight: 1, answer: "The yellow circle that eats dots and dodges ghosts.", question: "Who is Pac-Man?" },
			{ weight: 2, answer: "Mario's taller, greener brother.", question: "Who is Luigi?" },
			{ weight: 3, answer: "The battle royale famous for building forts and dance emotes.", question: "What is Fortnite?" },
			{ weight: 3, answer: "The franchise where you catch creatures to be the very best.", question: "What is Pokémon?" },
			{ weight: 4, answer: "The 1972 table-tennis arcade game that started it all.", question: "What is Pong?" },
			{ weight: 4, answer: "Sega's speedy blue mascot.", question: "Who is Sonic the Hedgehog?" },
			{ weight: 5, answer: "The falling-block puzzle game invented in Soviet Russia.", question: "What is Tetris?" },
			{ weight: 5, answer: "The green-tunic hero of Hyrule — not the princess it's named after.", question: "Who is Link?" },
			{ weight: 1, answer: "The princess Mario keeps rescuing.", question: "Who is Princess Peach?" },
			{ weight: 1, answer: "The green dinosaur Mario rides.", question: "Who is Yoshi?" },
			{ weight: 1, answer: "The golden rings Sonic collects.", question: "What are rings?" },
			{ weight: 1, answer: "The company behind the PlayStation.", question: "What is Sony?" },
			{ weight: 2, answer: "The princess Link's games are named after.", question: "Who is Zelda?" },
			{ weight: 2, answer: "Pac-Man's fourth ghost, alongside Blinky, Pinky, and Inky.", question: "Who is Clyde?" },
			{ weight: 2, answer: "Minecraft's exploding green creature.", question: "What is a creeper?" },
			{ weight: 2, answer: "The two-word title for winning a Fortnite match.", question: "What is a Victory Royale?" },
			{ weight: 3, answer: "The 1985 NES launch title credited with saving the game industry.", question: "What is Super Mario Bros.?" },
			{ weight: 3, answer: "The arcade shooter where you blast rocks into smaller rocks.", question: "What is Asteroids?" },
			{ weight: 3, answer: "The ape who threw barrels at Mario in his 1981 debut.", question: "Who is Donkey Kong?" },
			{ weight: 3, answer: "The racing series where blue shells ruin friendships.", question: "What is Mario Kart?" },
			{ weight: 4, answer: "The 1997 PlayStation RPG whose hero carries a giant buster sword.", question: "What is Final Fantasy VII?" },
			{ weight: 4, answer: "The pink puffball who copies enemies' powers by inhaling them.", question: "Who is Kirby?" },
			{ weight: 4, answer: "Sonic's fox sidekick with two tails.", question: "Who is Tails?" },
			{ weight: 4, answer: "The 1993 id Software shooter that popularized first-person games.", question: "What is Doom?" },
			{ weight: 5, answer: "The 1980 arcade game with a famous kill screen at level 256.", question: "What is Pac-Man?" },
			{ weight: 5, answer: "The Metroid hero revealed to be a woman in the 1986 ending.", question: "Who is Samus Aran?" },
			{ weight: 5, answer: "The Soviet mathematician who invented Tetris in 1984.", question: "Who is Alexey Pajitnov?" },
			{ weight: 5, answer: "The 1978 arcade shooter rumored to have caused a coin shortage in Japan.", question: "What is Space Invaders?" }
		]
	},
	{
		category: "ENGINEERING",
		clues: [
			{ weight: 1, answer: "The grammar rules that decide whether your code can run at all.", question: "What is syntax?" },
			{ weight: 2, answer: "A value written directly into code, like 42 or \"game over\".", question: "What is a literal?" },
			{ weight: 3, answer: "Number, string, boolean — the kind of thing a value is.", question: "What is a data type?" },
			{ weight: 4, answer: "An ordered list of values you reach by index, like inventory[0].", question: "What is an array?" },
			{ weight: 5, answer: "Where a game stores saves and high scores for the long term.", question: "What is a database?" },
			{ weight: 1, answer: "A named container that holds a value while the program runs.", question: "What is a variable?" },
			{ weight: 2, answer: "The name you give to a variable or function.", question: "What is an identifier?" },
			{ weight: 3, answer: "Reserved words like if, for, and return that you can't use as names.", question: "What are keywords?" },
			{ weight: 4, answer: "A complete instruction, like score = 100.", question: "What is a statement?" },
			{ weight: 5, answer: "Code that evaluates down to a value, like 2 + 3.", question: "What is an expression?" },
			{ weight: 1, answer: "Symbols like +, -, and === that do work on values.", question: "What are operators?" },
			{ weight: 2, answer: "A reusable block of code you call by name.", question: "What is a function?" },
			{ weight: 3, answer: "The inputs you hand to a function when you call it.", question: "What are parameters (arguments)?" },
			{ weight: 4, answer: "Repeats a block of code for every item or until a condition changes.", question: "What is a loop?" },
			{ weight: 5, answer: "if / else — code that only runs when something is true.", question: "What is a conditional?" }
		]
	},
	{
		category: "ENGINE SYSTEMS",
		clues: [
			{ weight: 1, answer: "The engine's name for a 'thing' in the world — player, enemy, or coin.", question: "What is an entity (game object)?" },
			{ weight: 2, answer: "Linking a sword to a character's hand so it follows along.", question: "What is parenting (a hierarchy)?" },
			{ weight: 3, answer: "An object's position, rotation, and scale.", question: "What is a transform?" },
			{ weight: 4, answer: "The system that makes objects fall, collide, and bounce.", question: "What is physics?" },
			{ weight: 5, answer: "The system that draws everything on screen each frame.", question: "What is the renderer?" },
			{ weight: 1, answer: "Sparks, smoke, and explosions made of many tiny sprites.", question: "What are particle effects (PFX)?" },
			{ weight: 2, answer: "The code that decides what happens when a player touches a coin.", question: "What is gameplay logic (scripting)?" },
			{ weight: 3, answer: "The system that decides how enemies chase or flee the player.", question: "What is AI?" },
			{ weight: 4, answer: "Health bars, menus, and score counters drawn on top of the game.", question: "What is the UI?" },
			{ weight: 5, answer: "Keyboard, mouse, gamepad — the system that reads them all.", question: "What is input?" },
			{ weight: 1, answer: "The system that plays a character's walk cycle.", question: "What is animation?" }
		]
	},
	{
		category: "GAME DESIGN",
		clues: [
			{ weight: 1, answer: "A rule of play, like double-jumping or collecting coins.", question: "What is a mechanic?" },
			{ weight: 2, answer: "A pickup that temporarily makes you stronger.", question: "What is a power-up?" },
			{ weight: 3, answer: "The rhythm of challenge and rest that keeps players hooked.", question: "What is pacing?" },
			{ weight: 4, answer: "Repetitive play to gain levels or loot — fun or tedious by design.", question: "What is grinding?" },
			{ weight: 5, answer: "A big enemy that gates the end of a level or quest.", question: "What is a boss?" },
			{ weight: 1, answer: "Small real-money purchases inside a free game.", question: "What are microtransactions?" },
			{ weight: 2, answer: "A small game inside the big one, like a lock-picking challenge.", question: "What is a mini-game?" },
			{ weight: 3, answer: "Tuning so no weapon or strategy is unfairly strong.", question: "What is balance?" },
			{ weight: 4, answer: "How gold, gems, and rewards flow through a game.", question: "What is the game economy?" },
			{ weight: 5, answer: "The sequence of events the player experiences.", question: "What is the plot (narrative)?" },
			{ weight: 1, answer: "The heroes, villains, and NPCs that populate the world.", question: "What are characters?" },
			{ weight: 2, answer: "The lines characters speak to each other.", question: "What is dialogue?" },
			{ weight: 3, answer: "RPG, horror, platformer — labels that set player expectations.", question: "What is a genre?" },
			{ weight: 4, answer: "The world's backstory, even the parts never said out loud.", question: "What is lore?" }
		]
	},
	{
		category: "UI/UX",
		clues: [
			{ weight: 1, answer: "Designing around how real humans see, think, and tap.", question: "What are human factors?" },
			{ weight: 2, answer: "The mental effort a screen demands — good UI keeps it low.", question: "What is cognitive load?" },
			{ weight: 3, answer: "Menus work because players recognize options instead of recalling them.", question: "What is recognition over recall?" },
			{ weight: 4, answer: "The buttons and frames are the UI; the art and text inside are this.", question: "What is content?" },
			{ weight: 5, answer: "Arranging elements so the eye finds the important thing first.", question: "What is visual hierarchy?" },
			{ weight: 1, answer: "The art of choosing and styling fonts.", question: "What is typography?" },
			{ weight: 2, answer: "Teaching new players the controls without a manual.", question: "What is onboarding (a tutorial)?" },
			{ weight: 3, answer: "Red for danger, green for go — signaling meaning through this.", question: "What is color coding?" },
			{ weight: 4, answer: "Watching a new player fumble through your menu to find problems.", question: "What is usability testing?" },
			{ weight: 5, answer: "The path a player takes from title screen to gameplay.", question: "What is the user flow?" }
		]
	},
	{
		category: "ART",
		clues: [
			{ weight: 1, answer: "Making the hero bright against a dark background so they pop.", question: "What is contrast?" },
			{ weight: 2, answer: "The 3D shape of an object — cube, sphere, or something organic.", question: "What is form?" },
			{ weight: 3, answer: "Hue, saturation, and brightness — the palette of the scene.", question: "What is color?" },
			{ weight: 4, answer: "Placing related things close together so they read as one unit.", question: "What is grouping?" },
			{ weight: 5, answer: "Repeating shapes or motifs, like bricks on a castle wall.", question: "What are patterns?" },
			{ weight: 1, answer: "Making the most important thing the biggest or brightest.", question: "What is visual hierarchy?" },
			{ weight: 2, answer: "Background layers scrolling slower than the foreground.", question: "What is parallax?" },
			{ weight: 3, answer: "Shadows and highlights that give flat objects volume.", question: "What is shading (light and shade)?" },
			{ weight: 4, answer: "Getting the head-to-body ratio right on a character.", question: "What is proportion (anatomy)?" },
			{ weight: 5, answer: "Arranging everything in the frame to guide the eye.", question: "What is composition?" },
			{ weight: 1, answer: "The polish pass that turns a sketch into finished art.", question: "What is rendering?" },
			{ weight: 2, answer: "Drawing the same character ten times to get it right.", question: "What is iteration?" },
			{ weight: 3, answer: "Pixel art, watercolor, 3D models — the material art is made in.", question: "What is a medium?" },
			{ weight: 4, answer: "The consistent look of a game — cartoon, realistic, pixel-art.", question: "What is art style?" },
			{ weight: 5, answer: "Early sketches that explore what a character could look like.", question: "What is concept art?" },
			{ weight: 1, answer: "The surface image wrapped onto a 3D model.", question: "What is a texture?" },
			{ weight: 2, answer: "Explosions and magic sparkles drawn as effects.", question: "What is VFX?" },
			{ weight: 3, answer: "Sprites are flat; models have depth — this is the difference.", question: "What is 2D vs 3D?" },
			{ weight: 4, answer: "Art made of math curves that scales without getting blurry.", question: "What is vector art?" },
			{ weight: 5, answer: "Art made of pixels, like a photo.", question: "What is raster art?" },
			{ weight: 1, answer: "The important poses; the computer fills in the frames between.", question: "What are keyframes?" },
			{ weight: 2, answer: "Giving a character a skeleton so it can bend and move.", question: "What is rigging?" },
			{ weight: 3, answer: "The path art takes from the artist's tool into the game engine.", question: "What is an asset pipeline?" }
		]
	},
	{
		category: "AUDIO",
		clues: [
			{ weight: 1, answer: "What sound physically is — vibrations changing air pressure.", question: "What is sound?" },
			{ weight: 2, answer: "The distance for one full wave cycle — inversely related to frequency.", question: "What is wavelength?" },
			{ weight: 3, answer: "The height of a wave, which we hear as loudness (dB).", question: "What is amplitude?" },
			{ weight: 4, answer: "Beats per minute — speed it up to raise tension.", question: "What is tempo?" },
			{ weight: 5, answer: "Major sounds happy, minor sounds spooky — this choice sets the mood.", question: "What is a key signature?" },
			{ weight: 1, answer: "The 'color' of a sound — warm cello vs. crunchy synth.", question: "What is timbre?" },
			{ weight: 2, answer: "A room amplifying certain frequencies, like singing in the shower.", question: "What is resonance?" },
			{ weight: 3, answer: "A siren's pitch dropping as it passes you.", question: "What is the Doppler effect?" },
			{ weight: 4, answer: "Two waves combining to cancel each other out.", question: "What is phase cancellation?" },
			{ weight: 5, answer: "Unwanted hiss or rumble in a recording.", question: "What is noise?" }
		]
	},
	{
		category: "COMPOSITION",
		clues: [
			{ weight: 1, answer: "A recurring theme for a character — like Darth Vader's march.", question: "What is a leitmotif?" },
			{ weight: 2, answer: "A track that repeats forever with no audible seam.", question: "What is a seamless loop?" },
			{ weight: 3, answer: "Music that changes in real time when combat starts.", question: "What is adaptive (interactive) music?" },
			{ weight: 4, answer: "Writing a loop that stays pleasant after fifty hours of play.", question: "What is anti-fatigue design (loop endurance)?" },
			{ weight: 5, answer: "A short musical hit that punctuates finding an item.", question: "What is a stinger?" },
			{ weight: 1, answer: "Replaying the hero's theme slower and sadder after a plot twist.", question: "What is motivic development?" },
			{ weight: 2, answer: "The hummable main tune of a game.", question: "What is the melody (theme)?" },
			{ weight: 3, answer: "Choosing instruments — strings for sadness, chiptune for retro.", question: "What is instrumentation?" },
			{ weight: 4, answer: "The chords under the melody that set the mood.", question: "What is harmony?" },
			{ weight: 5, answer: "Cutting all music right before a jump scare.", question: "What is a sudden rest (silence as a tool)?" }
		]
	},
	{
		category: "SOUND DESIGN",
		clues: [
			{ weight: 1, answer: "Judging a sound by its waveform shape on screen.", question: "What is reading a waveform?" },
			{ weight: 2, answer: "Balancing levels so footsteps don't drown the dialogue.", question: "What is mixing?" },
			{ weight: 3, answer: "Attack, Decay, Sustain, Release — a sound's volume over time.", question: "What is an ADSR envelope?" },
			{ weight: 4, answer: "Panning and distance filtering so players hear where a sound is.", question: "What is spatialization?" },
			{ weight: 5, answer: "Recording real objects — like snapping celery for breaking bones.", question: "What is Foley?" },
			{ weight: 1, answer: "Carving out clashing frequencies so the mix isn't muddy.", question: "What is EQ (frequency carving)?" },
			{ weight: 2, answer: "Keeping quiet and loud parts balanced without clipping.", question: "What is normalization (dynamic range)?" },
			{ weight: 3, answer: "The satisfying 'ding' that confirms a button press.", question: "What is audio feedback?" },
			{ weight: 4, answer: "Building a laser blast by stacking a synth zap on a real whip crack.", question: "What is layering?" },
			{ weight: 5, answer: "The stock collection of effects every designer starts with — and shouldn't rely on.", question: "What is a sound library?" }
		]
	},
	{
		category: "PRODUCING",
		clues: [
			{ weight: 1, answer: "The three constraints every producer juggles.", question: "What are time, scope, and budget?" },
			{ weight: 2, answer: "A to-do / doing / done board that keeps the team honest.", question: "What is task tracking?" },
			{ weight: 3, answer: "The prioritized list of everything the team might build.", question: "What is the product backlog?" },
			{ weight: 4, answer: "The calendar of milestones leading to launch.", question: "What is the release schedule?" },
			{ weight: 5, answer: "Deciding who works on what, and when.", question: "What is resource allocation?" },
			{ weight: 1, answer: "The person who keeps the whole project on schedule.", question: "Who is the producer?" },
			{ weight: 2, answer: "The short daily meeting where everyone says what they're doing.", question: "What is a stand-up?" },
			{ weight: 3, answer: "A playable chunk of the game shown to prove progress.", question: "What is a milestone?" },
			{ weight: 4, answer: "When 'just one more feature' blows up the schedule.", question: "What is scope creep?" },
			{ weight: 5, answer: "The final build sent off for certification.", question: "What is the gold master (release candidate)?" }
		]
	},
	{
		category: "PRODUCT MGMT",
		clues: [
			{ weight: 1, answer: "Daily Active Users — how many people play each day.", question: "What is DAU?" },
			{ weight: 2, answer: "Players who quit and don't come back.", question: "What is churn?" },
			{ weight: 3, answer: "Players who come back after their first session.", question: "What is retention?" },
			{ weight: 4, answer: "How the game makes money — ads, IAP, subscriptions.", question: "What is monetization?" },
			{ weight: 5, answer: "Data the game sends home about how people actually play.", question: "What is telemetry?" },
			{ weight: 1, answer: "Tracking costs against revenue to keep the studio alive.", question: "What is finance?" },
			{ weight: 2, answer: "The plan for launching the game into the market.", question: "What is a go-to-market strategy?" },
			{ weight: 3, answer: "Monthly Active Users — DAU's bigger sibling.", question: "What is MAU?" },
			{ weight: 4, answer: "Free-to-play, premium, or subscription — choosing the price tag.", question: "What is pricing?" },
			{ weight: 5, answer: "The document describing who the game is for and why they'll buy it.", question: "What is the product vision?" }
		]
	},
	{
		category: "MARKETING",
		clues: [
			{ weight: 1, answer: "A coordinated push of ads and posts around launch.", question: "What is a campaign?" },
			{ weight: 2, answer: "Groups of players with shared traits you target differently.", question: "What are segments?" },
			{ weight: 3, answer: "Your whole game explained in thirty seconds.", question: "What is an elevator pitch?" },
			{ weight: 4, answer: "Videos that show off gameplay — or the making-of journey.", question: "What are trailers and devlogs?" },
			{ weight: 5, answer: "Discord, Reddit, TikTok — where player communities form.", question: "What are forums and social media?" },
			{ weight: 1, answer: "The logo, title art, and store banner that identify the game.", question: "What is key art (branding)?" },
			{ weight: 2, answer: "A catchy one-liner like 'Minecraft meets horror.'", question: "What is a tagline?" },
			{ weight: 3, answer: "Getting a YouTuber to play your game for their audience.", question: "What is influencer marketing?" },
			{ weight: 4, answer: "The screenshots, description, and tags that sell the game on a store.", question: "What is the store listing?" },
			{ weight: 5, answer: "The Steam metric that predicts launch sales.", question: "What are wishlists?" }
		]
	},
	{
		category: "SALES",
		clues: [
			{ weight: 1, answer: "Researching which publishers or partners to approach.", question: "What is prospecting?" },
			{ weight: 2, answer: "Listening first, then showing how your game solves their problem.", question: "What is value-based pitching?" },
			{ weight: 3, answer: "Answering 'it's too expensive' without panicking.", question: "What is handling objections?" },
			{ weight: 4, answer: "The polite follow-up email you send for the third time.", question: "What is hustle (following up)?" },
			{ weight: 5, answer: "Awareness to consideration to purchase — the journey to a sale.", question: "What is the sales funnel (pipeline)?" },
			{ weight: 1, answer: "The first email to a publisher who's never heard of you.", question: "What is cold outreach?" },
			{ weight: 2, answer: "The short slide deck that sells your game to a publisher.", question: "What is a pitch deck?" },
			{ weight: 3, answer: "When a publisher says 'we'll fund it if you add multiplayer.'", question: "What is negotiation?" },
			{ weight: 4, answer: "The signed agreement splitting revenue between you and the publisher.", question: "What is the contract (deal)?" },
			{ weight: 5, answer: "A player who loves the game so much they recruit their friends.", question: "What is an advocate (word of mouth)?" }
		]
	},
	{
		category: "QA",
		clues: [
			{ weight: 1, answer: "The dev team playing their own build to catch bugs early.", question: "What is internal testing?" },
			{ weight: 2, answer: "Steps to reproduce, expected vs actual — a good one of these.", question: "What is a bug report?" },
			{ weight: 3, answer: "Code that tests code, run automatically on every build.", question: "What are unit tests (automation)?" },
			{ weight: 4, answer: "Watching real players struggle in a usability lab.", question: "What is external testing (playtesting)?" },
			{ weight: 5, answer: "Helping players after launch — tickets, patches, refunds.", question: "What is player support?" },
			{ weight: 1, answer: "Playing the game freely just to see what breaks.", question: "What is exploratory testing?" },
			{ weight: 2, answer: "A bug so bad it crashes the game — highest priority.", question: "What is a blocker (critical bug)?" },
			{ weight: 3, answer: "A group of target players giving feedback before launch.", question: "What is a focus group?" },
			{ weight: 4, answer: "Showing two versions of a feature to see which players prefer.", question: "What is A/B (multivariate) testing?" },
			{ weight: 5, answer: "The hardware and OS details attached to every bug report.", question: "What are system specs?" }
		]
	},
	{
		category: "ENGINEERING II",
		clues: [
			{ weight: 1, answer: "Cutscenes and scripted sequences that play between gameplay.", question: "What are cinematics?" },
			{ weight: 2, answer: "Loading and unloading textures so the game doesn't run out of memory.", question: "What is asset management?" },
			{ weight: 3, answer: "Turning game state into saveable data, like a save file.", question: "What is serialization?" },
			{ weight: 4, answer: "Hunting down why the game crashes on level 3.", question: "What is debugging?" },
			{ weight: 5, answer: "Measuring which code is slow instead of guessing.", question: "What is profiling?" },
			{ weight: 1, answer: "Syncing players' positions over the internet.", question: "What is networking (multiplayer)?" },
			{ weight: 2, answer: "Running work on multiple CPU cores at once.", question: "What is threading?" },
			{ weight: 3, answer: "Freeing what you no longer use so the game doesn't leak.", question: "What is memory management?" },
			{ weight: 4, answer: "Where in code a variable's name is visible.", question: "What is scope?" },
			{ weight: 5, answer: "The update-then-render cycle that runs every frame.", question: "What is the game loop?" },
			{ weight: 1, answer: "A blueprint for objects — Enemy is one, each goblin an instance.", question: "What is a class?" },
			{ weight: 2, answer: "Bundling data and behavior together into objects.", question: "What is OOP?" },
			{ weight: 3, answer: "Don't Repeat Yourself.", question: "What is DRY?" },
			{ weight: 4, answer: "Keep It Simple, Stupid.", question: "What is KISS?" },
			{ weight: 5, answer: "You Aren't Gonna Need It — don't build features early.", question: "What is YAGNI?" },
			{ weight: 1, answer: "Building software from small reusable pieces — functions, packages, APIs.", question: "What is modularity?" },
			{ weight: 2, answer: "A contract that lets two systems talk without knowing each other's internals.", question: "What is an API?" },
			{ weight: 3, answer: "Version control — time travel for your code.", question: "What is Git?" },
			{ weight: 4, answer: "A step-by-step recipe for solving a problem, like sorting.", question: "What is an algorithm?" },
			{ weight: 5, answer: "A function that calls itself.", question: "What is recursion?" },
			{ weight: 1, answer: "Translating code ahead of time vs. line-by-line at runtime.", question: "What is compiling vs. interpreting?" }
		]
	}
];