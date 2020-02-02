function createLinkAt(x, y, rotation, anchorElement) {
    return {
        rigidBody: createRigidBody("link", x, y, rotation, 20),
        speed: 1.0,
        linkAscii: anchorElement.innerHTML,
        href: anchorElement.href,
        textSize: { x: 0, y: 0 },
        draw: function () {
            ctx.save();
            if (this.href.toLowerCase() == 'https://en.wikipedia.org/wiki/adolf_hitler') {
                ctx.fillStyle = 'rgb(255, 60, 60)';
                var text = drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.linkAscii, { fontSize: 64 });
            }
            else {
                ctx.fillStyle = 'rgb(10, 70, 170)';
                var text = drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.linkAscii);
            }
            this.textSize.x = text.width
            this.textSize.y = 24;
            //ctx.fillRect(this.rigidBody.position.x, this.rigidBody.position.y, text.width, defaultFontSize);
            ctx.restore();
        },
        update: function (deltaTime) {
            let start = vecAdd(this.rigidBody.position, vecScalarMultiply(this.rigidBody.getRight(), -this.textSize.x / 2));
            let end = vecAdd(this.rigidBody.position, vecScalarMultiply(this.rigidBody.getRight(), this.textSize.x / 2));
            let hits = lineTrace(start, end, "bullet", 12)
            if (hits.length > 0) {
                for (let i = 0; i < 25; i++) {
                    let particleSpawnLocation = vecAdd(start, vecScalarMultiply(vecNormalize(vecSubtract(end, start)), lerp(0, vecLength(vecSubtract(end, start)), Math.random())));
                    particles.push(createParticle(
                        particleSpawnLocation.x,
                        particleSpawnLocation.y,
                        (Math.random() * 6.28),
                        100 + Math.random() * 100,
                        0.5 + Math.random() * 1,
                        { r: 100, g: 140, b: 170 }
                    ));
                }

                linkPortals.push(createLinkPortalAt(this));
                destroyLinkByRigidBody(this.rigidBody);
                destroyBulletByRigidBody(hits[0]);
                let linkIndex;
                for (let i = 0; i < links.length; i++) {
                    if (links[i] == this) {
                        linkIndex = i;
                        break;
                    }
                }
                links.splice(linkIndex, 1);
            }
            let force = vecScalarMultiply(this.rigidBody.getForward(), this.speed);
            this.rigidBody.addForce(force);
        }
    }
}

function destroyLinkByRigidBody(rb) {
    destroyRigidBody(rb);
}