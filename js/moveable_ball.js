// Copyright 2021 JadeRay
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var config = {
    speedMin: -5,
    speedMax: 5,
    ballMin: 10,
    ballMax: 20,
    ballCount: 5,
    restoredTime: 200,
    infectedRat: 1,
    iteration: 500
};

var pandemic_status = {
    Normal: "rgb(30, 144, 255)",
    infected: "rgb(227, 23, 13)",
    restored: "rgb(128, 128, 128)"
};

class Ball {
    constructor(x, y, velX, velY, size, status) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.status = status;
        this.size = size;
        this.infectedTime = 0
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.status;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    update(WIDTH, HEIGHT) {
        if ((this.x + this.size) >= WIDTH || (this.x - this.size) <= 0) {
            this.velX = -this.velX;
        }
        if ((this.y + this.size) >= HEIGHT || (this.y - this.size) <= 0) {
            this.velY = -this.velY;
        }

        this.x += this.velX;
        this.y += this.velY;

        if (this.status == pandemic_status.infected) {
            if (this.infectedTime == config.restoredTime) {
                this.status = pandemic_status.restored;
            }
            this.infectedTime++;
        }
    }
    collisionDetect(balls) {
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
                    var xx_yy = dx * dx + dy * dy;
                    var v_dvx = (dvx * dx * dx + dvy * dx * dy) / xx_yy;
                    var v_dvy = (dvy * dy * dy + dvx * dx * dy) / xx_yy;
                    this.velX = checkSpeed(this.velX - v_dvx);
                    this.velY = checkSpeed(this.velY - v_dvy);
                    ball.velX = checkSpeed(ball.velX + v_dvx);
                    ball.velY = checkSpeed(ball.velY + v_dvy);
                    
                    if ((this.status == pandemic_status.infected) && (ball.status == pandemic_status.Normal)) {
                        if (Math.random() < config.infectedRat) {
                            ball.status = pandemic_status.infected;
                        }
                    }
                }
            }
        }
    }
}


function checkSpeed(speed) {
    if (speed > config.speedMax) {
        speed = config.speedMax;
    } else if (speed < config.speedMin) {
        speed = config.speedMin;
    }
    return speed;
}