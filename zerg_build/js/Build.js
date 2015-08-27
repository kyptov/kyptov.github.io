/**
 * Created by kypto on 26.08.2015.
 */
function Build(id) {

	/**
	 * ??????
	 * @type {PIXI.WebGLRenderer}
	 */
	this.render = PIXI.autoDetectRenderer(200, 200, {transparent: true});

	this.id = id;

	return this;
}


Build.prototype.jsonPath = "assets/";

Build.prototype.playable = true;

Build.prototype.attachOnLoad = true;

Build.prototype.$parent = null;

Build.prototype.callback = function() {};

Build.prototype.setCallback = function (callback) {
	this.callback = callback;
	return this;
};

Build.prototype.setParent = function ($parent) {
	this.$parent = $parent;
	return this;
};

Build.prototype.append = function () {
	this.$parent.append(this.render.view);
	return this;
};

Build.prototype.load = function () {

	var name = this.jsonPath + this.id + ".json";

	if (PIXI.loader.resources[name]) {
		this.loaded();
		return;
	}

	PIXI.loader.add(name);

	var self = this;

	PIXI.loader.once("complete", function () {
		self.loaded();
	});

	PIXI.loader.load();

	return this;
};

Build.prototype.loaded = function () {

	/**
	 * ?????
	 * @type {PIXI.Container}
	 */
	this.stage = new PIXI.Container();

	this.createModel();

	if (this.attachOnLoad && this.$parent) {
		this.append().play();
	}

	this.callback();
};

Build.prototype.animate = function () {

	if (!this.playable) {
		return;
	}

	var self = this;
	requestAnimationFrame(function () {
		self.animate();
	});

	this.render.render(this.stage);


};

Build.prototype.play = function () {
	this.playable = true;
	this.animate();
	return this;
};

Build.prototype.pause = function () {
	this.playable = false;
	return this;
};

Build.prototype.createModel = function () {

	var textures = [];

	for (var i = 1; i < 40; i++) {
		var frameId = (i < 10 ? "0" + i : "" + i) + ".png";
		textures.push(PIXI.Texture.fromFrame(frameId));
	}

	var build = new PIXI.extras.MovieClip(textures);

	build.animationSpeed = 0.4;
	build.anchor.set(0.5, 0.5);
	build.position.set(100, 100);
	/*build.loop = false;
	build.onComplete = function() {
		setTimeout(function () {
			console.log(build.playing);
			build.play()
		}, 200);
	};*/
	build.play();


	this.stage.addChild(build);

	return this;

};