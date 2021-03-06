/** @type {HTMLCanvasElement} */
var gameCanvas = null;
/** @type {CanvasRenderingContext2D} */
var ctx = null;

var gameDeltaTime = 0.0;
var gameTime = 0.0;
var playerObj = null;
var playerBullets = new Array();
var particles = new Array();
var links = new Array();
var linkPortals = new Array();
var visitedLinks = new Array();
var hrefGOAL;

var randomGoalPages = [
    {title: 'Adolf Hitler', href: 'https://en.wikipedia.org/wiki/adolf_hitler'},
    {title: 'NASA', href: 'https://en.wikipedia.org/wiki/nasa'},
    {title: 'Elon Musk', href: 'https://en.wikipedia.org/wiki/elon_musk'},
    {title: 'Sweden', href: 'https://en.wikipedia.org/wiki/sweden'},
    {title: 'Mario', href: 'https://en.wikipedia.org/wiki/mario'},
    {title: 'Gaben', href: 'https://en.wikipedia.org/wiki/gabe_newell'},
    {title: 'Carl XVI Gustaf', href: 'https://en.wikipedia.org/wiki/carl_xvi_gustaf_of_sweden'},
    {title: 'IKEA', href: 'https://en.wikipedia.org/wiki/ikea'},
    {title: 'Mozart', href: 'https://en.wikipedia.org/wiki/wolfgang_amadeus_mozart'}
];

function update(time) {
    let deltaTime = Math.min(1 / 16, (time - gameTime) / 1000.0);
    gameTime = time;
    gameDeltaTime = deltaTime;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    playerObj.update(deltaTime);
    playerBullets.forEach(b => b.update(deltaTime));
    particles.forEach(b => b.update(deltaTime));
    links.forEach((link) => link.update(deltaTime));
    linkPortals.forEach((lp) => lp.update(deltaTime));
    updatePhysicsScene(deltaTime);

    playerObj.draw();
    playerBullets.forEach(b => b.draw());
    particles.forEach(b => b.draw());
    links.forEach((link) => link.draw());
    linkPortals.forEach((lp) => lp.draw());

    drawPhysicsScene();

    requestAnimationFrame(update);
}

