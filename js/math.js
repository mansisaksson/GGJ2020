function vecLength(vec) {
    return Math.sqrt(vec.x * vec.x, vec.y * vec.y)
}

function vecNormalize(vec) {
    let length = vecLength(vec.x, vec.y)
    return { x: vec.x / length, y: vec.y / length };
}

function vecAdd(vec1, vec2) {
    return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

function vecSubtract(vec1, vec2) {
    return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
}

function vecScalarMultiply(vec, scalar) {
    return { x: vec.x * scalar, y: vec.y * scalar };
}

function vecScalarAdd(vec, scalar) {
    return { x: vec.x + scalar, y: vec.y + scalar };
}

function vecScalarSubtract(vec, scalar) {
    return { x: vec.x - scalar, y: vec.y - scalar };
}