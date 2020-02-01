function createPlayerAt(x, y) {
    return {
        throttle: 0,
        stearing: 0,
        rigidBody: createRigidBody(x, y, 0),
        playerSpeed: 5.0,
        playerShipASCII: `.
.'.
|o|
.'o'.
|.-.|
'   '`,

        update: function (deltaTime) {
            //this.rotation += this.stearing * deltaTime * 0.005;
//
            //const halfPi = - (3.14 / 2);
            //let velocity = vecScalarMultiply({ x: Math.cos(this.rotation - halfPi), y: Math.sin(this.rotation - halfPi) }, this.playerSpeed * this.throttle);
//
            //this.rigidBody.addForce({})
            drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.playerShipASCII, { fontSize: 24 })
        }
    }
}
