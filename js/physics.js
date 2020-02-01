var rigidBodies = []

function createRigidBody(xPos, yPos, rot, mass, width, height, linearDampening, angularDampening, isKinematic = false) {
    let rigidBody = {
        position: { x: xPos, y: yPos },
        prevPosition: { x: xPos, y: yPos },
        rotation: rot,
        velocity: { x: 0, y: 0 },
        angularVelocity: 0,
        force: { x: 0, y: 0 },
        torque: 0,
        mass: mass ? mass : 1,
        linearDampening: linearDampening ? linearDampening : 0.02,
        angularDampening: angularDampening ? angularDampening : 10.0,
        width: width ? width : 10,
        height: height ? height : 10,
        isKinematic: isKinematic,
        addForce: function (vec) {
            this.force = vecAdd(this.force, vec)
        },
        addTorque: function (t) {
            this.torque += t;
        },
        getForward: function () {
            const halfPi = (3.14 / 2);
            return { x: Math.cos(this.rotation + halfPi), y: Math.sin(this.rotation + halfPi) };
        }
    }

    rigidBodies.push(rigidBody)
    return rigidBody
}

function updatePhysicsScene(deltaTime) {
    function updateRigidBodyMovement(rb) {
        let invMass = 1.0 / rb.mass;
        let newPos = vecScalarMultiply(rb.position, (2.0 - rb.linearDampening));
        newPos = vecSubtract(newPos, vecScalarMultiply(rb.prevPosition, (1.0 - rb.linearDampening)))
        newPos = vecAdd(newPos, vecScalarMultiply(rb.force, invMass * deltaTime * deltaTime));

        rb.prevPosition = vecCpy(rb.position);
        rb.position = vecCpy(newPos);

        rb.rotation += 0.5 * rb.angularVelocity * deltaTime;
        rb.angularVelocity += rb.torque * deltaTime;
        rb.rotation += 0.5 * rb.angularVelocity * deltaTime;
        rb.angularVelocity -= Math.sign(rb.angularVelocity) * rb.angularDampening * deltaTime;

        rb.velocity = vecScalarMultiply(vecSubtract(rb.position, rb.prevPosition), 1.0 / deltaTime);

        rb.force = { x: 0, y: 0 };
        rb.torque = 0;
    }

    function calculateRigidBodyCollision(rb1, rb2) {
        //var rect1 = { x: rb1.position.x - rb1.width / 2, y: rb1.position.y - rb1.height / 2, width: rb1.width, height: rb1.height }
        //var rect2 = { x: rb2.position.x - rb2.width / 2, y: rb2.position.y - rb2.height / 2, width: rb2.width, height: rb2.height }
        // if (rect1.x < rect2.x + rect2.width &&
        //     rect1.x + rect1.width > rect2.x &&
        //     rect1.y < rect2.y + rect2.height &&
        //     rect1.y + rect1.height > rect2.y) {
        //     performCollisionResponse()
        //     console.log("Collide!")
        // }

        // Old circle collision
        let relativePosition = vecSubtract(rb1.position, rb2.position);
        let rbDistance = vecLength(relativePosition);
        rb1.radius = rb1.width;
        rb2.radius = rb2.width;
        let penetrationDepth = rbDistance - (rb1.radius + rb2.radius);
        if (penetrationDepth < 0) {
            let collisionAngle = vecNormalize(relativePosition);

            // Find the length of the component of each of the movement vectors along the collision Angle
            let a1 = vecDot(rb1.velocity, collisionAngle);
            let a2 = vecDot(rb2.velocity, collisionAngle);

            // Only Calculate P once so that it can be use for both v1 and v2
            let optimizedP = (2.0 * (a1 - a2)) / (rb1.mass + rb2.mass);

            // Apply new velocity
            if (!rb1.isKinematic) {
                // Move the body so that they are not overlapping
                let moveScalar = rb2.isKinematic ? 1 : 0.5;
                rb1.position = vecSubtract(rb1.position, vecScalarMultiply(collisionAngle, penetrationDepth * moveScalar));

                // Set new velocity
                //let v1 = vecSubtract(rb1.velocity, vecScalarMultiply(collisionAngle, optimizedP * rb1.mass));
                //rb1.prevPosition = vecSubtract(rb1.position, vecScalarMultiply(v1, deltaTime));
                //rb1.velocity = v1;
            }
            if (!rb2.isKinematic) {
                // Move the body so that they are not overlapping
                let moveScalar = rb1.isKinematic ? -1 : -0.5;
                rb2.position = vecSubtract(rb2.position, vecScalarMultiply(collisionAngle, penetrationDepth * moveScalar));

                // Set new velocity
                //let v2 = vecAdd(rb2.velocity, vecScalarMultiply(collisionAngle, optimizedP * rb2.mass));
                //rb2.prevPosition = vecSubtract(rb2.position, vecScalarMultiply(v2, deltaTime));
                //rb2.velocity = v2;
            }
        }
    }

    rigidBodies.forEach((rb, i) => {
        if (!rb.isKinematic) {
            updateRigidBodyMovement(rb)

            for (let j = i + 1; j < rigidBodies.length; j++) {
                calculateRigidBodyCollision(rb, rigidBodies[j]);
            }
        }
        else {
            rb.velocity = { x: 0, y: 0 };
            rb.prevPosition = rb.position;
        }
    })
}

function drawPhysicsScene() {
    rigidBodies.forEach(rb => {
        drawCircleAt(rb.position.x, rb.position.y, rb.width);
        drawBoxAt(rb.position.x, rb.position.y, rb.width, rb.height)
    });
}

