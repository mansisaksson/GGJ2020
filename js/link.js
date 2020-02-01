function createLinkAt(x, y, rotation, anchorElement) {
    return {
        rigidBody: createRigidBody("link", x, y, rotation, 20),
        speed: 1.0,
        linkAscii: anchorElement.innerHTML,
        href: anchorElement.href,
        draw: function() {
            ctx.save();
            ctx.fillStyle = 'rgb(10, 70, 170)';
            drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.linkAscii);
            var text = ctx.measureText(this.linkAscii);
            //ctx.fillRect(this.rigidBody.position.x, this.rigidBody.position.y, text.width, defaultFontSize);
            ctx.restore();
        }, 
        update: function (deltaTime) {
            let force = vecScalarMultiply(this.rigidBody.getForward(), this.speed);
            this.rigidBody.addForce(force);
        }
    }
}

function destroyLinkByRigidBody(rb) {
    destroyRigidBody(rb);
}