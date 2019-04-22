/* This doesn't use a parent object for the camera,
** but the view jumps by 180° when the view tries to pass 90°
*/

function setupCameraControl(camera) {
  // Let's remove default keyboard:
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput");

  // Create our own manager:
  var FreeCameraKeyboardRotateInput = function () {
    this._keys = [];
    this.keysLeft = [37];
    this.keysUp = [38];
    this.keysRight = [39];
    this.keysDown = [40];
    this.keysSpace = [32];
    this.sensibility = 0.01;
  }

  // Hooking keyboard events
  FreeCameraKeyboardRotateInput.prototype.attachControl = function (element, noPreventDefault) {
    var _this = this;
    if (!this._onKeyDown) {
      element.tabIndex = 1;
      this._onKeyDown = function (evt) {
        if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            _this.keysRight.indexOf(evt.keyCode) !== -1 ||
            _this.keysUp.indexOf(evt.keyCode) !== -1 ||
            _this.keysDown.indexOf(evt.keyCode) !== -1 ||
            _this.keysSpace.indexOf(evt.keyCode) !== -1) {
          var index = _this._keys.indexOf(evt.keyCode);
          if (index === -1) {
            _this._keys.push(evt.keyCode);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };
      this._onKeyUp = function (evt) {
        if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
            _this.keysRight.indexOf(evt.keyCode) !== -1 ||
            _this.keysUp.indexOf(evt.keyCode) !== -1 ||
            _this.keysDown.indexOf(evt.keyCode) !== -1 ||
            _this.keysSpace.indexOf(evt.keyCode) !== -1) {
          var index = _this._keys.indexOf(evt.keyCode);
          if (index >= 0) {
            _this._keys.splice(index, 1);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      };

      element.addEventListener("keydown", this._onKeyDown, false);
      element.addEventListener("keyup", this._onKeyUp, false);
      BABYLON.Tools.RegisterTopRootEvents([
          { name: "blur", handler: this._onLostFocus }
      ]);
    }
  };

  // Unhook
  FreeCameraKeyboardRotateInput.prototype.detachControl = function (element) {
    if (this._onKeyDown) {
      element.removeEventListener("keydown", this._onKeyDown);
      element.removeEventListener("keyup", this._onKeyUp);
      BABYLON.Tools.UnregisterTopRootEvents([
          { name: "blur", handler: this._onLostFocus }
      ]);
      this._keys = [];
      this._onKeyDown = null;
      this._onKeyUp = null;
    }
  };

  // This function is called by the system on every frame
  FreeCameraKeyboardRotateInput.prototype.checkInputs = function () {
    if (this._onKeyDown) {
      var camera = this.camera;
      // Keyboard
      for (var index = 0; index < this._keys.length; index++) {
        var keyCode = this._keys[index];
        if (this.keysLeft.indexOf(keyCode) !== -1) {
          camera.cameraRotation.y -= this.sensibility;
          //camera.parent.rotate(BABYLON.Axis.Y, -this.sensibility, BABYLON.Space.LOCAL);
        }
        else if (this.keysRight.indexOf(keyCode) !== -1) {
          camera.cameraRotation.y += this.sensibility;
          //camera.parent.rotate(BABYLON.Axis.Y, this.sensibility, BABYLON.Space.LOCAL);
        }
        else if (this.keysUp.indexOf(keyCode) !== -1) {
          camera.cameraRotation.x -= this.sensibility;
          //camera.parent.rotate(BABYLON.Axis.X, -this.sensibility, BABYLON.Space.LOCAL);
        }
        else if (this.keysDown.indexOf(keyCode) !== -1) {
          camera.cameraRotation.x += this.sensibility;
          //camera.parent.rotate(BABYLON.Axis.X, this.sensibility, BABYLON.Space.LOCAL);
        }
        else if (this.keysSpace.indexOf(keyCode) !== -1) {
          var p1 = new BABYLON.Vector3(0, 0, 0.1);
          var p2 = BABYLON.Vector3.TransformCoordinates(p1, camera.getWorldMatrix());
          var d = p2.subtract(camera.parent.position);
          camera.parent.position.addInPlace(d);
        }
      }
    }
  };
  FreeCameraKeyboardRotateInput.prototype.getTypeName = function () {
    return "FreeCameraKeyboardRotateInput";
  };
  FreeCameraKeyboardRotateInput.prototype._onLostFocus = function (e) {
    this._keys = [];
  };
  FreeCameraKeyboardRotateInput.prototype.getSimpleName = function () {
    return "keyboardRotate";
  };

  // Connect to camera:
  camera.inputs.add(new FreeCameraKeyboardRotateInput());






  //camera.inputs.removeByType("FreeCameraMouseInput");


  //function FreeCameraMouseRotateInput(touchEnabled) {
  //  if (touchEnabled === void 0) { touchEnabled = true; }
  //  this.touchEnabled = touchEnabled;
  //  this.buttons = [0, 1, 2];
  //  this.sensibility = 1000;
  //}

  //FreeCameraMouseRotateInput.prototype.attachControl = function (element, noPreventDefault) {
  //  var _this = this;
  //  var engine = this.camera.getEngine();
  //  if (!this._pointerInput) {
  //    this._pointerInput = function (p, s) {
  //      var evt = p.event;
  //      if (!_this.touchEnabled && evt.pointerType === "touch") {
  //        return;
  //      }
  //      if (p.type !== BABYLON.PointerEventTypes.POINTERMOVE && _this.buttons.indexOf(evt.button) === -1) {
  //        return;
  //      }
  //      if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
  //        try {
  //          evt.srcElement.setPointerCapture(evt.pointerId);
  //        }
  //        catch (e) {
  //        }
  //        _this.previousPosition = {
  //          x: evt.clientX,
  //          y: evt.clientY
  //        };
  //        if (!noPreventDefault) {
  //          evt.preventDefault();
  //          element.focus();
  //        }
  //      }
  //      else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
  //        try {
  //          evt.srcElement.releasePointerCapture(evt.pointerId);
  //        }
  //        catch (e) {
  //        }
  //        _this.previousPosition = null;
  //        if (!noPreventDefault) {
  //          evt.preventDefault();
  //        }
  //      }
  //      else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
  //        if (!_this.previousPosition || engine.isPointerLock) {
  //          return;
  //        }
  //        var offsetX = evt.clientX - _this.previousPosition.x;
  //        var offsetY = evt.clientY - _this.previousPosition.y;
  //        if (_this.camera.getScene().useRightHandedSystem) {
  //          //_this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
  //          _this.camera.parent.rotate(BABYLON.Axis.Y, -offsetX / _this.sensibility, BABYLON.Space.LOCAL);
  //        }
  //        else {
  //          //_this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
  //          _this.camera.parent.rotate(BABYLON.Axis.Y, offsetX / _this.sensibility, BABYLON.Space.LOCAL);
  //        }
  //        //_this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
  //         _this.camera.parent.rotate(BABYLON.Axis.X, offsetY / _this.sensibility, BABYLON.Space.LOCAL);
  //        _this.previousPosition = {
  //          x: evt.clientX,
  //          y: evt.clientY
  //        };
  //        if (!noPreventDefault) {
  //          evt.preventDefault();
  //        }
  //      }
  //    };
  //  }
  //  this._onMouseMove = function (evt) {
  //    if (!engine.isPointerLock) {
  //      return;
  //    }
  //    var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
  //    var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
  //    if (_this.camera.getScene().useRightHandedSystem) {
  //      //_this.camera.cameraRotation.y -= offsetX / _this.angularSensibility;
  //      _this.camera.parent.rotate(BABYLON.Axis.Y, -offsetX / _this.sensibility, BABYLON.Space.LOCAL);
  //    }
  //    else {
  //      //_this.camera.cameraRotation.y += offsetX / _this.angularSensibility;
  //      _this.camera.parent.rotate(BABYLON.Axis.Y, offsetX / _this.sensibility, BABYLON.Space.LOCAL);
  //    }
  //    //_this.camera.cameraRotation.x += offsetY / _this.angularSensibility;
  //    _this.camera.parent.rotate(BABYLON.Axis.X, offsetY / _this.sensibility, BABYLON.Space.LOCAL);
  //    _this.previousPosition = null;
  //    if (!noPreventDefault) {
  //      evt.preventDefault();
  //    }
  //  };
  //  this._observer = this.camera.getScene().onPointerObservable.add(this._pointerInput, BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERMOVE);
  //  element.addEventListener("mousemove", this._onMouseMove, false);
  //};
  //FreeCameraMouseRotateInput.prototype.detachControl = function (element) {
  //  if (this._observer && element) {
  //    this.camera.getScene().onPointerObservable.remove(this._observer);
  //    element.removeEventListener("mousemove", this._onMouseMove);
  //    this._observer = null;
  //    this._onMouseMove = null;
  //    this.previousPosition = null;
  //  }
  //};
  //FreeCameraMouseRotateInput.prototype.getTypeName = function () {
  //  return "FreeCameraMouseRotateInput";
  //};
  //FreeCameraMouseRotateInput.prototype.getSimpleName = function () {
  //  return "mouseRotate";
  //};
  ////  __decorate([
  ////      BABYLON.serialize()
  ////  ], FreeCameraMouseRotateInput.prototype, "buttons", void 0);
  ////  __decorate([
  ////      BABYLON.serialize()
  ////  ], FreeCameraMouseRotateInput.prototype, "angularSensibility", void 0);
  ////  return FreeCameraMouseRotateInput;
  ////};
  ////BABYLON.FreeCameraMouseRotateInput = FreeCameraMouseRotateInput;
  ////BABYLON.CameraInputTypes["FreeCameraMouseRotateInput"] = FreeCameraMouseRotateInput;

  //// Connect to camera:
  //camera.inputs.add(new FreeCameraMouseRotateInput());
}