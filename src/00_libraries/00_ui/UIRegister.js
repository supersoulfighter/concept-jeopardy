// Register the UI components with Phaser's factory and creator, so
// scenes build them from config objects like any built-in object:
//   this.add.uiButton(cfg)              create AND add to the scene
//   this.make.uiButton(cfg)             same — 'add' defaults to true
//   this.make.uiButton({ ..., add: false })  create without adding
// Wrapped in an IIFE so no extra globals leak into the shared scope.
(() => {

	const components = {
		uiLabel: UILabel,
		uiButton: UIButton,
		uiInput: UIInput
	};

	for (const name in components) {
		const Klass = components[name];

		// this.add.* — always adds to the scene's display list
		Phaser.GameObjects.GameObjectFactory.register(
			name,
			function (config) {
				return this.displayList.add(new Klass(this.scene, config));
			}
		);

		// this.make.* — BuildGameObject also reads x, y, scale, alpha,
		// depth, etc. straight from the config, like built-in creators.
		Phaser.GameObjects.GameObjectCreator.register(
			name,
			function (config, addToScene) {
				if (config === undefined) config = {};
				if (addToScene !== undefined) config.add = addToScene;
				const obj = new Klass(this.scene, config);
				Phaser.GameObjects.BuildGameObject(this.scene, obj, config);
				return obj;
			}
		);
	}
})();
