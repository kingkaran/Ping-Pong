var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
const paddle_thick = 10;
const paddle_height = 100;
var play1Score = 0;
var play2Score = 0;
const win_score = 3;

var showWinScreen = false;

function calculateMousePos(event) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = event.clientX - rect.left - root.scrollLeft;
	var mouseY = event.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(event) {
	if(showWinScreen){
		play1Score = 0;
		play2Score = 0;
		showWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('mainCanvas');
	canvasContext = canvas.getContext('2d');
	var framesPS = 30;
	setInterval(function(){
		move();
		draw();
	}, 1000/framesPS);

	canvas.addEventListener('mousedown', handleMouseClick);
	canvas.addEventListener('mousemove',
	function(event) {
		var mousePos = calculateMousePos(event);
		paddle1Y = mousePos.y - (paddle_height/2);
	});
}

function ballReset() {
	if(play1Score >= win_score || play2Score >= win_score){
		showWinScreen = true;
	}
	ballSpeedX = -ballSpeedX
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function compMove(){
	var p2center = paddle2Y + (paddle_height/2);
	if(p2center < ballY - 35)
		paddle2Y += 6;
	else if(p2center > ballY +35)
		paddle2Y -= 6;
}

function move(){
	if(showWinScreen)
		return;

	compMove();
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	if(ballX < 0) {
		if(ballY > paddle1Y && ballY < (paddle1Y + paddle_height)) {
			ballSpeedX = -ballSpeedX;
			var diffY = ballY - (paddle1Y + paddle_height/2);
			ballSpeedY = diffY * 0.35;
		}
		else {
			play2Score++; // should be updated brfore reset
			ballReset();
		}
	}
	if(ballX > canvas.width){
		if(ballY > paddle2Y && ballY < (paddle2Y + paddle_height)) {
			ballSpeedX = -ballSpeedX;
			var diffY = ballY - (paddle2Y + paddle_height/2);
			ballSpeedY = diffY * 0.35;
		}
		else {
			play1Score++; // should be updated brfore reset
			ballReset();
		}
	}

	if(ballY < 0)
		ballSpeedY = -ballSpeedY;
	if(ballY > canvas.height)
		ballSpeedY = -ballSpeedY;
}

function drawNet(){
	for(var i=0; i<canvas.height; i+=40){
		colourRect((canvas.width/2)-1, i, 2, 20, 'white');
	}
}
function draw(){
	colourRect(0, 0, canvas.width, canvas.height, 'green');
	canvasContext.fillStyle = 'red';
	canvasContext.fillText(play1Score, 100, 100);
	canvasContext.fillText(play2Score, canvas.width - 100, 100);
	if(showWinScreen){
		canvasContext.fillStyle = 'white';
		if(play1Score >= win_score){
			canvasContext.fillText("Congratulations!", 365, 250)
			canvasContext.fillText("You won the game!!!", 360, 300)
		}
		else if(play2Score >= win_score){
			canvasContext.fillText("Better luck next time!", 360, 250)
			canvasContext.fillText("Computer won the game!!!", 350, 300)
		}
		canvasContext.fillText("Click anywhere to restart!", 350, 500)
		return;
	}
	
	canvasContext.fillStyle = 'white';
	drawNet();
	colourRect(0, paddle1Y, 10, paddle_height, 'white'); // right paddle
	colourRect(canvas.width - paddle_thick, paddle2Y, paddle_thick, paddle_height, 'white'); // left paddle
	colourCircle(ballX, ballY, 10, 'red');
	//canvasContext.fillText(play1Score, 100, 100);
	//canvasContext.fillText(play2Score, canvas.width - 100, 100);
}

function colourCircle(xCenter, yCenter, radius, colour){
	canvasContext.fillStyle = colour;
	canvasContext.beginPath();
	canvasContext.arc(xCenter, yCenter, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colourRect(xLeft, yTop, wid, hei, colour){
	canvasContext.fillStyle = colour;
	canvasContext.fillRect(xLeft, yTop, wid, hei);
}