//GRID CONSTANTS
var COLS = 26;
var ROWS = 26;

//IDs
var EMPTY = 0;
var SNAKE = 1;
var FRUIT = 2;

//DIRECTIONS
var LEFT = 0;
var UP = 1;
var RIGHT = 2;
var DOWN = 3;

//KEYCODES
var SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

var grid = {

	width: null,
	height: null,
	_grid: null,

	init: function(dir, columns, rows){
		this.width = columns;
		this.height = rows;


		this._grid = [];
		for(var x = 0; x < columns; x++){
			this._grid.push([]);
			for(var y = 0; y < rows; y++){
				this._grid[x].push(dir);
			}
		}
	},

	set: function(val, x ,y){
		this._grid[x][y] = val;
	},

	get: function(x, y){
		return this._grid[x][y];
	}
}

var snake = {

	direction: null,
	last: null,
	_queue: null,


	init: function(dir, startX, startY){
		this.direction = dir;

		this._queue = [];
		this.insert(startX, startY);
	},

	insert: function(x, y){
		this._queue.unshift({
			x:x,
			y:y
		});

		this.last = this._queue[0];
	},

	remove: function(){
		return this._queue.pop();
	}
}

function setFood(){
	var empty = [];
	for(var x = 0; x < grid.width; x++){
		for(var y = 0; y < grid.height; y++){
			if(grid.get(x, y) === EMPTY){
				empty.push({
					x:x,
					y:y
				});
			}
		}
	}

	var randPos = empty[Math.floor(Math.random()*empty.length)];
	grid.set(FRUIT, randPos.x, randPos.y);
}

window.addEventListener("keydown", checkKeyPressed, false);
 
function checkKeyPressed(e) {
    if (e.keyCode == "32") {
        start();
    }
}

//GAME OBJECTS
var canvas;
var ctx;
var keyState;
var frames;
var score;
var started;


function main(){
	canvas = document.createElement("canvas");
	canvas.width = COLS*20;
	canvas.height = ROWS*20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	

	started = false;
	frames = 0;
	keyState = {};

	document.addEventListener("keydown", function(evt){
		keyState[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt){
		delete keyState[evt.keyCode];
	});

	init();
	loop();
}

function init(){
	score = 0;
	grid.init(EMPTY, COLS, ROWS);

	var startPos = {x:Math.floor(COLS/2), y:Math.floor(ROWS/2)};
	snake.init(RIGHT, startPos.x, startPos.y);
	grid.set(SNAKE, startPos.x, startPos.y);

	setFood();
	draw();
}

function start(){
	started = true;
}

function loop(){
	if(started){
		update();
		draw();
	}

	window.requestAnimationFrame(loop, canvas);
}

function update(){
	frames++;

	if(keyState[KEY_LEFT] && snake.direction !== RIGHT){
		snake.direction = LEFT;
	} else if(keyState[KEY_UP] && snake.direction !== DOWN){
		snake.direction = UP;
	} else if(keyState[KEY_RIGHT] && snake.direction !== LEFT){
		snake.direction = RIGHT;
	} else if(keyState[KEY_DOWN] && snake.direction !== UP){
		snake.direction = DOWN;
	}

	if(frames%5 === 0){
		var newX = snake.last.x;
		var newY = snake.last.y;

		switch(snake.direction){
			case LEFT:
				newX--;
				break;
			case UP:
				newY--;
				break;
			case RIGHT:
				newX++;
				break;
			case DOWN:
				newY++;
				break;
		}

		if((newX < 0 || newX > grid.width-1) || (newY < 0 || newY > grid.height-1) || grid.get(newX, newY) === SNAKE){
			started = false;
			init();
			return;
		}

		if(grid.get(newX, newY) === FRUIT){
			var tail = {
				x:newX,
				y:newY,
			};
			score++;
			setFood();
		} else {
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
			tail.x = newX;
			tail.y = newY;
		}

		grid.set(SNAKE, tail.x, tail.y);

		snake.insert(tail.x, tail.y);
	}
}

function draw(){
	var tWidth = canvas.width/grid.width;
	var tHeight = canvas.height/grid.height;



	for(var x = 0; x < grid.width; x++){
		for(var y = 0; y < grid.height; y++){
			switch (grid.get(x,y)){
				case EMPTY:
					ctx.fillStyle = "#000";
					break;
				case SNAKE:
					ctx.fillStyle = "#0f0";
					break;
				case FRUIT:
					ctx.fillStyle = "#ff0";
					break;
			}
			ctx.fillRect(x*tWidth, y*tHeight, tWidth, tHeight);
		}
	}

	if(!started){
		ctx.font = "30px Helvetica";
		ctx.fillStyle = "#FFF";
		ctx.fillText("Hit Space to Start", canvas.width/4, (canvas.height/8));
	}

	ctx.font = "300px Helvetica";

	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.fillText(score, canvas.width/3, (canvas.height/4)*2.5);

}

main();