/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.FlyControls = function (object, domElement) {

    this.object = object;

    this.domElement = ( domElement !== undefined ) ? domElement : document;
    if (domElement) this.domElement.setAttribute('tabindex', -1);

    // API

    this.movementSpeed = 1.0;
    this.rollSpeed = 0.005;

    this.dragToLook = false;
    this.autoForward = false;

    // disable default target object behavior

    // internals

    this.tmpQuaternion = new THREE.Quaternion();

    this.mouseStatus = 0;

    this.moveState = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        forward: 0,
        back: 0,
        pitchUp: 0,
        pitchDown: 0,
        yawLeft: 0,
        yawRight: 0,
        rollLeft: 0,
        rollRight: 0
    };
    this.moveVector = new THREE.Vector3(0, 0, 0);
    this.rotationVector = new THREE.Vector3(0, 0, 0);

    this.handleEvent = function (event) {

        if (typeof this[event.type] == 'function') {

            this[event.type](event);

        }

    };

    this.update = function (delta) {

        var moveMult = delta * this.movementSpeed;
        var rotMult = delta * this.rollSpeed;

        this.object.translateX(this.moveVector.x * moveMult);
        this.object.translateY(this.moveVector.y * moveMult);
        this.object.translateZ(this.moveVector.z * moveMult);

        this.tmpQuaternion.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1).normalize();
        this.object.quaternion.multiply(this.tmpQuaternion);

        // expose the rotation vector for convenience
        this.object.rotation.setFromQuaternion(this.object.quaternion, this.object.rotation.order);


    };

    this.updateMovementVector = function () {

        var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

        this.moveVector.x = ( -this.moveState.left + this.moveState.right );
        this.moveVector.y = ( -this.moveState.down + this.moveState.up );
        this.moveVector.z = ( -forward + this.moveState.back );

        //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

    };

    this.updateRotationVector = function () {

        this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
        this.rotationVector.y = ( -this.moveState.yawRight + this.moveState.yawLeft );
        this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

        //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

    };


    this.updateMovementVector();
    this.updateRotationVector();

    this.go = function () {
        this.moveState.forward = 1;
        this.updateMovementVector();
    };

    this.stop = function () {
        this.moveState.forward = 0;
        this.moveState.yawLeft = 0;
        this.moveState.pitchDown = 0;

        this.updateMovementVector();
        this.updateRotationVector();
        this.$control.css({left: 0, top: 0});
    };

    this.move = function (x, y) {
        this.moveState.yawLeft = -x * 0.2;
        this.moveState.pitchDown = y * 0.2;

        this.updateRotationVector();
    };

    this.init = function () {
        var self = this;
        var controling = false;
        var leave = true;

        this.$control = $("#fly_control").find(".round");

        this.$control.on("mousedown touchstart", function (e) {
            e.stopPropagation();
            self.go();
            controling = true;
            leave = false;
        });

        // трогаем контрол
        this.$control.on("mouseup touchend", function (e) {
            e.stopPropagation();
            self.stop();
            controling = false;
            leave = true;
        });

        // не трогаем контрол
        this.$control.on("mouseleave touchleave", function () {
            leave = true;
        });

        // мышь убежала
        $(document).on("mouseup.flycontrol touchend.flycontrol", function () {
            if (leave) {
                self.stop();
                controling = false;
            }
        });

        // двигаем контрол
        $(document).on("mousemove.flycontrol touchmove.flycontrol", function (e) {
            e.stopPropagation();
            if (!controling) {
                return false;
            }

            // мышь или тач
            var eX = e.pageX || e.originalEvent.touches[0].pageX;
            var eY = e.pageY || e.originalEvent.touches[0].pageY;

            // максимальное отклонение
            var max = 125;
            var offset = 75; // ???????? ?????? ????????

            // степень отклонения (часть от 1)
            var x = eX - self.$control.parent().offset().left - offset;
            var y = eY - self.$control.parent().offset().top - offset;

            // ограничиваем отклонение
            x = Math.max(Math.min(x, max), -max) / max;
            y = Math.max(Math.min(y, max), -max) / max;

            self.move(x, y);

            // смещаем контрол
            self.$control.css({left: x * offset, top: y * offset});
        });
    };
};
