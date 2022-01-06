/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var game_score;
var flagpole;
var lives;
var enemies;
var platforms;


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    
    lives = 4;
    startGame();
}
	
function startGame()
{  
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [
        100,
        372,
        470, 
        600, 
        945, 
        1024, 
        1650,
        1960,
        2100,
        2280,
        2420,
        2600,
        2690,
        2782,
        2900,
        3105,
        3260,
        3400
    ];
    
    mountain = [
        {pos_x:100, pos_y:240}, 
        {pos_x:752, pos_y:240}, 
        {pos_x:1558,pos_y:240}, 
        {pos_x:2252, pos_y:240}, 
        {pos_x:3624, pos_y:240}, 
    ];
    
   cloud = [
        {pos_x:100, pos_y:80}, 
        {pos_x:452, pos_y:85},
        {pos_x:859,pos_y:70}, 
        {pos_x:1200, pos_y:80}, 
        {pos_x:1500, pos_y:85}, 
        {pos_x:1920, pos_y:69}
    ]; 
    
    canyon = [
        {pos_x:80, width:80}, 
        {pos_x:852, width:85},
        {pos_x:1559, width:70},
        {pos_x:2350, width:80}
    ];
    
    collectable = [
        {pos_x:-480, pos_y:floorPos_y - 280, size:30, isFound: false},
        {pos_x:200, pos_y:410, size:30, isFound: false}, 
        {pos_x:870, pos_y:330, size:20, isFound: false}, 
        {pos_x:1259,pos_y:410, size:20, isFound: false}, 
        {pos_x:1500, pos_y:410, size:40, isFound: false}, 
        {pos_x:1900, pos_y:330, size:25, isFound: false}, 
        {pos_x:2220, pos_y:410, size:20, isFound: false},
        {pos_x:2990, pos_y:floorPos_y - 330, size:20, isFound: false},
        {pos_x:3520, pos_y:410, size:50, isFound: false}
    ];
    
    game_score = 0;
    
    flagpole = {
        pos_x: 3850,
        isReached: false
    }

    lives -= 1;
    
    enemies = [];
    enemies.push( new Enemy(720,floorPos_y - 20, 80));
    enemies.push( new Enemy(1200,floorPos_y - 20, 100));
    enemies.push( new Enemy(1800,floorPos_y - 20, 200));
    enemies.push( new Enemy(2150,floorPos_y - 20, 200));
    enemies.push( new Enemy(3500,floorPos_y - 20, 75));
    
    platforms = [];
    platforms.push(createPlatform(0, floorPos_y - 100,100));
    platforms.push(createPlatform(- 160, floorPos_y - 150,100));
    platforms.push(createPlatform(- 320, floorPos_y - 200,100));
    platforms.push(createPlatform(- 480, floorPos_y - 250,100));
    platforms.push(createPlatform(2300, floorPos_y - 100,100));
    platforms.push(createPlatform(2460, floorPos_y - 150,100));
    platforms.push(createPlatform(2620, floorPos_y - 200,100));
    platforms.push(createPlatform(2780, floorPos_y - 250,100));
    platforms.push(createPlatform(2940, floorPos_y - 300,100));
    
    
}

