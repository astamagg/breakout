// A generic constructor which accepts an arbitrary descriptor object
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.
Paddle.prototype.halfWidth = 50;
Paddle.prototype.halfHeight = 10;

Paddle.prototype.update = function (du) {

    if (g_keys[this.GO_LEFT] && this.cx - this.halfWidth > 0) {
        this.cx -= 5 * du;
    } else if (g_keys[this.GO_RIGHT] && this.cx + this.halfWidth < g_ctx.canvas.width) {
        this.cx += 5 * du;
    }
};

/*
* Resetting the paddle to the original values
*/
Paddle.prototype.reset = function() {
    this.cx = 200;
    this.cy = 375
}

Paddle.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    ctx.fillStyle = this.color;
    ctx.fillRect(this.cx - this.halfWidth,
                 this.cy - this.halfHeight,
                 this.halfWidth * 2,
                 this.halfHeight * 2);
};

//þarf að laga collidesWith, þannig að það finni réttan smell
//væri kúl að laga þannig að þegar hann smellur á hliðinni eða á ferð þá greinist áreksturinn
//hugmynd láta hann líka fá að vita næsta X og Y fyrir paddle
Paddle.prototype.collidesWith = function (prevX, prevY, 
                                          nextX, nextY, 
                                          r) { 
    // Check Y coords
    if ((nextY - r < this.cy && prevY - r >= this.cy ) ||
        (nextY + r > this.cy && prevY + r <= this.cy)) {
        // Check X coords
        if (nextX + r >= this.cx - this.halfWidth &&
            nextX - r <= this.cx + this.halfWidth) {
            // It's a hit!
            return true;
        }
    }
    //it is a miss
    return false;
};
