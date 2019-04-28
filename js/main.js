"use strict";
window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById("renderCanvas");
  setupPointerLock(canvas);

  var engine = new BABYLON.Engine(canvas, true);
  var scene = createScene();
  scene.debugLayer.show();

  function createScene() {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), scene);
    camera.rollCorrect = 0;
    camera.bankedTurn = false;
    camera.bankedTurnLimit = Math.PI / 2;
    camera.bankedTurnMultiplier = 1;
    camera.attachControl(canvas, true);


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
    //skyboxMaterial.onCompiled = function () {
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox1/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.renderingGroupId = 0;

    skybox.position = camera.position;
    //};

    var asteroids = [];

    var z = -5;
    function settingUp() {
      addAsteroids(z++);
      console.log(z);

      if (z > 5) {
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
          //asteroid.core.getChildren()[0].material.diffuseColor = new BABYLON.Color3(r,g,b);

          asteroid.bound.position.x = off + x * scl;
          asteroid.bound.position.y = off + y * scl;
          asteroid.bound.position.z = -10 + off + z * scl;
          asteroids.push(asteroid);

          //}
        }
      }
    }

    scene.registerBeforeRender(settingUp);


    function game() {
      delta = Date.now() - lastTime;
      lastTime = Date.now();

      skybox.position = camera.position;

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

    // Once the scene is loaded, just register a render loop to render it
    engine.runRenderLoop(function () {
      scene.render();
    });


    window.addEventListener('resize', function () {
      engine.resize();
    });

    return scene;
  }



});