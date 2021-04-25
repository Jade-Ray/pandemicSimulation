var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

canvas.width = WIDTH;
canvas.heigh = HEIGHT;

var config = {
    speedMin: -7,
    speedMax: 7,
    ballMin: 10,
    ballMax: 20,
    ballCount: 30
};

function random (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

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

Ball.prototype.collisionDetect = function () {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        if (this !== ball) {
            var dxv = this.x + this.velX - (ball.x + ball.velX);
            var dyv = this.y + this.velY - (ball.y + ball.velY);
            var distance = Math.sqrt(dxv * dxv + dyv * dyv);
        
            if (distance <= this.size + ball.size) {

                var dvx = this.velX - ball.velX;
                var dvy = this.velY - ball.velY;
                var dx = this.x - ball.x;
                var dy = this.y - ball.y;
                var xx_yy = dx *dx + dy * dy;
                var v_dvx = (dvx * dx * dx + dvy * dx * dy) / xx_yy;
                var v_dvy = (dvy * dy * dy + dvx * dx * dy) / xx_yy;
                this.velX = checkSpeed(this.velX - v_dvx);
                this.velY = checkSpeed(this.velY - v_dvy);
                ball.velX = checkSpeed(ball.velX + v_dvx);
                ball.velY = checkSpeed(ball.velY + v_dvy);
            }
        }
    }
};

function checkSpeed(speed) {
    if (speed > config.speedMax) {
        speed = config.speedMax;
    } else if (speed < config.speedMin) {
        speed = config.speedMin;
    }
    return speed;
}

var balls = [];

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    while (balls.length < config.ballCount) {
        var b_var = createBall();
        var ball = new Ball(
            b_var.x,
            b_var.y,
            random(config.speedMin, config.speedMax),
            random(config.speedMin, config.speedMax),
            "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")",
            b_var.r
        );
        balls.push(ball);
    }

    for (var i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].collisionDetect();
        balls[i].update();
    }

    requestAnimationFrame(loop);
}

var createdBalls = [];

function createBall () {
    var x = random(0, WIDTH);
    var y = random(0, HEIGHT);
    var r = random(config.ballMin, config.ballMax);
    for (var i = 0; i < createdBalls.length; i++) {
        var dx = createdBalls[i].x - x;
        var dy = createdBalls[i].y - y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < createdBalls[i].r + r) {
            return createBall();
        }
    }
    var ball = {
        x: x,
        y: y,
        r: r,
    };
    createdBalls.push(ball);
    return ball;
}

loop();