function createRigidBody(xPos, yPos, rot) {
    return {
        position: { x: xPos, y: yPos },
        prevPosition: { x: xPos, y: yPos },
        rotation: rot,
        velocity: { x: 0, y: 0 },
        spin: 0,
        force: { x: 0, y: 0 },
        torque: 0,
        mass: 1,
        linearDampening: 0.1,
        angularDampening: 0.1,
        radius: 1,
        addForce: function (vec) {
            vecAdd(vec)
        },
        getForward: function () {
            
        }
    }
}

var rigidBodies = []

function simulatePhysicsScene(deltaTime) {
    // integrate physics
    rigidBodies.forEach(rigidBody => {
        let invMass = 1.0 / rigidBody.mass;
        let newPos = vecScalarMultiply(rigidBody.position, (2.0 - rigidBody.linearDampening));
        newPos = vecSubtract(newPos, vecScalarMultiply(rigidBody.prevPosition, (1.0 - rigidBody.linearDampening)))
        newPos = vecAdd(newPos, vecScalarMultiply(rigidBody.force, invMass * deltaTime * deltaTime));

        rigidBody.prevPosition = rigidBody.position;
        rigidBody.position = newPos;

        rigidBody.force = 0

        // todo: torque
    })

    // collision check
    function calculateRigidBodyCollision(rb1, rb2) {
        let relativePosition = vecSubtract(rb1.position, rb2.position);
        let rbDistance = vecLength(relativePosition);
        let penetrationDepth = rbDistance - (rb1.radius + rb2.radius);

        if (penetrationDepth < 0) {
            let collisionAngle = vecNormalize(relativePosition);

            //if (DebugDrawCollision)
            //    Debug.DrawLine(ball1.GetPosition(), ball1.GetPosition() + collisionAngle);

            // Find the length of the component of each of the movement vectors along the collision Angle
            let a1 = vecDot(rb1.velocity, collisionAngle);
            let a2 = vecDot(rb2.velocity, collisionAngle);

            // Only Calculate P once so that it can be use for both v1 and v2
            let optimizedP = (2.0 * (a1 - a2)) / (rb1.mass + rb2.mass);

            // Calculate v1, the new movement vector of ball1
            let v1 = vecSubtract(rb.velocity, vecScalarMultiply(collisionAngle, optimizedP * rb1.mass));

            // Calculate v2, the new movement vector of ball2
            let v2 =  vecAdd(rb2.velocity, vecScalarMultiply(collisionAngle, optimizedP * rb2.mass));

            // Move the balls so that they are not overlapping
            rb1.position = vecSubtract(rb1.position, vecScalarMultiply(collisionAngle, depth / 2.0));
            rb2.position = vecSubtract(rb2.position, vecScalarMultiply(collisionAngle, -1 * (depth / 2.0)));

            // Apply new velocity
            rb1.velocity = v1;
            rb2.velocity = v2;
        }
    }

    rigidBodies.forEach((rb1, i1) => {
        rigidBodies.forEach((rb2, i2) => {
            if (i1 != i2) {
                calculateRigidBodyCollision(rb1, rb2);
            }
        });
    });
}

