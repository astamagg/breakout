// Step 13: Simplify
/*

Supporting timer-events (via setInterval) *and* frame-events (via requestAnimationFrame)
adds significant complexity to the the code.

I can simplify things a little by focusing on the latter case only (which is the
superior mechanism of the two), so let's try doing that...

The "MAINLOOP" code, inside g_main, is much simplified as a result.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ============
// PADDLE STUFF
// ============

// PADDLE 1

var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);
var KEY_N = 'N'.charCodeAt(0);  //Keycode for a new game if we lose/win

//can be deactivated so they don't alway appear at the following places
//sorry if it is inconvenient, I was going to do a toggle button but didn't have the time
var g_gameOver = false; //comment out line 52 in g_ball.js, replace with this.yVel *= -1
var g_gameWon = false;   // comment out line 91-93 in Wall.js

/*
* creating a new paddle object
*/
var g_paddle1 = new Paddle({
    cx : 200,
    cy : 375,
    color: "rgb(199, 21, 133)", //setting the color of the paddle
    
    GO_LEFT   : KEY_A,
    GO_RIGHT : KEY_D
});

/*
* Initializing a new wall object
*/ 
var g_wall = new Wall ({
    startY: 25, //top left y coord
    startX: 0,  //top left x coord

    brickWidth: 50, //width of every brick
    brickHeight: 25, //height of every brick
});

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    g_ball.update(du);
    g_paddle1.update(du);
   // g_paddle2.update(du);
}

/*
* Function for drawing the text if we win/lose
*/
function gameOver() {
    clearCanvas(g_ctx);
    g_background.draw(g_ctx);
    g_ctx.font= "50px Courier";
    //text color is white
    g_ctx.fillStyle = "rgb(255,255,255)";
    //center text
    g_ctx.textAlign = "center";
    if(g_gameOver) {
        g_ctx.fillText("Game over", g_ctx.canvas.width/2, g_ctx.canvas.height/2);
    } else {
        g_ctx.fillText("You won!", g_ctx.canvas.width/2, g_ctx.canvas.height/2);
    }
    //change the font size for understatement
    g_ctx.font = "20px Courier";
    g_ctx.fillText("Press N to start a NEW GAME", g_ctx.canvas.width/2, g_ctx.canvas.height/2+50);

    //if N is pressed be start a new game
    //resetting the game and setting that we won/lost as false
    if(g_keys[KEY_N]) {
        g_gameOver = false;
        g_gameWon = false;
        g_ball.reset();
        g_wall.buildWall();
        g_paddle1.reset();
    }
}

// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
    if(g_gameOver || g_gameWon) {
        gameOver();
    } else {
        g_background.draw(ctx);
        g_ball.render(ctx);
        g_paddle1.render(ctx);
        g_wall.render(ctx);
    }
}

var g_background;   //general background variable

/*
* Making sure we load the image before any rendering starts
*/
function preloadStuff(completionCallback) {
    var backgroundImage = new Image();
    
    //make sure the images is loaded before we continue
    backgroundImage.onload = function () { 
        g_background = new Background(backgroundImage);
        completionCallback();
    };
    //source page https://www.videoblocks.com/video/night-sky-time-lapse-stars-and-galaxies-moving-across-the-night-sky-qmvghdo
    backgroundImage.src = "https://notendur.hi.is/alm20/images/stars.jpg";
}

// Funtion to call the main function
function main_Init() {
    g_main.init();
}

//don't start the main function until the image is loaded
preloadStuff(main_Init);