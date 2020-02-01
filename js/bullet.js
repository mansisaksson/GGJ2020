function createBulletAt(x, y, rotation) {
    return {
        rigidBody: createRigidBody("bullet", x, y, rotation, 10, false, { 
            linearDampening: 0.001,
            collisionResponse: {
                player: "ignore",
                wall: "collide",
                link: "ignore"
            }
        }),
        speed: 1000.0,
        bulletASCII: `*`,
        hasFirered: false,
        lifeTime: 0,
        draw: function () {
            drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.bulletASCII);
        },
        update: function (deltaTime) {
            if (!this.hasFirered) {
                let force = vecScalarMultiply(this.rigidBody.getForward(), -this.speed);
                this.rigidBody.addForce(vecScalarMultiply(force, 1 / deltaTime));
                this.hasFirered = true;
            }
            this.lifeTime += deltaTime;
            if (this.lifeTime > 2) {
                destroyBulletByRigidBody(this.rigidBody);
            }
        }
    }
}

function destroyBulletByRigidBody(rb) {
    for (let i = 0; i < playerBullets.length; i++) {
        if (playerBullets[i].rigidBody.index == rb.index) {
            playerBullets.splice(i, 1);
            break;
        }
    }
    destroyRigidBody(rb);
}