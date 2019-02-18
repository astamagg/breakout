/*
* A constructor for the wall in the PONG game
*/ 
function Wall(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    //called to build the wall for the first time
    this.buildWall();
}

g_bricks = [];  //array for the bricks

/*
* Check whether to lines intersect (go through) each other.
* We need the start (X,Y) and end (X,Y) for both lines
* For simplicity we regard the ball as a center point, disregarding the radius in collision detection
*/ 
Wall.prototype.intersectBetween2Lines = function(line1_firstPoint_X, line1_firstPoint_Y, line1_secondPoint_X, line1_secondPoint_Y, 
    line2_firstPoint_X, line2_firstPoint_Y, line2_secondPoint_X, line2_secondPoint_Y) {
    var det, gamma, lambda;
    //calculating determinant of both lines
    det = (line1_secondPoint_X - line1_firstPoint_X) * (line2_secondPoint_Y - line2_firstPoint_Y) - 
          (line2_secondPoint_X - line2_firstPoint_X) * (line1_secondPoint_Y - line1_firstPoint_Y);
    //the lines are in parellel
    if (det === 0) {
        return false;
    //check if the cross
    } else {
        lambda = ((line2_secondPoint_Y - line2_firstPoint_Y) * (line2_secondPoint_X - line1_firstPoint_X) + 
                  (line2_firstPoint_X - line2_secondPoint_X) * (line2_secondPoint_Y - line1_firstPoint_Y)) / det;
        gamma = ((line1_firstPoint_Y - line1_secondPoint_Y) * (line2_secondPoint_X - line1_firstPoint_X) +
                 (line1_secondPoint_X - line1_firstPoint_X) * (line2_secondPoint_Y - line1_firstPoint_Y)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)
    }
}

/*
* Check whether the ball collides with the top or the bottom of the brick
*/ 
Wall.prototype.topOrBottomBrickCollision = function (prevX, prevY, nextX, nextY, r) {
    var hit = false;
    var nextBrick = 100;
    //go through all the bricks
    for (var i=0; i<g_bricks.length; i++) {
        //check whether the ball hits the bottom
        var collisionOnBottom = this.intersectBetween2Lines(prevX, prevY, nextX, nextY, 
            g_bricks[i].x, 
            g_bricks[i].y + this.brickHeight, 
            g_bricks[i].x + this.brickWidth, 
            g_bricks[i].y + this.brickHeight);
        //check whether the ball this the top
        var collisionOnTop = this.intersectBetween2Lines(prevX, prevY, nextX, nextY, 
            g_bricks[i].x, 
            g_bricks[i].y, 
            g_bricks[i].x + this.brickWidth, 
            g_bricks[i].y);
        //if the ball hits the bottom or the top return true 
        if (collisionOnBottom || collisionOnTop) {
            g_ball.brickCollisionLeftRight = true;
            hit = true;
            nextBrick = i;
        }
    }
    //if there is a collision remove the brick from bricks
    if(hit) {
        g_bricks.splice(nextBrick, 1);
    }
    return hit;
}

/*
* I am aware of the fact that this is just like the topOrBottomBrickCollision
* I just couldn't think of a way to incorporate them together
*/ 
Wall.prototype.leftOrRightBrickCollision = function (prevX, prevY, nextX, nextY, r) {
    var hit = false;
    var brickHit = 100;
    // go through all the bricks
    for (var i=0; i < g_bricks.length; i++) {
        //check collision with the left
        var collisionOnLeft = this.intersectBetween2Lines(prevX, prevY, nextX, nextY, 
            g_bricks[i].x, 
            g_bricks[i].y, 
            g_bricks[i].x, 
            g_bricks[i].y + this.brickHeight);
        //check collision with the right side
        var collisionOnRight = this.intersectBetween2Lines(prevX, prevY, nextX, nextY, 
             g_bricks[i].x + this.brickWidth, 
             g_bricks[i].y, 
             g_bricks[i].x + this.brickWidth, 
             g_bricks[i].y + this.brickHeight);
        //return true if there is a collision
        if (collisionOnLeft || collisionOnRight) {
            hit = true;
            brickHit = i;
        }
    }
    //if there is a collision remove the brick from bricks
    if(hit) {
        g_bricks.splice(brickHit, 1);
    }
    return hit;
}

/*
 * Redrawing of the wall with the bricks that are remaining
*/
Wall.prototype.render = function (ctx) {
    var count = 0;
    for(var i = 0; i < g_bricks.length; i++) {
        count++;
        fillBox(ctx, g_bricks[i].x, g_bricks[i].y, this.brickWidth, this.brickHeight, g_bricks[i].color); 
    }
    if(count === 0) {
        g_gameWon = true;
    }
};

/*
* Choosing a random color from all the rgb values
*/
Wall.prototype.randomColor = function() {
    var red = Math.floor(Math.random() * Math.floor(256));
    var green = Math.floor(Math.random() * Math.floor(256));
    var blue = Math.floor(Math.random() * Math.floor(256));

    return("rgb(" + red + "," + green + "," + blue + ")");
}

/*
* Building the wall. Adding all the bricks to a array at a specific location
*/
Wall.prototype.buildWall = function() {
    g_bricks = [];
    var cy = this.startY;
    var cx = this.startX;

    for(var rows = 0; rows < 5; rows++) {
        for(var columns = 0; columns < 8; columns++) {
            var randomColor = this.randomColor();
            //adding the brick to the wall
            g_bricks.push({row:rows, 
                            column: columns, 
                            x: cx, //Starting x of brick
                            y: cy, //Starting y of brick
                            color: randomColor});    //random color
            //increase the x coords for the next brick
            cx += this.brickWidth;
        }
        cy += this.brickHeight; //increase the y coords for next brick
        cx = this.startX; //reset x coord for the start
    }
}