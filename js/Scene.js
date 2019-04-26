"use strict";

const Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);

  this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured_vs.essl");
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");
  this.texProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured);

  this.fsTexturedCube = new Shader(gl, gl.FRAGMENT_SHADER, "texturedcube_fs.essl");
  this.texCubeProgram = new TexturedProgram(gl, this.vsTextured, this.fsTexturedCube);

  this.vsCubeEnv = new Shader(gl, gl.VERTEX_SHADER, "env_vs.essl");
  this.fsCubeEnv = new Shader(gl, gl.FRAGMENT_SHADER, "env_fs.essl");
  this.envCubeProgram = new TexturedProgram(gl, this.vsCubeEnv, this.fsCubeEnv);

  gl.enable(gl.DEPTH_TEST);

  this.camera = new PerspectiveCamera();

  var texture_a = new Material(gl, this.texProgram);
  texture_a.colorTexture.set(new Texture2D(gl, "slowpoke/YadonDh.png"))
  var texture_b = new Material(gl, this.texProgram);
  texture_b.colorTexture.set(new Texture2D(gl, "slowpoke/YadonEyeDh.png"))
  var materials = [texture_a, texture_b];
  this.multiMesh = new MultiMesh(gl, "slowpoke/Slowpoke.json", materials);
  var slowPoke = new GameObject(this.multiMesh);
  slowPoke.scale.set(new Vec3(0.1,0.1,0.1));

  this.textureCubeMaterial = new Material(gl, this.texCubeProgram);
  this.skyCubeTexture = new
    TextureCube(gl, [
      "media/posx.jpg",
      "media/negx.jpg",
      "media/posy.jpg",
      "media/negy.jpg",
      "media/posz.jpg",
      "media/negz.jpg",]
    );

  this.envCubeMaterial = new Material(gl, this.envCubeProgram);


  this.textureCubeMaterial.envmapTexture.set(this.skyCubeTexture);
  this.meshTextureCube = new MultiMesh(gl, "slowpoke/Slowpoke.json", [this.textureCubeMaterial, this.textureCubeMaterial]);
  var slowpokeTextureCubeGB = new GameObject(this.meshTextureCube);
  slowpokeTextureCubeGB.scale.set(new Vec3(0.1, 0.1, 0.1));
  slowpokeTextureCubeGB.position.set(new Vec3(-1,0,0));

  this.envCubeMaterial.envmapTexture.set(this.skyCubeTexture);
  this.meshEnvCube = new Mesh(new TexturedQuadGeometry(gl), this.envCubeMaterial);
  var envCubeGB = new GameObject(this.meshEnvCube);


  this.gameObjects = [];
  this.gameObjects.push(slowPoke);
  this.gameObjects.push(slowpokeTextureCubeGB);
  this.gameObjects.push(envCubeGB);

  this.timeElapsed = 0.0;
  this.timeAtLastFrame = new Date().getTime();

  Uniforms.lighting.position.at(0).set(0.3,0.3,0.1,0.0);
  Uniforms.lighting.position.at(1).set(0.4, 0.3, 0.1, 0.0);
  Uniforms.lighting.position.at(2).set(0.3, 0.3, 0, 0.0);
  Uniforms.lighting.position.at(3).set(0.4, 0.4, 0.1, 0.0);
  Uniforms.lighting.position.at(4).set(0.2, 0.5, 0.8, 0.0);
  Uniforms.lighting.position.at(5).set(0.3, 1.0, 1.0, 0.0);
  Uniforms.lighting.position.at(6).set(0.6, 0.3, 0.3, 0.0);
  Uniforms.lighting.position.at(7).set(0.5, 1.0, 0.3, 0.0);
  Uniforms.lighting.powerDensity.at(0).set(0.4, 0.4, 0.4, 0);
  Uniforms.lighting.powerDensity.at(1).set(0.2, 0.1, 0.1, 0);
  Uniforms.lighting.powerDensity.at(2).set(0.2, 0.2, 0.2, 0);
  Uniforms.lighting.powerDensity.at(3).set(0.2, 0.1, 1.0, 0);
  Uniforms.lighting.powerDensity.at(4).set(0.5, 0.3, 0.3, 0);
  Uniforms.lighting.powerDensity.at(5).set(0.5, 0.3, 0.5, 0);
  Uniforms.lighting.powerDensity.at(6).set(0.2, 0.3, 0.2, 0);
  Uniforms.lighting.powerDensity.at(7).set(0.2, 0.2, 0.2, 0);
};

Scene.prototype.update = function(gl, keysPressed) {
  //jshint bitwise:false
  //jshint unused:false

  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.timeElapsed += dt;
  Uniforms.camera.rayDirMatrix.set(this.camera.rayDirMatrix);
  Uniforms.matAttribs.shininess.set(15);
  Uniforms.matAttribs.spectralColor.set(1,1,1);
  Uniforms.matAttribs.camPos.set(this.camera.position);

  // var rotMatrix = new Mat4().rotate(0.1);

  // Uniforms.lighting.position.at(0).mul(rotMatrix);

  // clear the screen
  gl.clearColor(0.95, 0.95, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.camera.move(dt, keysPressed);
  // this.camera.move(dt, mouseMove);

  for (var i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].draw(this.camera);
  }
};
