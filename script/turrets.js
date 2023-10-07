/** @type {HTMLCanvasElement} */

canvas = document.getElementById("main")


class baseTurret {
    constructor(x, y, offset = { x: 0, y: 0 }, dir = { limit: [-Math.PI, Math.PI], initial: 0 }, specs = { damage: 0, powerDraw: 0, ionDamage: 0 }) {
        const self = this
        this.lastMouse = [10000, 1000]
        this.specs = specs
        this.x = {
            pos: x,
            offset: offset.x,
        }
        this.y = {
            pos: y,
            offset: offset.y,
        }
        this.rot = {
            vel: 0,
            acc: 0.01,
            topVel: 0.45,
            limit: {
                rad: dir.limit,
            },
            offset: dir.initial,
            rad: dir.initial,
        }

        this.tool = {
            roundRect(x, y, w, h, corner = 10) {
                ctx.save()
                ctx.beginPath()
                ctx.translate(self.x.pos, self.y.pos)
                ctx.rotate(self.rot.rad + self.rot.offset)
                ctx.roundRect(x - self.x.pos, y - self.y.pos, w, h, corner)
                ctx.closePath()
                ctx.fill()
                ctx.restore()
            },
            beginPath() {
                ctx.save()
                ctx.beginPath()
                ctx.translate(self.x.pos, self.y.pos)
                ctx.rotate(self.rot.rad + self.rot.offset)
            },
            closePath() {
                ctx.closePath()
                ctx.restore()
            },
        }

        canvas.addEventListener("mousemove", event => this.aimAt(event.offsetX, event.offsetY))
    }

    aimAt(x, y, manual = false) {
        this.lastMouse = [x, y]

        const computedCanvasWidth = canvas.computedStyleMap().get("max-width").value
        const computedCanvasHeight = computedCanvasWidth * (9 / 16)
        const deltaX = x * (canvas.width / computedCanvasWidth) - this.x.pos
        const deltaY = y * (canvas.height / computedCanvasHeight) - this.y.pos

        if (deltaX < 0) {
            this.rot.rad = Math.atan(deltaY / deltaX) - Math.PI
        } else {
            this.rot.rad = Math.atan(deltaY / deltaX)
        }
    }

    draw() {
        // Base
        this.tool.beginPath()
        ctx.fillStyle = "rgb(80,80,80)"
        ctx.arc(0, 0, 13, 0, Math.PI * 2)
        ctx.fill()
        this.tool.closePath()
        this.tool.beginPath()
        ctx.fillStyle = "rgb(60,60,60)"
        ctx.arc(0, 0, 10, 0, Math.PI * 2)
        ctx.fill()
        this.tool.closePath()
    }

    update(x, y, dir) {
        this.aimAt(this.lastMouse[0], this.lastMouse[1], true)
        this.draw()
        this.debug()

        this.x.pos = x + this.x.offset
        this.y.pos = y + this.y.offset
        this.rot.offset = dir
    }

    debug() {
        // Center
        this.tool.beginPath()
        ctx.fillStyle = "blue"
        ctx.arc(0, 0, 10, 0, Math.PI * 2)
        ctx.fill()
        this.tool.closePath()

        // Arrow
        ctx.beginPath()
        ctx.moveTo(this.x.pos, this.y.pos)
        ctx.lineTo(this.x.pos + Math.cos(this.rot.rad) * 70, this.y.pos + Math.sin(this.rot.rad()) * 70)
        ctx.strokeStyle = "red"
        ctx.lineWidth = 7
        ctx.lineCap = "round"
        ctx.stroke()
        ctx.closePath()

        // Firing Arc
        ctx.beginPath()
        ctx.moveTo(this.x.pos, this.y.pos)
        ctx.arc(this.x.pos, this.y.pos, 100, this.rot.limit.rad[0] + this.rot.offset, 0)
        ctx.arc(this.x.pos, this.y.pos, 100, this.rot.offset, this.rot.limit.rad[1])
        ctx.fillStyle = "red"
        ctx.globalAlpha = 0.4
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.closePath()
    }
}