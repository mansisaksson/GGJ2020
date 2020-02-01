function createBulletAt(x, y, rotation) {
    return {
        rigidBody: createRigidBody(x, y, rotation),
        speed: 5.0,
        bulletASCII: `*`,
        draw: () => drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.bulletASCII),
        update: function (deltaTime) {
            let force = vecScalarMultiply(this.rigidBody.getForward(), this.speed);
            this.rigidBody.addForce(force);
        }
    }
}