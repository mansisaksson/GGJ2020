function vecLength(vec) {
    return Math.sqrt(vec.x * vec.x, vec.y * vec.y)
}

function normalize(vec) {
    let length = vecLength(vec.x, vec.y)
    return { x: vec.x / length, y: vec.y / length };
}

function vecAdd(vec1, vec2) {
    return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

function vecScalarMultiply(vec, scalar) {
    return { x: vec.x * scalar, y: vec.y * scalar };
}

var playerObj = {
    throttle: 0,
    stearing: 0,
    playerLocation: { x: 400, y: 400 },
    rotation: 0,
    playerSpeed: 5.0,
    playerShipASCII: `.
.'.
|o|
.'o'.
|.-.|
'   '`,

    update: function (deltaTime) {
        this.rotation += this.stearing * deltaTime * 0.005;

        const halfPi = - (3.14 / 2);
        let velocity = vecScalarMultiply({ x: Math.cos(this.rotation - halfPi), y: Math.sin(this.rotation - halfPi) }, this.playerSpeed * this.throttle);
        this.playerLocation = vecAdd(this.playerLocation, velocity);
        
        drawTextAt(this.playerLocation.x, this.playerLocation.y, this.rotation, this.playerShipASCII, { fontSize: 24 })
    }
}