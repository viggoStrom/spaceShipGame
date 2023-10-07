/** @type {HTMLCanvasElement} */

canvas = document.getElementById("main")

canvas.addEventListener("mousedown", (event) => {
    updateBuffer.push(new marker(event.offsetX, event.offsetY))
})

class marker {
    constructor(x, y) {
        this.x = (x / canvas.clientWidth) * canvas.width
        this.y = (y / canvas.clientHeight) * canvas.height
        this.id = Date.now()
    }

    draw() {
        ctx.strokeStyle = "green"
        ctx.lineWidth = 10
        ctx.moveTo(this.x + 25, this.y)
        ctx.arc(this.x, this.y, 25, 0, Math.PI * 2)
        ctx.stroke()
    }

    update() {
        this.draw()
    }
}