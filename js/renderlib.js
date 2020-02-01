var defaultFontSize = 24;

function drawTextAt(xPos, yPos, angle, text, options) {
    ctx.save();
    ctx.translate(xPos, yPos);
    ctx.rotate(angle);

    options = options ? options : {};
    let fontSize = options.fontSize ? options.fontSize : defaultFontSize;

    ctx.font = options.font ? options.font : fontSize + 'px Consolas';

    let subStrings = text.split("\n");
    ctx.translate(0, -fontSize * (subStrings.length / 2 - 0.5))

    subStrings.forEach(line => {
        /** @type {TextMetrics} */
        let lineMetrics = ctx.measureText(line);
        ctx.fillText(line, -lineMetrics.width / 2, fontSize / 2);
        ctx.translate(0, fontSize);
    });
    
    /** @type {TextMetrics} */
    let textMetrics = ctx.measureText(text)
    ctx.restore();

    return textMetrics;
}

function drawCircleAt(xPos, yPos, radius) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(xPos, yPos, radius, 0, Math.PI * 2, false);
    ctx.stroke();

    ctx.restore();
}

function drawBoxAt(xPos, yPos, width, height) {
    ctx.save();
    let thickness = 2;
    let x = xPos - width / 2;
    let y = yPos - height / 2;
    let w = width;
    let h = height;
    ctx.fillRect(x, y, w, h);

    x += thickness;
    y += thickness;
    w -= thickness * 2;
    h -= thickness * 2;
    ctx.clearRect(x, y, w, h);
    ctx.restore();
}

function drawLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}