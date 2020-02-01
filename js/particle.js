function createParticle(x, y, rotation, speed, lifeTime) {
    let particleList = [ "@", "£", "!", "&", "$", "€", "%", "¤" ]
    return {
        rigidBody: createRigidBody("particle", x, y, rotation, 10, false, { 
            linearDampening: 0.001,
            collisionResponse: {
                player: "ignore",
                wall: "ignore",
                link: "ignore",
                bullet: "ignore"
            }
        }),
        speed: speed,
        ASCII: particleList[Math.floor(Math.random() * (particleList.length - 1))],
        hasFirered: false,
        lifeTime: lifeTime,
        totalLifetime: lifeTime,
        fontSize: 24,
        initialFontSize: 24,
        
        update: function (deltaTime) {
            if (!this.hasFirered) {
                let force = vecScalarMultiply(this.rigidBody.getForward(), this.speed);
                this.rigidBody.addForce(vecScalarMultiply(force, 1 / deltaTime));
                this.hasFirered = true;
            }
            this.lifeTime -= deltaTime;
            this.fontSize = this.initialFontSize * (this.lifeTime / this.totalLifetime);
            if (this.lifeTime <= 0) {
                destroyParticleByRigidBody(this.rigidBody);
            }
        },

        draw: function () {
            ctx.save();
            ctx.fillStyle = 'rgb(190, 190, 190)';
            drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.ASCII, { fontSize: this.fontSize });
            ctx.restore();
        }
    }
}

function destroyParticleByRigidBody(rb) {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].rigidBody.index == rb.index) {
            particles.splice(i, 1);
            break;
        }
    }
    destroyRigidBody(rb);
}