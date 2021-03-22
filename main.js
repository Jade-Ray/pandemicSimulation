var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

canvas.width = WIDTH;
canvas.heigh = HEIGHT;

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
};

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function () {
    if ((this.x + this.size) >= WIDTH || (this.x - this.size) <= 0) {
        this.velX = -this.velX;
    }
    if ((this.y + this.size) >= HEIGHT || (this.y - this.size) <= 0) {
        this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
};