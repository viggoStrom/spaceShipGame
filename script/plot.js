/** @type {HTMLCanvasElement} */

const plotCanvas = document.getElementById("plot")
plotCanvas.width = 360 * 1.1

class plot {
    constructor(xList, yList) {
        this.x = xList
        this.y = yList
        this.length = this.x.length
    }

    plot() {
        ctx.moveTo(0, 0)
        ctx.beginPath()
        for (let index = 0; index < this.length; index++) {
            ctx.lineTo(this.x[index], y[index])
        }
    }
}