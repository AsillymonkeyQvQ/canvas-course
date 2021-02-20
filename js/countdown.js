var WINDOW_WIDTH = 0;
var WINDOW_HEIGHT = 0;
var RADIUS = 0;
var MARGIN_TOP = 0;
var MARGIN_LEFT = 0;
var END_MARGIN_TOP = 0;
var FLAG = true;

const endTime = new Date(2021, 1, 20, 20, 55, 0);
var curShowTimeSeconds = 0;

var balls = [];
const colors = ["#33b5e5", "#0099cc", "#aa66cc", "#9933cc", "#99cc00", "#669900", "#ffbb33", "#ff8800", "#ff4444", "#cc0000"];

window.onload = function() {
    curShowTimeSeconds = getCurrentShowTimeSeconds();

    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;

    if (curShowTimeSeconds > 0) {
        MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
        RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
        MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);
    } else {
        MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
        RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 128) - 1;
        MARGIN_TOP = WINDOW_HEIGHT;
        END_MARGIN_TOP = Math.round(WINDOW_HEIGHT / 2 - 16 * (RADIUS + 1));
    }

    var canvas = document.getElementById("canvas");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    var context = canvas.getContext("2d");

    setInterval(function() {
        render(context);
        update();
    }, 50);
}

function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret / 1000);

    return ret >= 0 ? ret : 0;
}

function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    if (nextShowTimeSeconds > 0) {
        var nextHours = parseInt(nextShowTimeSeconds / 3600);
        var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
        var nextSeconds = nextShowTimeSeconds % 60;

        var curHours = parseInt(curShowTimeSeconds / 3600);
        var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
        var curSeconds = curShowTimeSeconds % 60;

        if (nextSeconds != curSeconds) {
            if (parseInt(nextHours / 10) != parseInt(curHours / 10)) {
                addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
            }
            if (parseInt(nextHours % 10) != parseInt(curHours % 10)) {
                addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
            }

            if (parseInt(nextMinutes / 10) != parseInt(curMinutes / 10)) {
                addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
            }
            if (parseInt(nextMinutes % 10) != parseInt(curMinutes % 10)) {
                addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
            }

            if (parseInt(nextSeconds / 10) != parseInt(curSeconds / 10)) {
                addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
            }
            if (parseInt(nextSeconds % 10) != parseInt(curSeconds % 10)) {
                addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds % 10));
            }
        }

        updateBalls();
    } else {
        if (FLAG) {
            MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
            RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 128) - 1;
            MARGIN_TOP = WINDOW_HEIGHT;
            END_MARGIN_TOP = Math.round(WINDOW_HEIGHT / 2 - 16 * (RADIUS + 1));
            FLAG = false;
        }
        if (MARGIN_TOP >= END_MARGIN_TOP) {
            MARGIN_TOP -= 10;
        }
    }

    curShowTimeSeconds = nextShowTimeSeconds;
}

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = balls[i].vy * -0.75;
        }
    }

    var cnt = 0;
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
            balls[cnt++] = balls[i];
        }
    }
    while (balls.length > cnt) {
        balls.pop();
    }
}

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num].length; j++) {
            if (digit[num][i][j] == 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                balls.push(aBall);
            }
        }
    }
}

function render(cxt) {
    cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height);

    if (curShowTimeSeconds > 0) {
        var hours = parseInt(curShowTimeSeconds / 3600);
        var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
        var seconds = curShowTimeSeconds % 60;

        renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
        renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);
        renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
        renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
        renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
        renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
        renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
        renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);

        for (var i = 0; i < balls.length; i++) {
            cxt.fillStyle = balls[i].color;

            cxt.beginPath();
            cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI);
            cxt.closePath();

            cxt.fill();
        }
    } else {
        renderAlphabet(MARGIN_LEFT + 24 * (RADIUS + 1), MARGIN_TOP, 'H', cxt);
        renderAlphabet(MARGIN_LEFT + 40 * (RADIUS + 1), MARGIN_TOP, 'A', cxt);
        renderAlphabet(MARGIN_LEFT + 56 * (RADIUS + 1), MARGIN_TOP, 'P', cxt);
        renderAlphabet(MARGIN_LEFT + 72 * (RADIUS + 1), MARGIN_TOP, 'P', cxt);
        renderAlphabet(MARGIN_LEFT + 88 * (RADIUS + 1), MARGIN_TOP, 'Y', cxt);
        renderAlphabet(MARGIN_LEFT + 0 * (RADIUS + 1), MARGIN_TOP + 16 * (RADIUS + 1), 'B', cxt);
        renderAlphabet(MARGIN_LEFT + 16 * (RADIUS + 1), MARGIN_TOP + 16 * (RADIUS + 1), 'I', cxt);
        renderAlphabet(MARGIN_LEFT + 32 * (RADIUS + 1), MARGIN_TOP + 16 * (RADIUS + 1), 'R', cxt);
        renderAlphabet(MARGIN_LEFT + 48 * (RADIUS + 1), MARGIN_TOP + 16 * (RADIUS + 1), 'T', cxt);
        renderAlphabet(MARGIN_LEFT + 64 * (RADIUS + 1), MARGIN_TOP + 16 * (RADIUS + 1), 'H', cxt);
        renderAlphabet(MARGIN_LEFT + 80 * (RADIUS + 1), MARGIN_TOP + 16 * (RADIUS + 1), 'D', cxt);
        renderAlphabet(MARGIN_LEFT + 96 * (RADIUS + 1), MARGIN_TOP + 16 * (RADIUS + 1), 'A', cxt);
        renderAlphabet(MARGIN_LEFT + 112 * (RADIUS + 1), MARGIN_TOP + 16 * (RADIUS + 1), 'Y', cxt);
    }
}

function renderDigit(x, y, num, cxt) {
    cxt.fillStyle = "rgb(0, 102, 153)";

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                cxt.beginPath();
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}

function renderAlphabet(x, y, c, cxt) {
    var num = c.charCodeAt(0) - 'A'.charCodeAt(0);

    cxt.fillStyle = colors[Math.floor(Math.random() * colors.length)];

    for (var i = 0; i < alphabet[num].length; i++) {
        for (var j = 0; j < alphabet[num][i].length; j++) {
            if (alphabet[num][i][j] == 1) {
                cxt.beginPath();
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();

                cxt.fill();
            }
        }
    }

}