/*
* Constructor for the background Image
*/ 
function Background(image) {
    this.image = image; //the source photo

    this.cx = -100; //of center placement
    this.cy = 0;
}

/*
* Draw the background picture at the x and y coordinates set above
*/ 
Background.prototype.draw = function(ctx) {
    ctx.drawImage(this.image, this.cx, this.cy);
}