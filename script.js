const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const scale = 20;  
const rows = canvas.height / scale;
const cols = canvas.width / scale;

let snake;

(function setup() {
    canvas.width = 400;
    canvas.height = 400;

    snake = new Snake();
    food = new Food();

    food.pickLocation();

    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        food.draw();
        snake.update();
        snake.draw();
        scoreElement.innerText = `Punteggio: ${snake.score}`;

        if (snake.eat(food)) {
            food.pickLocation();
        }

        snake.checkCollision();
    }, 250);
}());

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];
    this.score = 0;

    this.draw = function() {
        ctx.fillStyle = "#50C877";

        for (let i=0; i<this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function() {
        for (let i=0; i<this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i+1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Impedisce al serpente di uscire dai confini
        if (this.x >= canvas.width) this.x = 0;
        if (this.y >= canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width - scale;
        if (this.y < 0) this.y = canvas.height - scale; 
    };

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(food) {
        if (this.x === food.x && this.y === food.y) {
            this.total++;
            this.score += 10;
            return true;
        }

        return false;
    };

    this.checkCollision = function() {
        for (let i=0; i<this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                window.alert(`Game Over! Punteggio finale: ${this.score}`);
                this.total = 0;
                this.tail = [];
                this.score = 0;
            }
        }
    };
}

function Food() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * cols - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    };

    this.draw = function() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}

window.addEventListener('keydown', (evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

function changeDirection(direction) {
    snake.changeDirection(direction);
}