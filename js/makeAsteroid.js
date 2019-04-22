function makeAsteroid(scene, colour) {
  var boundBox = BABYLON.Mesh.CreateSphere("sphere1", 10, 2, scene);
  var material = new BABYLON.StandardMaterial("texture1", scene);
  //material.wireframe = true;
  //material.emissiveColor = new BABYLON.Color3(.2, 0.2, 0.2);
  //material.diffuseColor = new BABYLON.Color4(.2, .2, .2, 0);
  //material.ambientColor = new BABYLON.Color4(.2, 0.2, 0.2, .0);
  //material.specularColor = new BABYLON.Color3(.2, 0.2, 0.2);
  //material.pointsCloud = true;
  //material.alpha = 0.5;

  boundBox.visibility = false;
  boundBox.material = material;

  //var core = BABYLON.Mesh.CreateSphere("sphere1", 2, 0.1, scene);
  var material = new BABYLON.StandardMaterial("texture1", scene);
  //material.ambientColor = new BABYLON.Color3(1, 0.2, 0.7);
  if (colour === undefined)
    colour = new BABYLON.Color3(0.2, 0.2, 0.7)
  material.diffuseColor = colour;

  boundBox.position.z = 10;

  var meshes = [];
  for (var i = 0; i < 8; i++) {
    // get octant
    var x = i % 2 - 0.5;
    var y = Math.floor(i / 2) % 2 - 0.5;
    var z = Math.floor(i / 4) % 2 - 0.5;

    // move closer to core
    x /= 1.5;
    y /= 1.5;
    z /= 1.5;

    // random offset
    x += (Math.random() - 0.5) / 4;
    y += (Math.random() - 0.5) / 4;
    z += (Math.random() - 0.5) / 4;

    // random orientation
    var rx = Math.PI / 2 * Math.random();
    var ry = Math.PI / 2 * Math.random();
    var rz = Math.PI / 2 * Math.random();

    var box = BABYLON.Mesh.CreateBox("box", 1.0, scene);
    box.material = material;
    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    box.rotation.x = rx;
    box.rotation.y = ry;
    box.rotation.z = rz;

    meshes.push(box);
    //box.checkCollisions = true;

    //box.parent = boundBox;

    //box.onCollide = function (m) { console.log('I am colliding with ' + m.id); }
  }

  var newMesh = BABYLON.Mesh.MergeMeshes(meshes, true);
  newMesh.renderingGroupId = 1;
  newMesh.parent = boundBox;


  return { core: boundBox, velocity: new BABYLON.Vector3(), rvelocity: new BABYLON.Vector3(), alive: 1, bound: boundBox, angVel: { x: (Math.random()-.5) / 200, y: (Math.random()-.5) / 200 }};
}