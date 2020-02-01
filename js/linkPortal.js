function createLinkPortalAt(link) {
    let localLinkP = {
        rigidBody: createRigidBody("linkPortal", link.rigidBody.position.x, link.rigidBody.position.y, link.rigidBody.rotation, 20, false, { 
            collisionResponse: {
                player: "overlap",
                wall: "collide",
                link: "ignore"
            },
            onOverlap: function (rb) {
                loadWikiPage(localLinkP.href);
            }
        }),
        speed: 1.0,
        linkAscii: linkFrame1,
        timeToNextFrame: 0.4,
        timeToDeath: 5,
        linkAnimateTime: 0.4,
        href: link.href,
        link: link,
        draw: function() {
            link.rigidBody.position = this.rigidBody.position;
            link.draw();
            ctx.save();
            ctx.fillStyle = 'rgb(180, 70, 170)';
            drawTextAt(this.rigidBody.position.x, this.rigidBody.position.y, this.rigidBody.rotation, this.linkAscii, {fontSize: 48, offset: {x:0,y:20}});
            var text = ctx.measureText(this.linkAscii);
            //ctx.fillRect(this.rigidBody.position.x, this.rigidBody.position.y, text.width, defaultFontSize);
            ctx.restore();
        }, 
        update: function (deltaTime) {
            let force = vecScalarMultiply(this.rigidBody.getForward(), this.speed);
            this.rigidBody.addForce(force);

            this.timeToDeath -= deltaTime;
            if(this.timeToDeath <= 0) {
                let linkPortalIndex;
                for(let i = 0; i < linkPortals.length; i++) {
                    if(linkPortals[i] == this) {
                        linkPortalIndex = i;
                        break;
                    }
                }
                destroyLinkPortalByRigidBody(this.rigidBody);
                linkPortals.splice(linkPortalIndex, 1);

                anchorsToSpawn.push(anchorsToCreateLinksFrom[getRandomInt(anchorsToCreateLinksFrom.length)]);
                if(anchorsToSpawn.length == 1) {
                    prevTime = 0;
                    requestAnimationFrame(createLinksOverTime);
                }
            }
            else if(this.timeToDeath <= 1) {
                this.linkAnimateTime = 0.1;
            }
            else if(this.timeToDeath <= 2.5) {
                this.linkAnimateTime = 0.2;
            }

            this.timeToNextFrame -= deltaTime;
            if(this.timeToNextFrame <= 0) {
                this.timeToNextFrame = this.linkAnimateTime;
                if(this.linkAscii == linkFrame1) {
                    this.linkAscii = linkFrame2;
                }
                else {
                    this.linkAscii = linkFrame1;
                }
            }
        }
    }
    return localLinkP;
}

function destroyLinkPortalByRigidBody(rb) {
    destroyRigidBody(rb);
}

const linkFrame1 = '{0}';
const linkFrame2 = '(0)';