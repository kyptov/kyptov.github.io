/**
 * Created by kypto on 26.08.2015.
 */
function Build(id) {

	this.id = id;

	return this;
}


Build.prototype.jsonPath = "assets/";

Build.prototype.callback = function() {};

Build.prototype.setPosition = function (x, y) {
	this.position = new PIXI.Point(x, y);
	return this;
};

Build.prototype.setStage = function (stage) {
	this.stage = stage;
	return this;
};

Build.prototype.setCallback = function (callback) {
	this.callback = callback;
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

	this.createModel();

	this.callback.call(this);
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
	build.position = this.position;
	build.play();

	this.stage.addChild(build);

	return this;

};