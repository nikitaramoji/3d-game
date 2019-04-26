"use strict";
// App constructor
const App = function(canvas, overlay) {
  this.canvas = canvas;
  this.overlay = overlay;

  // obtain WebGL context
  this.gl = canvas.getContext("webgl2", {alpha:false});
  if (this.gl === null) {
    throw new Error("Browser does not support WebGL2");
  }

  // serves as a registry for textures or models being loaded
  this.gl.pendingResources = {};
  // create a simple scene
  this.scene = new Scene(this.gl);

  this.keysPressed = {};
  
  this.resize();
};

// match WebGL rendering resolution and viewport to the canvas size
// if we didn't do this, the pixels would get enlarged
App.prototype.resize = function() {
  this.canvas.width = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;
  this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

  this.scene.camera.setAspectRatio(
    this.canvas.clientWidth /
    this.canvas.clientHeight );
};

App.prototype.registerEventHandlers = function() {
  document.onkeydown = (event) => {
    this.keysPressed[keyboardMap[event.keyCode]] = true;
  };
  document.onkeyup = (event) => {
    this.keysPressed[keyboardMap[event.keyCode]] = false;
  };
  this.canvas.onmousedown = (event) => {
    this.scene.camera.mouseDown();
    //jshint unused:false
  };
  this.canvas.onmousemove = (event) => {
    //jshint unused:false
    this.scene.camera.mouseMove(event);
    event.stopPropagation();
  };
  this.canvas.onmouseout = (event) => {
    //jshint unused:false
  };
  this.canvas.onmouseup = (event) => {
    this.scene.camera.mouseUp();
    //jshint unused:false
  };
  window.addEventListener('resize', () => this.resize() );
  window.requestAnimationFrame( () => this.update() );
};

// animation frame update
App.prototype.update = function() {

  const pendingResourceNames = Object.keys(this.gl.pendingResources);
  if (pendingResourceNames.length === 0) {
    // animate and draw scene
    this.scene.update(this.gl, this.keysPressed);
    this.overlay.innerHTML = "Ready.";
  } else {
    this.overlay.innerHTML = "Loading: " + pendingResourceNames;
  }

  // refresh
  window.requestAnimationFrame( () => this.update() );
};

// entry point from HTML
window.addEventListener('load', function() {
  const canvas = document.getElementById("canvas");
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "WebGL";

  const app = new App(canvas, overlay);
  app.registerEventHandlers();
});