function draw()
{
	background(100, 155, 255); // fill the sky blue
    

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    push();
    translate(scrollPos,0);
	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();
 
	// Draw trees.
    drawTrees();
    
	// Draw canyons.
    for(var i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }

        
	// Draw collectable items.
    for(var i = 0; i < collectable.length; i++)
    {   
        if(!collectable[i].isFound)
        {
            drawCollectable(collectable[i]);
            checkCollectable(collectable[i]);
            
        }
    }
    
    renderFlagpole();
    
    for(var i = 0; i < enemies.length; i++)
    {
            enemies[i].update();
            enemies[i].draw();
            if(enemies[i].isContact(gameChar_world_x, 
            gameChar_y))
            {
                startGame();
                break;
            }
    }
    for(var i = 0; i < platforms.length; i++)
    {
            platforms[i].draw();
    }
                
    pop();
	
    // Draw game character.
	
	drawGameChar();
    
    //draw lives
    
    drawLives();
    
    //draw screen text
    
    fill(255)
    stroke(200);
    text("Score: " + game_score, 20, 30);
    text("Lives: " + lives, 20, 50);
    
    push();
    
    // Logic to make text appear when all lives are lost.
    if(lives < 1)
    {
        textSize(40);
        text("Better luck next time Robot!", 280, 300);
        text("Press space to continue!", 300, 350);
        return;
            
    }
    
    // Logic to make text appear when flag pole is reached.
    if(flagpole.isReached == true)
    {
        textSize(40);
        text("Mission Complete, Press space to continue", 150, 300);
        text("Score: " + game_score, 180, 400);
        return;
    }
    
    pop();

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
   
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        
        for(var i = 0; i < platforms.length; i++)
        {
            if(
                platforms[i].checkContact(gameChar_world_x, gameChar_y) == true
                
            )
            {
                isContact = true;
                break;
            }
        }
        if(isContact == false)
        {
            gameChar_y +=2;
            isFalling = true;    
        }
        else
        {
            isFalling = false;
        }
        
    }
    else
    {
        isFalling = false;
    }
    
    if (isPlummeting)
    {
        gameChar_y += 5; 
    }


    if(flagpole.isReached !=true)
    {
        checkFlagpole();
    }
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    //Restarts game if character falls in canyon.
    if(gameChar_y >= 650 && lives > 0)
    {
        startGame();
    }
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    if(flagpole.isReached && key == ' ')
    {
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }


    if(keyCode == 37)
    {
        isLeft = true;
        
    }
    
    if(keyCode == 39)
    {
        isRight = true;  
        
    }
    
    if (key == " " || key == "W")
    {
       
        
        gameChar_y -=100;
            
        //isFalling = true;    
    }
       
    console.log("press" + keyCode);
	console.log("press" + key);

}

