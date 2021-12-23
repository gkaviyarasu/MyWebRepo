import CANVASBALLOON from "./balloon";
import Canfetti from "./canfetti";
function AnimationManager(canvas, numBalloons, colors) {
    this.canvas = canvas;
    this.numOfBalloons = numBalloons;
    this.colors = colors;
    this.balloons = [];
    this.timeoutHandler = undefined;
    this.timeoutInterval = 10;
    this.maxRadius = 80;
    this.minRadius = 50;
    this.canfetti = new Canfetti(canvas);
    this.drawCanfetti = false;
    this.canfettiStarted = false;
    return this;
}

AnimationManager.prototype.renderBalloons = function () {
    for (let n = 0; n < this.numOfBalloons; n++) {
        this.renderBalloon();
    }
}

AnimationManager.prototype.renderBalloon = function (fromBottom) {
    let radius = this.minRadius + (Math.random() * (this.maxRadius - this.minRadius));
    let xPos = Math.random() * this.canvas.width;
    let yPos;
    if (!fromBottom) {
        yPos = Math.random() * this.canvas.height;
    } else {
        yPos = this.canvas.height + radius;
    }
    let numColors = this.colors.length;
    let colorIndex = Math.random() * (numColors - 1);
    colorIndex = Math.round(colorIndex);
    let color = this.colors[colorIndex];
    let balloon = new CANVASBALLOON.Balloon(this.canvas, xPos, yPos, radius, color);
    balloon.draw();
    this.balloons.push(balloon);
}

AnimationManager.prototype.clearCanvas = function () {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

AnimationManager.prototype.setRedrawTimeInterval = function (interval) {
    this.timeoutInterval = interval;
    this.timeoutHandler = setTimeout(() => this.redrawBalloons(), interval);
}
AnimationManager.prototype.cancelRedraw = function () {
    clearTimeout(this.timeoutHandler);
}
AnimationManager.prototype.redrawBalloons = function () {
    if (!this.balloons.length) {
        this.renderBalloons();
    } else {
        this.clearCanvas();
        let nullBaloons = 0;
        for (let i = 0; i < this.balloons.length; i++) {
            const balloon = this.balloons[i];
            if (balloon != null) {
                let x = this.getNewXCoordinate(balloon);
                let y = this.getNewYCoordinate(balloon, i);
                balloon.centerX = x;
                balloon.centerY = y;
                balloon.draw();
            } else {
                nullBaloons++;
            }
        }
        if(nullBaloons > 4 * this.numOfBalloons) {
            this.balloons = this.balloons.filter(b => b)
        }
    }

    //re-draw canfetti
    if(this.drawCanfetti) {
        if(this.canfettiStarted) {
            this.canfetti.runAnimation();
        } else {
            this.canfetti.startConfetti();
            this.canfettiStarted = true;
        }
    }
    this.setRedrawTimeInterval(this.timeoutInterval);
}

AnimationManager.prototype.getNewXCoordinate = function (balloon) {
    return Math.round(balloon.originalX + 15 * Math.sin(balloon.centerY * Math.PI / 90));
}

AnimationManager.prototype.getNewYCoordinate = function (balloon, index) {
    if (balloon.centerY < -balloon.radius) {
        this.balloons[index] = null;
        this.renderBalloon(true);
    }
    return balloon.centerY - 1.5;
}

export default AnimationManager;