function drawTextAt(xPos, yPos, angle, text, options) {
    ctx.save();
    ctx.translate(xPos, yPos);
    ctx.rotate(angle);

    options = options ? options : {};
    let fontSize = options.fontSize ? options.fontSize : 24;

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

function drawCircleAt(xPos, yPos, radius) {
    ctx.save();
    ctx.translate(xPos, yPos);
    
    // plz do dis tobias
    
    ctx.restore();
}