/** @type {HTMLCanvasElement} */
var gameCanvas = null;
/** @type {CanvasRenderingContext2D} */
var ctx = null;

var gameTime = 0.0;
var deltaTime = 0.0;
var playerObj = null;
var playerBullets = new Array();
var links = new Array();

function update(time) {
    deltaTime = (time - gameTime) / 1000.0;
    gameTime = time;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    playerObj.update(deltaTime);
    playerBullets.forEach(b => b.update(deltaTime));
    links.forEach((link) => link.update(deltaTime));
    updatePhysicsScene(deltaTime);

    playerObj.draw();
    playerBullets.forEach(b => b.draw());
    links.forEach((link) => link.draw());

    drawPhysicsScene();

    requestAnimationFrame(update);
}

function main() {
    /** @type {HTMLCanvasElement} */
    gameCanvas = document.getElementById("game-canvas");
    /** @type {CanvasRenderingContext2D} */
    ctx = gameCanvas.getContext("2d");

    playerObj = createPlayerAt(400, 400, 0);

    // acanvas.addEventListener('mousemove', mouseMove, false); //Call the mouseMove function when the mouse is moved over the canvas element
    // acanvas.addEventListener('mousedown', mouseDown, false); //Call the mouseDown function when a mouse button is pressed down on the canvas element
    // acanvas.addEventListener('contextmenu', function(event){console.log("onContextMenu");event.preventDefault();}, false); //Prevent the context menu to be displayed when right mouse button is clicked on the canvas
    var keyMap = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    }

    function updateInput() {
        playerObj.throttle = (keyMap.ArrowUp ? -1 : 0) + (keyMap.ArrowDown ? 1 : 0)
        playerObj.stearing = (keyMap.ArrowLeft ? -1 : 0) + (keyMap.ArrowRight ? 1 : 0)
    }

    document.addEventListener('keydown', (event) => {
        if (event.key == "ArrowUp") {
            keyMap.ArrowUp = true;
            event.preventDefault();
        }
        if (event.key == "ArrowDown") {
            keyMap.ArrowDown = true;
            event.preventDefault();
        }

        if (event.key == "ArrowLeft") {
            keyMap.ArrowLeft = true;
            event.preventDefault();
        }
        if (event.key == "ArrowRight") {
            keyMap.ArrowRight = true;
            event.preventDefault();
        }

        if (event.key == " ") {
            playerBullets.push(createBulletAt(playerObj.rigidBody.position.x, playerObj.rigidBody.position.y - 20, playerObj.rigidBody.rotation));
            event.preventDefault();
        }
        if (event.key == "f") {
            loadWikiPage(links[0].href);
            event.preventDefault();
        }

        updateInput()
    });

    document.addEventListener('keyup', (event) => {
        if (event.key == "ArrowUp") {
            keyMap.ArrowUp = false;
            event.preventDefault();
        }
        if (event.key == "ArrowDown") {
            keyMap.ArrowDown = false;
            event.preventDefault();
        }

        if (event.key == "ArrowLeft") {
            keyMap.ArrowLeft = false;
            event.preventDefault();
        }
        if (event.key == "ArrowRight") {
            keyMap.ArrowRight = false;
            event.preventDefault();
        }
        if (event.key == " ") {
            event.preventDefault();
        }

        updateInput();
    });

    requestAnimationFrame(update);

    loadWikiPage('https://en.wikipedia.org/wiki/Special:Random');
}

function loadWikiPage(href) {
    for(let i = 0; i < links.length; i++) {
        destroyLinkByRigidBody(links[i].rigidBody);
    }
    links = new Array();
    $.ajax({
        type: 'GET',
        url: 'scripts/get_wiki_content.php',
        dataType: "text",
        data: {
            Site: href
        },
        success: function (data) {
            let domparser = new DOMParser();
            wikiDOM = domparser.parseFromString(data, 'text/html');

            var title = document.getElementById('wiki-title');
            title.innerHTML = wikiDOM.getElementById('firstHeading').innerHTML;

            var anchors = getLinksFromWikiPage(wikiDOM);
            anchors.forEach((a) => links.push(createLinkAt(100 + Math.random() * 500, 100, (Math.random() - 0.5) * 1, a)));
        }
    });
}

var wikiDOM;
function getLinksFromWikiPage(document) {
    var divArticle = document.getElementById("mw-content-text");
    let unfilteredAnchors = divArticle.getElementsByTagName('a');
    let anchors = new Array();
    for (let i = 0; i < unfilteredAnchors.length; i++) {
        let a = unfilteredAnchors[i];
        if(a.href && !a.innerHTML.includes('<')) {
            let url = new URL(a.href);
            if (url.hostname = 'localhost' && url.pathname.startsWith('\/wiki\/') && !url.pathname.includes(':')) {
                a.href = 'https://en.wikipedia.org' + url.pathname;
                anchors.push(a);
            }
        }
    }
    return anchors;
}
