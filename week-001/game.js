const container = document.getElementById('game-container');
const cells = [];
const gridSize = 20;
let snake = [{x: 9, y: 9}];
let pill = {};
let direction = 'right';

function createGrid() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            container.appendChild(cell);
            cells.push({x, y, element: cell});
        }
    }
}

function getCell(x, y) {
    return cells.find(cell => cell.x === x && cell.y === y);
}

function moveSnake() {
    const head = snake[0];
    let newX = head.x;
    let newY = head.y;

    switch (direction) {
        case 'up':
            newY--;
            break;
        case 'down':
            newY++;
            break;
        case 'left':
            newX--;
            break;
        case 'right':
            newX++;
            break;
    }

    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        return false;
    }

    const newHead = getCell(newX, newY);
    if (!newHead || snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return false;
    }

    snake.unshift(newHead);

    if (newHead.x === pill.x && newHead.y === pill.y) {
        placePill();
    } else {
        const tail = snake.pop();
        if (tail && tail.element) {
            tail.element.classList.remove('snake-segment');
            tail.element.style.backgroundColor = ''; // Zurücksetzen der Hintergrundfarbe
        }
    }

    snake.forEach((segment, index) => {
        segment.element.classList.add('snake-segment');
        updateSnakeSegmentColor(segment, index, snake.length);
    });

    return true;
}


function placePill() {
    let availableCells = cells.filter(cell => !snake.some(segment => segment.x === cell.x && segment.y === cell.y));
    const pillCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (pill.element) {
        pill.element.classList.remove('pill');
    }
    pillCell.element.classList.add('pill');
    pill = pillCell;
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
}

function gameLoop() {
    if (!moveSnake()) {
        alert('Game Over');
        return;
    }
    setTimeout(gameLoop, 200);
}

function updateSnakeSegmentColor(segment, index, length) {
    const gradientStart = [0, 255, 0]; // RGB-Werte für den Start des Farbverlaufs (hier grün)
    const gradientEnd = [255, 0, 0]; // RGB-Werte für das Ende des Farbverlaufs (hier rot)
    const ratio = index / length;

    const r = gradientStart[0] + ratio * (gradientEnd[0] - gradientStart[0]);
    const g = gradientStart[1] + ratio * (gradientEnd[1] - gradientStart[1]);
    const b = gradientStart[2] + ratio * (gradientEnd[2] - gradientStart[2]);

    segment.element.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

createGrid();
placePill();
gameLoop();
document.addEventListener('keydown', changeDirection);

