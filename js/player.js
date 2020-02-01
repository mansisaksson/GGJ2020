function createPlayerAt(x, y) {
    return {
        throttle: 0,
        stearing: 0,
        rigidBody: createRigidBody("player", x, y, 0, 50, false),
        playerSpeed: 1000.0,
        turnSpeed: 15.0,
        playerShipASCII: `.
.'.
|o|
.'o'.
|.-.|
'   '`,

        update: function (deltaTime) {
            this.rigidBody.addForce(vecScalarMultiply(this.rigidBody.getForward(), this.rigidBody.mass * this.playerSpeed * this.throttle));
            this.rigidBody.addTorque(this.stearing * this.turnSpeed);
        },

        draw: function() {
            drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.playerShipASCII, { fontSize: 24 })
        }
    }
}