function main() {
    /** @type {HTMLCanvasElement} */
    gameCanvas = document.getElementById("game-canvas");
    /** @type {CanvasRenderingContext2D} */
    ctx = gameCanvas.getContext("2d");
    
    visitedLinks = document.getElementById('visitedLinks');
    let randomPage = randomGoalPages[getRandomInt(randomGoalPages.length)];
    hrefGOAL = randomPage.href;
    document.getElementById('findTitle').innerHTML = "Find: " + randomPage.title;
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
            let bulletSpawnLocation = vecAdd(playerObj.rigidBody.position, vecScalarMultiply(playerObj.rigidBody.getForward(), -playerObj.rigidBody.radius));
            playerBullets.push(createBulletAt(bulletSpawnLocation.x, bulletSpawnLocation.y, playerObj.rigidBody.rotation));
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
const linksToSpawn = 30;
function loadWikiPage(href) {
    for(let i = 0; i < linkPortals.length; i++) {
        destroyLinkPortalByRigidBody(linkPortals[i].rigidBody);
    }
    linkPortals = new Array();
    for(let i = 0; i < links.length; i++) {
        destroyLinkByRigidBody(links[i].rigidBody);
    }
    links = new Array();
    if(href.toLowerCase() == hrefGOAL) {
        $.ajax({
            type: 'GET',
            url: 'scripts/get_wiki_content.php',
            dataType: "text",
            data: {
                Site: encodeURI(href)
            },
            success: function (data) {
                let domparser = new DOMParser();
                wikiDOM = domparser.parseFromString(data, 'text/html');
               
                document.getElementsByTagName('title')[0].innerHTML = wikiDOM.getElementsByTagName('title')[0].innerHTML;
    
                if(!document.getElementById('wiki-title') && !wikiDOM.getElementById('firstHeading')){
                    //var GAMEOVER = TRUE;
                    return;
                }
                var title = document.getElementById('wiki-title');
                if(wikiDOM.getElementById('firstHeading')) {
                    title.innerHTML = wikiDOM.getElementById('firstHeading').innerHTML;
                }
                else {
                    title.innerHTML = 'UNKNOWN';
                }
                var wikiText = document.getElementById('wiki-text');
                if (wikiDOM.getElementById('mw-content-text')) {
                    wikiText.innerHTML = wikiDOM.getElementById('mw-content-text').innerHTML;
                }
                else {
                    wikiText.innerHTML = '';
                }
                visitedLinks.innerHTML += `<li><a href='${href}' target='_blank' style=''>${title.innerHTML}</a></li>`;

                $('.background-text').fadeTo(2000, 1.0);
            }
        });

        return;
    }
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
           
            document.getElementsByTagName('title')[0].innerHTML = wikiDOM.getElementsByTagName('title')[0].innerHTML;

            if(!document.getElementById('wiki-title') && !wikiDOM.getElementById('firstHeading')){
                var GAMEOVER = TRUE;
                return;
            }
            var title = document.getElementById('wiki-title');
            if(wikiDOM.getElementById('firstHeading')) {
                title.innerHTML = wikiDOM.getElementById('firstHeading').innerHTML;
            }
            else {
                title.innerHTML = 'UNKNOWN';
            }

            var wikiText = document.getElementById('wiki-text');
            if (wikiDOM.getElementById('mw-content-text')) {
                wikiText.innerHTML = wikiDOM.getElementById('mw-content-text').innerHTML;
            }
            else {
                wikiText.innerHTML = '';
            }
            
            visitedLinks.innerHTML += `<li><a href='${href}' target='_blank' style=''>${title.innerHTML}</a></li>`;

            anchorsToCreateLinksFrom = getLinksFromWikiPage(wikiDOM);
            
            // todo :: remove duplicates

            anchorsToSpawn = new Array();

            for(let i = 0; i < anchorsToCreateLinksFrom.length; i++) {
                if(anchorsToCreateLinksFrom[i].href.toLowerCase() == hrefGOAL) {
                    anchorsToSpawn.push(anchorsToCreateLinksFrom[i]);
                }
            }

            if(anchorsToCreateLinksFrom.length > linksToSpawn) {
                for(let i = 0; i < linksToSpawn; i++) {
                    anchorsToSpawn.push(anchorsToCreateLinksFrom[getRandomInt(anchorsToCreateLinksFrom.length)]);
                }
            }
            else {
                for(let i = 0; i < anchorsToCreateLinksFrom.length; i++) {
                    anchorsToSpawn.push(anchorsToCreateLinksFrom[i]);
                }
            }

            prevTime = 0;
            createLinksOverTime(0);
        }
    });
}
var anchorsToCreateLinksFrom;
var anchorsToSpawn;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  var prevTime = 0;
  var timeToNextLink = 0;
function createLinksOverTime(time) {
    let deltaTime = (time - prevTime);
    prevTime = time;

    timeToNextLink -= deltaTime;

    if(timeToNextLink > 0) {
        if(anchorsToSpawn.length > 0) {
            requestAnimationFrame(createLinksOverTime);
        }
        return;
    }

    timeToNextLink = 1.3;

    var quadrant = getRandomInt(4);

    var linkPosX;
    var linkPosY;
    var linkRotation = Math.random()*2*Math.PI;
    if(quadrant == 0){
        linkPosX = 100 + Math.random() * (gameCanvas.width-100);
        linkPosY = 100;
    }
    if(quadrant == 1){
        linkPosX = gameCanvas.width-100;
        linkPosY = 100 + Math.random() * (gameCanvas.height-100);
    }
    else if(quadrant == 2) {
        linkPosX = 100 + Math.random() * (gameCanvas.width-100);
        linkPosY = gameCanvas.height-100;
    }
    else if(quadrant == 3){
        linkPosX = 100;
        linkPosY = 100 + Math.random() * (gameCanvas.height-100);
    }

    links.push(createLinkAt(linkPosX, linkPosY, linkRotation, anchorsToSpawn[0]));
    anchorsToSpawn.splice(0,1);

    if(anchorsToSpawn.length > 0) {
        requestAnimationFrame(createLinksOverTime);
    }
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
