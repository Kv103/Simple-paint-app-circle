const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let startX = 0;
let startY = 0;
let circles = [];
let isClick = true;

function startDrawing(e) {
    isDrawing = true;
    isClick = true;
    [startX, startY] = [e.offsetX, e.offsetY];
}

function drawCircle(e) {
    if (!isDrawing) return;
    const moveX = e.offsetX;
    const moveY = e.offsetY;

    if (Math.abs(moveX - startX) > 5 || Math.abs(moveY - startY) > 5) {
        isClick = false;
    }

    const endX = e.offsetX;
    const endY = e.offsetY;
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.fillStyle = getRandomColor();
    ctx.fill();
}

function endDrawing(e) {
    if (!isDrawing) return;
    if (isClick) {
        onCanvasClick(e);
    } else {
        drawCircle(e);
        circles.push({ x: startX, y: startY, radius: Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)), color: ctx.fillStyle });
    }
    isDrawing = false;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawCircle);
canvas.addEventListener('mouseup', endDrawing);

document.getElementById('resetCanvas').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles = [];
});

function isPointInCircle(x, y, circleX, circleY, radius) {
    return Math.sqrt((x - circleX) ** 2 + (y - circleY) ** 2) < radius;
}

function showFeedback(text) {
    ctx.font = "50px Segoe UI";
    ctx.fillStyle = "#240A34";
    ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, 50);
    setTimeout(() => {
        redrawCircles(); 
    }, 500);
}

function onCanvasClick(e) {
    if (isDrawing || !isClick) return;

    const x = e.offsetX;
    const y = e.offsetY;
    let hit = false;

    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        if (isPointInCircle(x, y, circle.x, circle.y, circle.radius)) {
            hit = true;
            break;
        }
    }

    if (hit) {
        showFeedback('Hit');
    } else {
        showFeedback('Miss');
    }
}

function onCanvasDoubleClick(e) {
    const x = e.offsetX;
    const y = e.offsetY;

    for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        if (isPointInCircle(x, y, circle.x, circle.y, circle.radius)) {
            circles.splice(i, 1);
            redrawCircles();
            break;
        }
    }
}

function redrawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
    });
}

canvas.addEventListener('mousedown', (e) => {
    isClick = true;
    startDrawing(e);
});
canvas.addEventListener('mousemove', drawCircle);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('click', onCanvasClick);
canvas.addEventListener('dblclick', onCanvasDoubleClick);

// Dark Mode Toggle Functionality
document.getElementById('darkModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});
