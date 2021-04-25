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

var simulator = function(simulatorId, ball_count, canvas_height) {
    var simulator = document.getElementById(simulatorId);
    var canvas = simulator.getElementsByTagName('canvas')[0];
    var chart = simulator.getElementsByTagName('canvas')[1];
    var ctx = canvas.getContext("2d");
    var chart_ctx = chart.getContext("2d");
    var WIDTH = simulator.clientWidth;
    var HEIGHT = canvas_height;
    canvas.height = HEIGHT;
    canvas.width = WIDTH
    chart.height = 400;
    chart.width = WIDTH;

    ctx.clearRect(0, 0, ctx.width, ctx.height);
    chart_ctx.clearRect(0, 0, chart_ctx.width, chart_ctx.height);

    var myChart = new Chart(chart_ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets : [
                {
                    label: '正常状态',
                    data: [],
                    borderColor: 'rgba(30, 144, 255, 0)',
                    backgroundColor: 'rgba(30, 144, 255, .5)',
                    fill: true
                },
                {
                    label: '感染状态',
                    data: [],
                    borderColor: 'rgba(227, 23, 13, 0)',
                    backgroundColor: 'rgba(227, 23, 13, .5)',
                    fill: true
                },
                {
                    label: '痊愈状态',
                    data: [],
                    borderColor: 'rgba(128, 128, 128, 0)',
                    backgroundColor: 'rgba(128, 128, 128, .5)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: '传染病感染人数'
              },
              tooltip: {
                mode: 'index'
              },
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Month'
                }
              },
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: 'Value'
                }
              }
            }
        }
    });

    var balls = [];
    var createdBalls = [];

    var loop = function loop(iteration) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        while (balls.length < ball_count) {
            var b_var = createBall(WIDTH, HEIGHT);
            var ball = new Ball(
                b_var.x,
                b_var.y,
                random(config.speedMin, config.speedMax),
                random(config.speedMin, config.speedMax),
                b_var.r,
                pandemic_status.Normal
            );
            balls.push(ball);
        }
        if (balls[0].status == pandemic_status.Normal) {
            balls[0].status = pandemic_status.infected
        }

        for (var i = 0; i < balls.length; i++) {
            balls[i].draw(ctx);
            balls[i].collisionDetect(balls);
            balls[i].update(WIDTH, HEIGHT);
        }
        
        if ( iteration % 20 == 0) {
            updateChart(iteration);
        }
        if (iteration < config.iteration) {
            requestAnimationFrame(function() {
                loop(++iteration);
            });
        }    
    }

    function random (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function createBall() {
        var x = random(0, WIDTH);
        var y = random(0, HEIGHT);
        var r = 15;
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

    var updateChart = function(iteration) {
        var num_normal = 0;
        var num_infected = 0;
        var num_restored = 0;

        for (var i = 0; i < balls.length; i++) {
            if (balls[i].status == pandemic_status.Normal) {
                num_normal++;
            } else if (balls[i].status == pandemic_status.infected) {
                num_infected++;
            } else {
                num_restored++;
            }
        }

        myChart.data.labels.push(iteration.toString());
        myChart.data.datasets[0].data.push(num_normal);
        myChart.data.datasets[1].data.push(num_infected);
        myChart.data.datasets[2].data.push(num_restored);
        myChart.update();
    }

    loop(0);
}