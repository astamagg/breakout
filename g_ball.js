// ==========
// BALL STUFF
// ==========

// BALL STUFF
g_motionTrailLength = 20; //how many past postitions of the ball we want to remember for the trail
g_motionTrail = []; //storing past positions of the ball to draw the trail

/*
* Ball is initialized
*/
var g_ball = {
    cx: 50,
    cy: 200,
    radius: 10,
    color: "rgb(255, 255, 255)",

    xVel: 5,
    yVel: 4,
};

/*
* Adding our current position to the trail
*/
g_ball.storeLastPosition = function(prevX, prevY) {
    //adding our current position to our trail
    g_motionTrail.push({
       x: prevX, 
       y: prevY
    });
    
    if(g_motionTrail.length > g_motionTrailLength) {
        //removing the oldest coordinates from our trail array if it is > 20
        g_motionTrail.shift();
    }
}

g_ball.update = function (du) {
    // Remember my previous position
    var prevX = this.cx;
    var prevY = this.cy;
    
    // Compute my provisional new position (barring collisions)
    var nextX = prevX + this.xVel * du;
    var nextY = prevY + this.yVel * du;

    // Bounce off the paddles
    if (g_paddle1.collidesWith(prevX, prevY, nextX, nextY, this.radius))
    {
        this.yVel *= -1;
    }

    //collision detection checking if the wall has hit the top or the bottom of the brick
    if (g_wall.topOrBottomBrickCollision(prevX, prevY, nextX, nextY, this.radius)) 
    {
        this.yVel *= -1
    }

     //collision detection checking if the wall has hit the left or the right of the brick
    if (g_wall.leftOrRightBrickCollision(prevX, prevY, nextX, nextY, this.radius)) 
    {
        this.xVel *= -1
    }

    //if we fall of the bottom the game is lost
    if(nextY > g_canvas.height) {
        g_gameOver = true;
    }
    
    // Bounce off top edge
    if (nextY < 0) { 
        this.yVel *= -1;
    }

    //Bounce of the sides
    if (nextX < 0 || 
        nextX > g_canvas.width) {
        this.xVel *= -1;
    }

    // *Actually* update my position 
    // ...using whatever velocity I've ended up with
    //
    this.cx += this.xVel * du;
    this.cy += this.yVel * du;
};

/*
* resetting the balls placement, velocity to initial values and removing the trail.
*/ 
g_ball.reset = function () {
    this.cx = 50;
    this.cy = 200;
    this.xVel = 5;
    this.yVel = 4;
    g_motionTrail = []; //empty trail
};

/*
* There is a problem with the trail it disappears when the game is paused
* I do believe it is because the trail is drawn in the render but I am not sure 
* where I should draw it otherwise, I will fix it if I have the time
*/
g_ball.createTrail = function(ctx) {
    var ratio = 0
    clearCanvas(ctx);
    g_background.draw(ctx);

    //drawing the trail
    for(var i = 0; i < g_motionTrail.length; i++) {
        //creating a fading affect, the older the position the more faded it appears
        ratio = (i + 1)/g_motionTrail.length; 
        ctx.beginPath();
        ctx.arc(g_motionTrail[i].x, g_motionTrail[i].y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(255,255,255," + ratio + ")";
        ctx.fill();
        
    }
}
/*
Rendering for the ball
*/
g_ball.render = function (ctx) {
    //setting the color to white
    ctx.fillStyle = this.color;
    //drawing the trail
    this.createTrail(ctx);
    //drawing the ball
    fillCircle(ctx, this.cx, this.cy, this.radius);
    //adding our position to the trail
    this.storeLastPosition(this.cx, this.cy);
};