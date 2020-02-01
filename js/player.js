function createPlayerAt(x, y) {
    return {
        throttle: 0,
        stearing: 0,
        rigidBody: createRigidBody("player", x, y, 0, 50, false),
        playerSpeed: 1000.0,
        turnSpeed: 15.0,
        particleSpawnTimer: 0,
        playerShipASCII: `.
.'.
|o|
.'o'.
|.-.|
'   '`,

        update: function (deltaTime) {
            this.rigidBody.addForce(vecScalarMultiply(this.rigidBody.getForward(), this.rigidBody.mass * this.playerSpeed * this.throttle));
            this.rigidBody.addTorque(this.stearing * this.turnSpeed);

            this.fontSize -= 1 * deltaTime;
            this.particleSpawnTimer += deltaTime;

            let maxSpeed = 700;
            let currentSpeed  = Math.min(vecLength(this.rigidBody.velocity), maxSpeed);
            let minSpawnRate = 0.1;
            let maxSpawnRate = 0.01;
            
            let spawnTimeLimit = lerp(minSpawnRate, maxSpawnRate, currentSpeed / maxSpeed);

            if (this.particleSpawnTimer >= spawnTimeLimit && this.throttle < 0) {
                let particleSpawnLocation = vecAdd(
                    this.rigidBody.position,
                    vecScalarMultiply(this.rigidBody.getForward(), playerObj.rigidBody.radius)
                );

                particles.push(createParticle(
                    particleSpawnLocation.x,
                    particleSpawnLocation.y,
                    playerObj.rigidBody.rotation + (-1.0 + Math.random() * 2.0),
                    100 + Math.random() * 100,
                    0.5 + Math.random() * 1
                ));

                this.particleSpawnTimer = 0;
            }
        },

        draw: function () {
            drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.playerShipASCII, { fontSize: 24 })
        }
    }
}
