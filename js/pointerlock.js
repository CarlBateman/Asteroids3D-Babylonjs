function setupPointerLock(canvas) {
  //We start without being locked.
  canvas.isLocked = false;

  // On click event, request pointer lock
  //scene.onPointerDown = function (evt) {
  canvas.addEventListener("click", function (evt) {
    //true/false check if we're locked, faster than checking pointerlock on each single click.
    if (!canvas.isLocked) {
      canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    }
  });

  // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
  var pointerlockchange = function () {
    var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;

    // If the user is already locked
    if (!controlEnabled) {
      //camera.detachControl(canvas);
      canvas.isLocked = false;
    } else {
      //camera.attachControl(canvas);
      canvas.isLocked = true;
    }

    //console.log("pointerlockchange", canvas.isLocked);

  };

  // Attach events to the document
  document.addEventListener("pointerlockchange", pointerlockchange, false);
  document.addEventListener("mspointerlockchange", pointerlockchange, false);
  document.addEventListener("mozpointerlockchange", pointerlockchange, false);
  document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}