function makeBullet(scene, camera) {
  //console.log(camera);
  var bullet = BABYLON.Mesh.CreateSphere("sphere1", 2, 1, scene);
  bullet.renderingGroupId = 1;

  //bullet.checkCollisions = true;

  //bullet.onCollide = function (m) { console.log('I am colliding with ' + m.id); }


  var p1 = new BABYLON.Vector3(0, 0, 1);
  var p2 = BABYLON.Vector3.TransformCoordinates(p1, camera.getWorldMatrix());
  //camera.getFrontPosition(1)
  var d = p2.subtract(camera.parent.position);

  var pos = d.multiplyByFloats(1,1,1);
  bullet.position = camera.parent.position.clone().add(pos);

  var velocity = pos.multiplyByFloats(1,1,1);

  return { bullet: bullet, velocity: velocity, alive: 1000,  };
}