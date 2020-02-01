var rigidBodies = []
var rigidBodyIndexCount = 0;

function createRigidBody(bodyType, xPos, yPos, rot, radius, isKinematic = false, options) {
    let defaultCollisionResponse = {
        player: "collide",
        wall: "collide",
        text: "collide"
    }

    let defaultOptions = {
        mass: 1.0,
        collisionResponse: defaultCollisionResponse,
        linearDampening: 0.02,
        angularDampening: 10.0,
        onCollide: () => { },
        onOverlap: () => { }
    }

    options = options == undefined ? defaultOptions : options;

    let rigidBody = {
        index: rigidBodyIndexCount++,
        bodyType: bodyType ? bodyType : "wall",
        position: { x: xPos, y: yPos },
        prevPosition: { x: xPos, y: yPos },
        rotation: rot,
        velocity: { x: 0, y: 0 },
        angularVelocity: 0,
        force: { x: 0, y: 0 },
        torque: 0,
        mass: options.mass ? options.mass : defaultOptions.mass,
        linearDampening: options.linearDampening ? options.linearDampening : defaultOptions.linearDampening,
        angularDampening: options.angularDampening ? options.angularDampening : defaultOptions.angularDampening,
        radius: radius ? radius : 10,
        isKinematic: isKinematic,
        collisionResponse: options.collisionResponse ? options.collisionResponse : defaultOptions.collisionResponse,
        onCollide: options.onCollide ? options.onCollide : defaultOptions.onCollide,
        onOverlap: options.onOverlap ? options.onOverlap : defaultOptions.onOverlap,

        addForce: function (vec) {
            this.force = vecAdd(this.force, vec)
        },
        addTorque: function (t) {
            this.torque += t;
        },
        getForward: function () {
            const halfPi = (3.14 / 2);
            return { x: Math.cos(this.rotation + halfPi), y: Math.sin(this.rotation + halfPi) };
        },
        setVelocity: function (newVel) {
            this.prevPosition = vecSubtract(this.position, vecScalarMultiply(newVel, deltaTime));
            this.velocity = newVel;
        },
        setLocation: function (newLoc) {
            this.position = newLoc;
            this.prevPosition = vecSubtract(this.position, vecScalarMultiply(this.velocity, -1));
        }
    }

    rigidBodies.push(rigidBody)
    return rigidBody
}

function destroyRigidBody(rigidBody) {
    for (let i = 0; i < rigidBodies.length; i++) {
        if (rigidBodies[i].index == rigidBody.index) {
            rigidBodies.splice(i, 1);
            break;
        }
    }
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

    function calculateWallCollision(rb) {
        const wallBounciness = 0.5;
        let leftDepth = rb.position.x - rb.radius;
        if (leftDepth < 0) {
            rb.position.x = rb.position.x - leftDepth;
            rb.setVelocity({ x: rb.velocity.x * -wallBounciness, y: rb.velocity.y })
        }

        let rightDepth = gameCanvas.width - (rb.position.x + rb.radius);
        if (rightDepth < 0) {
            rb.position.x = rb.position.x + rightDepth;
            rb.setVelocity({ x: rb.velocity.x * -wallBounciness, y: rb.velocity.y })
        }

        let topDepth = rb.position.y - rb.radius;
        if (topDepth < 0) {
            rb.position.y = rb.position.y - topDepth;
            rb.setVelocity({ x: rb.velocity.x, y: rb.velocity.y * -wallBounciness })
        }

        let botDepth = gameCanvas.height - (rb.position.y + rb.radius);
        if (botDepth < 0) {
            rb.position.y = rb.position.y + botDepth;
            rb.setVelocity({ x: rb.velocity.x, y: rb.velocity.y * -wallBounciness })
        }
    }

    function calculateRigidBodyCollision(rb1, rb2) {
        let relativePosition = vecSubtract(rb1.position, rb2.position);
        let rbDistance = vecLength(relativePosition);
        let penetrationDepth = rbDistance - (rb1.radius + rb2.radius);
        if (penetrationDepth < 0) {
            if (rb1.collisionResponse[rb2.bodyType] == "ignore" || rb2.collisionResponse[rb1.bodyType] == "ignore") {
                return;
            }

            if (rb1.collisionResponse[rb2.bodyType] == "overlap" || rb2.collisionResponse[rb1.bodyType] == "overlap") {
                rb1.onOverlap(rb2);
                rb2.onOverlap(rb1);
                return;
            }

            rb1.onCollide(rb2);
            rb2.onCollide(rb1);

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
                rb1.setVelocity(vecSubtract(rb1.velocity, vecScalarMultiply(collisionAngle, optimizedP * rb1.mass)));
            }
            if (!rb2.isKinematic) {
                // Move the body so that they are not overlapping
                let moveScalar = rb1.isKinematic ? -1 : -0.5;
                rb2.position = vecSubtract(rb2.position, vecScalarMultiply(collisionAngle, penetrationDepth * moveScalar));

                // Set new velocity
                rb2.setVelocity(vecAdd(rb2.velocity, vecScalarMultiply(collisionAngle, optimizedP * rb2.mass)));
            }
        }
    }

    rigidBodies.forEach((rb, i) => {
        if (!rb.isKinematic) {
            updateRigidBodyMovement(rb)
            calculateWallCollision(rb)
        }
        else {
            rb.velocity = { x: 0, y: 0 };
            rb.prevPosition = rb.position;
        }
        for (let j = i + 1; j < rigidBodies.length; j++) {
            calculateRigidBodyCollision(rb, rigidBodies[j]);
        }
    })
}

function drawPhysicsScene() {
    rigidBodies.forEach(rb => {
        drawCircleAt(rb.position.x, rb.position.y, rb.radius);
        //drawBoxAt(rb.position.x, rb.position.y, rb.width, rb.height)
    });
}

