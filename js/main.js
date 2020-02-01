/** @type {HTMLCanvasElement} */
var gameCanvas = null;
/** @type {CanvasRenderingContext2D} */
var ctx = null;

var gameTime = 0.0;
var playerObj = null;

function main() {
    /** @type {HTMLCanvasElement} */
    gameCanvas = document.getElementById("game-canvas");
    /** @type {CanvasRenderingContext2D} */
    ctx = gameCanvas.getContext("2d");

    playerObj = createPlayerAt(400, 400, 0);

    // acanvas.addEventListener('mousemove', mouseMove, false); //Call the mouseMove function when the mouse is moved over the canvas element
    // acanvas.addEventListener('mousedown', mouseDown, false); //Call the mouseDown function when a mouse button is pressed down on the canvas element
    // acanvas.addEventListener('contextmenu', function(event){console.log("onContextMenu");event.preventDefault();}, false); //Prevent the context menu to be displayed when right mouse button is clicked on the canvas

    requestAnimationFrame(update);
}

function update(time) {
    let deltaTime = (time - gameTime) / 1000.0;
    gameTime = time;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    //drawTextAt(250, 250, 0, testDrawString, { fontSize: 24 })

    playerObj.update(deltaTime);
    playerBullets.forEach(b => b.update(deltaTime));
    
	simulatePhysicsScene(deltaTime);
    playerObj.draw();
    playerBullets.forEach(b => b.draw());
	
    requestAnimationFrame(update);
}

var playerBullets = new Array();

$(document).ready(function () {
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
        if(event.key == " ") {
            playerBullets.push(createBulletAt(playerObj.rigidBody.position.x + playerObj.rigidBody.radius ? playerObj.rigidBody.radius : 20, playerObj.rigidBody.position.y, playerObj.rigidBody.rotation));
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
        if(event.key == " ") {
            event.preventDefault();
        }

        updateInput();
    });

    main();

    $.ajax({
        type: 'GET',
        url: '../scripts/get_wiki_content.php',
        dataType: "text",
        data: {
            Country: "Japan"
        },
        success: function (data) {
            let domparser = new DOMParser();
            let doc = domparser.parseFromString(data, 'text/html');
            console.log(doc.getElementsByTagName('a'));
        }
    });
});