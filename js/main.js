"use strict"
window.addEventListener('DOMContentLoaded', function () {
  // Get the Canvas element from our HTML below
  var canvas = document.getElementById("renderCanvas");
  //canvas.style.height = (canvas.clientHeight - 10) + "px";
  //canvas.style.width = (canvas.clientWidth - 10) + "px";

  // Load BABYLON 3D engine
  var engine = new BABYLON.Engine(canvas, true);
  window.addEventListener('resize', function () {
    engine.resize();
    //canvas.style.height = "99vh";//(canvas.clientHeight - 10) + "px";
    //canvas.style.width = "99vw";//(canvas.clientWidth - 10) + "px";
    //canvas.style.margin = "0";
  });

  var scene = new BABYLON.Scene(engine);

  //// Create a camera looking at the origin (0,0,0)
  //var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, 0), scene);
  ////var camera = new BABYLON.FreeCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -15), scene);
  //camera.angularSensibility *= 4;
  //camera.noRotationConstraint = true;
  //setupCameraControl(camera);


  //camera.attachControl(canvas);
  ////camera.attachControl(scene.getEngine().getRenderingCanvas());

  var camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), scene);
  camera.rollCorrect = 10;
  camera.bankedTurn = true;
  camera.bankedTurnLimit = Math.PI / 2;
  camera.bankedTurnMultiplier = 1;

  //The goal distance of camera from target
  camera.radius = 30;

  // The goal height of camera above local origin (centre) of target
  camera.heightOffset = 10;

  // The goal rotation of camera around local origin (centre) of target in x y plane
  camera.rotationOffset = 0;

  //Acceleration of camera in moving from current to goal position
  camera.cameraAcceleration = 0.005

  //The speed at which acceleration is halted 
  camera.maxCameraSpeed = 10

  //camera.target is set after the target's creation

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);
  var carrier = new BABYLON.Mesh.CreateBox("b", 1, scene);
  carrier.position.z = -150;
  carrier.visibility = false;
  camera.parent = carrier;

  setupPointerLock(canvas);

  var bullets = [];
  canvas.addEventListener("click", function (evt) {
    if (canvas.isLocked) {
      bullets.push(makeBullet(scene, camera));
    }
  }, false);


  // Create a light
  var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
  light0.diffuse = new BABYLON.Color3(1, 1, 1);
  light0.specular = new BABYLON.Color3(1, 1, 1);
  light0.groundColor = new BABYLON.Color3(0, 0, 0);

  // Skybox
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 10.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox1/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;
  skybox.renderingGroupId = 0;

  var asteroids = [];

  var z = -5;
  function settingUp() {
    addAsteroids(z++);
    console.log(z);

    if (z > 5) {
      carrier.position.z = -15;

      scene.unregisterBeforeRender(settingUp);
      scene.registerBeforeRender(game);
    }
  }

  function addAsteroids(z) {
    var b = z / 10 + 0.5;
    var asteroid;

    var scl = 10;
    var off = scl;
    for (var x = -5; x < 5; x++) {
      var r = x / 10 + 0.5;
      for (var y = -5; y < 5; y++) {
        var g = y / 10 + 0.5;
        //for (var z = -5; z < 5; z++) {
        asteroid = makeAsteroid(scene, new BABYLON.Color3(r, g, b));
        //asteroid = makeAsteroid(scene);
        //asteroid.core.getChildren()[0].material.diffuseColor = new BABYLON.Color3(r,g,b);

        asteroid.bound.position.x = off + x * scl;
        asteroid.bound.position.y = off + y * scl;
        asteroid.bound.position.z = -10 + off + z * scl;
        asteroids.push(asteroid);

        //}
      }
    }
  }

  function game() {
    delta = Date.now() - lastTime;
    lastTime = Date.now();

    skybox.position = camera.parent.position;

    for (var i = 0; i < asteroids.length; i++) {
      asteroids[i].core.rotation.x += asteroids[i].angVel.x;
      asteroids[i].core.rotation.y += asteroids[i].angVel.y;
    }

    for (var i = 0; i < bullets.length; i++) {
      if (bullets[i].alive > 0) {
        bullets[i].alive -= delta;
        bullets[i].bullet.position.addInPlace(bullets[i].velocity);

        for (var j = 0; j < asteroids.length; j++) {
          if (asteroids[j].alive) {
            if (bullets[i].bullet.intersectsMesh(asteroids[j].bound, true)) {
              bullets[i].alive = 0;
              bullets[i].bullet.visibility = false;
              asteroids[j].alive = 0;
              asteroids[j].core.setEnabled(false);
            }
          }
        }
      } else {
        bullets[i].bullet.visibility = false;
      }
    }
  }

  var delta = 0;
  var lastTime = Date.now();
  scene.registerBeforeRender(settingUp);


  // Once the scene is loaded, just register a render loop to render it
  engine.runRenderLoop(function () {
    scene.render();
  });
});