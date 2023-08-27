/** @type {HTMLCanvasElement} */

canvas = document.querySelector("canvas")


class baseShip {
    constructor(x, y, direction = 0) {
        const self = this

        this.x = {
            pos: x,
            vel: 0,
            acc: 0.005,
            topVel: 1,
        }
        this.y = {
            pos: y,
            vel: 0,
            acc: 0.005,
            topVel: 1,
        }
        this.rot = {
            vel: 0,
            acc: 0.001,
            topVel: 1,
            deg: direction,
            rad() {
                return (self.rot.deg * Math.PI) / 180
            },
        }

        this.turrets = [
            new baseTurret(this.x.pos, this.y.pos, { x: -40, y: +65 }, { limit: [-100, 100], initial: 15 }),
        ]

        this.tool = {
            roundRect(x, y, w, h, corner = 10) {
                ctx.save()
                ctx.beginPath()
                ctx.translate(self.x.pos, self.y.pos)
                ctx.rotate(self.rot.rad())
                ctx.roundRect(x - self.x.pos, y - self.y.pos, w, h, corner)
                ctx.closePath()
                ctx.fill()
                ctx.restore()
            },
            beginPath() {
                ctx.save()
                ctx.beginPath()
                ctx.translate(self.x.pos, self.y.pos)
                ctx.rotate(self.rot.rad())
            },
            closePath() {
                ctx.closePath()
                ctx.restore()
            },
        }

        window.addEventListener("keydown", event => this.setKey(event))
        window.addEventListener("keyup", event => this.setKey(event))
        this.keyStates = {
            "w": false,
            "s": false,
            "a": false,
            "d": false,
            " ": false,
            "Shift": false,
            "Control": false,
        }
    }

    setKey(event) {
        if (event.type == "keydown") {
            this.keyStates[event.key] = true
        } else if (event.type == "keyup") {
            this.keyStates[event.key] = false
        }
    }

    move() {
        this.x.pos += this.x.vel
        this.y.pos += this.y.vel
        this.rot.deg += this.rot.vel


        if (this.keyStates.w && this.x.vel < this.x.topVel) {
            if (this.rot.deg > 90) {
                this.x.vel += this.x.acc * Math.cos(this.rot.rad() - Math.PI)
                this.y.vel += this.y.acc * Math.sin(this.rot.rad() - Math.PI)
            } else {
                this.x.vel += this.x.acc * Math.cos(this.rot.rad())
                this.y.vel += this.y.acc * Math.sin(this.rot.rad())
            }
            console.log(this.x.vel);
            console.log(this.y.vel);
        } else
            if (this.keyStates.s && this.x.vel > -this.x.topVel) {
                this.x.vel -= this.x.acc
            }

        if (this.keyStates.a && this.rot.vel < this.rot.topVel) {
            this.rot.vel -= this.rot.acc
        } else
            if (this.keyStates.d && this.rot.vel > -this.rot.topVel) {
                this.rot.vel += this.rot.acc
            }
    }

    draw() {
        ctx.fillStyle = "rgb(100,100,100)"

        ctx.moveTo(this.x.pos - 100, this.y.pos - 100)
        this.tool.beginPath()
        ctx.lineTo(-70, +100)
        ctx.lineTo(+190, +0)
        ctx.lineTo(-70, -100)
        ctx.fill()
        this.tool.closePath()
    }

    update() {
        this.draw()
        this.debug()
        this.move()

        this.turrets.forEach(turret => turret.update(this.x.pos, this.y.pos, this.rot.deg))
    }

    debug() {
        // Center
        ctx.beginPath()
        ctx.fillStyle = "orange"
        ctx.arc(this.x.pos, this.y.pos, 40, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()

        // Arrow
        ctx.beginPath()
        ctx.moveTo(this.x.pos, this.y.pos)
        ctx.lineTo(this.x.pos + Math.cos(this.rot.rad()) * 130, this.y.pos + Math.sin(this.rot.rad()) * 130)
        ctx.strokeStyle = "purple"
        ctx.lineWidth = 15
        ctx.lineCap = "round"
        ctx.stroke()
        ctx.closePath()
    }
}
