"use strict"; 
const GameObject = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 

  this.modelMatrix = new Mat4(); 
};

GameObject.prototype.updateModelMatrix = function(){ 
  this.modelMatrix = new Mat4().scale(this.scale).rotate(this.orientation).translate(this.position);
};

GameObject.prototype.draw = function(camera){ 
  this.updateModelMatrix();
  Uniforms.gameObject.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  Uniforms.gameObject.modelMatrix.set(this.modelMatrix);
  Uniforms.gameObject.modelMatrixInverse.set(this.modelMatrix.clone().invert());
  this.mesh.draw(); 
};