function keyReleased()
{

	if(keyCode == 37)
    {
        isLeft = false; 
          
    }
    
    if(keyCode == 39)
    {
        isRight = false;
         
    }
    
    if (key == " ")
    {
        
        isFalling = false;
        
    }
    console.log("release" + keyCode);
	console.log("release" + key);
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
   
    
    	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(255,173,96);
        rect(gameChar_x-9, //head
             gameChar_y-76,
             14, 
             13); 

        rect(gameChar_x-1, //right leg
             gameChar_y-33,
             5, 
             15); 

        fill(21,130,213);
        rect(gameChar_x-8, //body
             gameChar_y-63, 
             15, 
             30); 

        fill(255);
        ellipse(gameChar_x-4, //white eye
                gameChar_y-70,
                9,
                9); 
        fill(0);
        ellipse(gameChar_x-6, //eyeball
                gameChar_y-70, 
                6, 
                6); 
        ellipse(gameChar_x, //right foot
                gameChar_y-15, 
                8, 
                8); 
        fill(255,173,96)
        rect(gameChar_x-5, //left arm
             gameChar_y-59, 
             3, 
             30); 

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(255,173,96);
        rect(gameChar_x, //head
             gameChar_y-76,
             14, 
             13); 

        rect(gameChar_x-1, //right leg
             gameChar_y-33,
             5, 
             15); 

        fill(21,130,213);
        rect(gameChar_x-3, //body
             gameChar_y-63, 
             15, 
             30); 

        fill(255);
        ellipse(gameChar_x+10, //white eye
                gameChar_y-70,
                9,
                9); 
        fill(0);
        ellipse(gameChar_x+11, //eyeball
                gameChar_y-70, 
                6, 
                6); 
        ellipse(gameChar_x+2, //right foot
                gameChar_y-15, 
                8, 
                8); 
        fill(255,173,96)
        rect(gameChar_x+5, //left arm
             gameChar_y-59, 
             3, 
             30); 

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(255,173,96);
        rect(gameChar_x-9, //head
             gameChar_y-76,
             14, 
             13); 

        rect(gameChar_x-1, //right leg
             gameChar_y-33,
             5, 
             32); 

        fill(21,130,213);
        rect(gameChar_x-8, //body
             gameChar_y-63, 
             15, 
             30); 

        fill(255);
        ellipse(gameChar_x-4, //white eye
                gameChar_y-70,
                8,
                8); 
        fill(0);
        ellipse(gameChar_x-6, //eyeball
                gameChar_y-70, 
                3, 
                3); 
        ellipse(gameChar_x+1, //right foot
                gameChar_y-4, 
                8, 
                8); 
        fill(255,173,96)
        rect(gameChar_x-5, //left arm
             gameChar_y-59, 
             3, 
             30); 

	}
	else if(isRight)
	{
		// add your walking right code
        fill(255,173,96);
        rect(gameChar_x, //head
             gameChar_y-76,
             14, 
             13); 

        rect(gameChar_x-1, //right leg
             gameChar_y-33,
             5, 
             30); 

        fill(21,130,213);
        rect(gameChar_x-3, //body
             gameChar_y-63, 
             15, 
             30); 

        fill(255);
        ellipse(gameChar_x+10, //white eye
                gameChar_y-70,
                8,
                8); 
        fill(0);
        ellipse(gameChar_x+12, //eyeball
                gameChar_y-70, 
                3, 
                3); 
        ellipse(gameChar_x+2, //right foot
                gameChar_y-4, 
                8, 
                8); 
        fill(255,173,96)
        rect(gameChar_x+5, //left arm
             gameChar_y-59, 
             3, 
             30); 

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(255,173,96);
        rect(gameChar_x-5, //head
             gameChar_y-76,
             14, 
             13); 
        rect(gameChar_x-7, //left leg
             gameChar_y-33, 
             5, 
             15); 
        rect(gameChar_x+6, //right leg
             gameChar_y-33,
             5, 
             15); 
        rect(gameChar_x+17, //right arm
             gameChar_y-59, 
             3, 
             30); 
        rect(gameChar_x-16, //left arm
             gameChar_y-59, 
             3, 
             30); 
        fill(21,130,213);
        rect(gameChar_x-10, //body
             gameChar_y-63, 
             24, 
             30); 
        rect(gameChar_x+14, //right shoulders
             gameChar_y-59, 
             6, 
             3); 
        rect(gameChar_x-16, //left shoulder
             gameChar_y-59,
             6, 
             3); 
        fill(255);
        ellipse(gameChar_x+2, //white eye
                gameChar_y-70,
                10,
                10); 
        fill(0);
        ellipse(gameChar_x+2, //eyeball
                gameChar_y-70, 
                7, 
                7); 
        ellipse(gameChar_x-5, //left foot
                gameChar_y-14, 
                8, 
                8); 
        ellipse(gameChar_x+8.5, //right foot
                gameChar_y-14, 
                8, 
                8); 

	}
	else
	{
		// add your standing front facing code
        fill(255,173,96);
        rect(gameChar_x-5, //head
             gameChar_y-76,
             14, 
             13); 
        rect(gameChar_x-7, //left leg
             gameChar_y-33, 
             5, 
             32); 
        rect(gameChar_x+6, //right leg
             gameChar_y-33,
             5, 
             32); 
        rect(gameChar_x+17, //right arm
             gameChar_y-59, 
             3, 
             30); 
        rect(gameChar_x-16, //left arm
             gameChar_y-59, 
             3, 
             30); 
        fill(21,130,213);
        rect(gameChar_x-10, //body
             gameChar_y-63, 
             24, 
             30); 
        rect(gameChar_x+14, //right shoulders
             gameChar_y-59, 
             6, 
             3); 
        rect(gameChar_x-16, //left shoulder
             gameChar_y-59,
             6, 
             3); 
        fill(255);
        ellipse(gameChar_x+2, //white eye
                gameChar_y-70,
                8,
                8); 
        fill(0);
        ellipse(gameChar_x+2, //eyeball
                gameChar_y-70, 
                3, 
                3); 
        ellipse(gameChar_x-5, //left foot
                gameChar_y-4, 
                8, 
                8); 
        ellipse(gameChar_x+8.5, //right foot
                gameChar_y-4, 
                8, 
                8); 

}
    
    
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < cloud.length; i++)
    {
        fill(255)
        ellipse(cloud[i].pos_x,
                cloud[i].pos_y,
                70,
                70);
        ellipse(cloud[i].pos_x + 30,
                cloud[i].pos_y + 20,
                60,
                60);
        ellipse(cloud[i].pos_x + 60,
                cloud[i].pos_y + 20,
                50,
                50);
        ellipse(cloud[i].pos_x - 30,
                cloud[i].pos_y + 20,
                50,
                50);
        fill(100, 155, 255);
        rect(cloud[i].pos_x - 60,
             cloud[i].pos_y + 30, 
             150,
             20);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountain.length; i++)
    {
        fill(2,86, 77);
        triangle(mountain[i].pos_x, //mountain in the back
                 mountain[i].pos_y, 
                 mountain[i].pos_x + 130, 
                 mountain[i].pos_y + 130, 
                 mountain[i].pos_x + 30, 
                 mountain[i].pos_y + 180); 
        fill(0,120,108);
        triangle(mountain[i].pos_x - 180, //giant mountain 
                 mountain[i].pos_y + 192,
                 mountain[i].pos_x + 40, 
                 mountain[i].pos_y - 90, 
                 mountain[i].pos_x + 280, 
                 mountain[i].pos_y + 192); 
        fill(32,57,33)
        triangle(mountain[i].pos_x + 240, //giant mountain shadow
                 mountain[i].pos_y + 192, 
                 mountain[i].pos_x + 40, 
                 mountain[i].pos_y - 90, 
                 mountain[i].pos_x + 280, 
                 mountain[i].pos_y + 192);
        fill(2,137,123);
        triangle(mountain[i].pos_x - 220,//moutain on the left
                 mountain[i].pos_y + 192, 
                 mountain[i].pos_x - 120, 
                 mountain[i].pos_y + 80, 
                 mountain[i].pos_x - 40, 
                 mountain[i].pos_y + 192); 
        fill(32,57,33)
        triangle(mountain[i].pos_x - 60,
                 mountain[i].pos_y + 192,
                 mountain[i].pos_x - 120, 
                 mountain[i].pos_y + 80, 
                 mountain[i].pos_x - 40, 
                 mountain[i].pos_y + 192);
        fill(2,137,123);
        triangle(mountain[i].pos_x + 40, //mountain on the right
                 mountain[i].pos_y + 192, 
                 mountain[i].pos_x + 130,
                 mountain[i].pos_y + 70, 
                 mountain[i].pos_x + 230, 
                 mountain[i].pos_y + 192); 
        fill(32,57, 33);
        triangle(mountain[i].pos_x + 210,
                 mountain[i].pos_y + 192,
                 mountain[i].pos_x + 130,
                 mountain[i].pos_y + 70,
                 mountain[i].pos_x + 230, 
                 mountain[i].pos_y + 192);
        fill(255);
        triangle(mountain[i].pos_x + 5, 
                 mountain[i].pos_y - 45, 
                 mountain[i].pos_x + 40,
                 mountain[i].pos_y - 90, 
                 mountain[i].pos_x + 72,
                 mountain[i].pos_y - 45);
        triangle(mountain[i].pos_x - 147,
                 mountain[i].pos_y + 110,
                 mountain[i].pos_x - 120,
                 mountain[i].pos_y + 80,  
                 mountain[i].pos_x - 103,
                 mountain[i].pos_y + 110);
        triangle(mountain[i].pos_x + 104,
                 mountain[i].pos_y + 105, 
                 mountain[i].pos_x + 130,
                 mountain[i].pos_y + 70, 
                 mountain[i].pos_x + 153,
                 mountain[i].pos_y + 105);
    }
 
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(64,95,49);
        ellipse(trees_x[i] + 7, //first tree second bush
                floorPos_y - 110, 
                55, 
                120);
        ellipse(trees_x[i] + 75, //second tree second bush 
                floorPos_y - 80, 
                45, 
                100);
        fill(77,129,63);
        ellipse(trees_x[i], //first tree first bush
                floorPos_y - 110, 
                50, 
                120); 
        ellipse(trees_x[i] + 70, //second tree first bush
                floorPos_y - 80, 
                40, 
                100); 
        fill(103, 81, 32);  //branches for big tree
        rect(trees_x[i], 
             floorPos_y - 73, 
             10, 
             73);
        rect(trees_x[i] + 70, //branches for small tree
             floorPos_y - 53, 
             10, 
             53);
    }   
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
   
    fill(87,60,49);
    rect(t_canyon.pos_x, 
         432, 
         t_canyon.width, 
         170);
    fill(0,80,255);
    rect(t_canyon.pos_x, 
         520, 
         t_canyon.width, 
         170);

}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{     
    if (gameChar_world_x > t_canyon.pos_x && gameChar_world_x < t_canyon.pos_x + t_canyon.width && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
 
    fill(255,232,39);
    rect(t_collectable.pos_x, 
         t_collectable.pos_y, 
         t_collectable.size, 
         t_collectable.size);
    fill(255, 0,0);
    rect(t_collectable.pos_x + 5, 
         t_collectable.pos_y + 5, 
         t_collectable.size - 10, 
         t_collectable.size - 10);
    
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.pos_x, t_collectable.pos_y + 20) < t_collectable.size)
    {
        t_collectable.isFound = true;
        game_score += t_collectable.size;
    }
        
}

