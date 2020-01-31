/** @type {HTMLCanvasElement} */
var gameCanvas = null;
/** @type {CanvasRenderingContext2D} */
var ctx = null;

var gameTime = 0.0;

function drawTextAt(xPos, yPos, angle, text, options) {
    ctx.save();
    ctx.translate(xPos, yPos);
    ctx.rotate(angle);

    options = options ? options : {};
    let fontSize = options.fontSize ? options.fontSize : 48;

    ctx.font = options.font ? options.font : fontSize + 'px Consolas';

    let subStrings = text.split("\n");
    ctx.translate(0, -fontSize * (subStrings.length / 2 - 0.5))

    subStrings.forEach(line => {
        /** @type {TextMetrics} */
        let lineMetrics = ctx.measureText(line);
        ctx.fillText(line, -lineMetrics.width / 2, fontSize / 2);
        ctx.translate(0, fontSize);
    });

    ctx.restore();
}

//function drawImageAt()

function main() {
    /** @type {HTMLCanvasElement} */
    gameCanvas = document.getElementById("game-canvas");
    /** @type {CanvasRenderingContext2D} */
    ctx = gameCanvas.getContext("2d");

    // acanvas.addEventListener('mousemove', mouseMove, false); //Call the mouseMove function when the mouse is moved over the canvas element
    // acanvas.addEventListener('mousedown', mouseDown, false); //Call the mouseDown function when a mouse button is pressed down on the canvas element
    // acanvas.addEventListener('contextmenu', function(event){console.log("onContextMenu");event.preventDefault();}, false); //Prevent the context menu to be displayed when right mouse button is clicked on the canvas

    requestAnimationFrame(update);
}

function update(time) {
    let deltaTime = time - gameTime;
    gameTime = time;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    //drawTextAt(250, 250, 0, testDrawString, { fontSize: 24 })

    playerObj.update(deltaTime);

    requestAnimationFrame(update);
}

$(document).ready(function () {
    document.addEventListener('keydown', (event) => {
        if (event.key == "ArrowUp") {
            playerObj.throttle = -1;
        }
        if (event.key == "ArrowDown") {
            playerObj.throttle = 1;
        }

        if (event.key == "ArrowLeft") {
            playerObj.stearing = -1;
        }
        if (event.key == "ArrowRight") {
            playerObj.stearing = 1;
        }

        //event.preventDefault();
    });

    document.addEventListener('keyup', (event) => {
        if (event.key == "ArrowUp") {
            playerObj.throttle = 0;
        }
        if (event.key == "ArrowDown") {
            playerObj.throttle = 0;
        }

        if (event.key == "ArrowLeft") {
            playerObj.stearing = 0;
        }
        if (event.key == "ArrowRight") {
            playerObj.stearing = 0;
        }

       // event.preventDefault();
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