//function to render flagpole.

function renderFlagpole()
{
    push();
    stroke(0,0,0);
    strokeWeight(6);
    line(flagpole.pos_x, floorPos_y, flagpole.pos_x, floorPos_y - 180);

    if(flagpole.isReached)
    {
        noStroke();
        fill(255,0,0);
        rect(flagpole.pos_x, floorPos_y - 180, 50, 50);
    }

    else
    {
        noStroke();
        fill(255,0,0);
        rect(flagpole.pos_x, floorPos_y - 50, 50, 50);
    }
    pop();
}

//function to check if flagpole has been reached.

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.pos_x);
    if(d < 10)
    {
        flagpole.isReached = true;
    }
}

//function to draw lives.

function drawLives()
{
    for (var i = 0; i < lives; i++)
    {
        fill(250,0,0);
        ellipse(28 + i * 28, 80, 20, 40);
        fill(255,255,255);
        ellipse(28 + i * 28, 80, 10, 30);
    }
}

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        fill(255,0,0);
        noStroke();
        ellipse(this.current_x, this.y, -50, 50);
        fill(255);
        ellipse(this.current_x - 5 , this.y, 12);
        ellipse(this.current_x + 5 , this.y, 12);
        fill(0);
        ellipse(this.current_x - 7 , this.y, 6);
        ellipse(this.current_x + 4 , this.y, 6);
        
        stroke(255);
        line(
            this.current_x - 18 , 
            this.y - 10,
            this.current_x - 7,
            this.y - 5
        );
        line(
            this.current_x + 18 , 
            this.y - 10,
            this.current_x + 7,
            this.y - 5
        );
        strokeWeight(4)
        line(                       //first sword
            this.current_x + 30 , 
            this.y - 22,
            this.current_x + 20,
            this.y + 5
        );
        line(
            this.current_x + 30 , 
            this.y - 3,
            this.current_x + 16,
            this.y - 5
        );
        line(                       //second sword
            this.current_x - 30 , 
            this.y - 22,
            this.current_x - 20,
            this.y + 5
        );
        line(
            this.current_x - 30 , 
            this.y - 3,
            this.current_x - 16,
            this.y - 5
        );
        
        
    }
    
    this.update = function()
    {
        this.current_x += this.incr; 
        
        if(this.current_x < this.x)
        {
                this.incr = 1;
        }
        else if(this.current_x > this.x + this.range)
        {
                this.incr = -1;
        }
                                
    }
    
    this.isContact = function(gc_x, gc_y)
    {
        //returns true if contact is made
        
        var d = dist(gc_x, gc_y, this.current_x, this.y);
        
        if(d < 33)
        {
            return true;
        }
            return false;
    }
}

function createPlatform(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(239, 142, 16);
            stroke(239, 142, 16);
            rect(this.x, this.y, this.length, 20);
        },
        
        checkContact: function(gc_x, gc_y)
        {
            // checks whether game character is incontact with the platform
            if (gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            
            return false;
        }
            
    }
    
    return p;
}