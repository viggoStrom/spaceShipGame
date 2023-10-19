/** @type {HTMLCanvasElement} */

canvas = document.getElementById("main")


class BaseShip {
    constructor(x, y, direction = 0) {
        updateBuffer.push(this)

        const self = this        
        
        this.skin = new Image()
        this.skin.src = "./assets/ships/VenatorClassStarDestroyer.png"

        this.x = {
            pos: x,
            vel: 0,
            acc: 0.005,
            topVel: 1,
            drag() {
                // Function constructed via Desmos
                const a = 7.92486
                const b = 0.0360118
                const x = Math.abs(this.vel)
                return b * (a ** x) * 0.01
            }
        }
        this.y = {
            pos: y,
            vel: 0,
            acc: 0.005,
            topVel: 1,
            drag() {
                // Function constructed via Desmos
                const a = 7.92486
                const b = 0.0360118
                const x = Math.abs(this.vel)
                return b * (a ** x) * 0.01
            }
        }
        this.rot = {
            vel: 0,
            acc: 0.00010,
            topVel: 0.01,
            rad: direction,
            drag: 0.00005,
        }

        this.turrets = [
            // new baseTurret(this.x.pos, this.y.pos, { x: -40, y: +65 }, { limit: [-100, 100], initial: 15 }),
        ]

        this.tool = {
            roundRect(x, y, w, h, corner = 10) {
                ctx.save()
                ctx.beginPath()
                ctx.translate(self.x.pos, self.y.pos)
                ctx.rotate(self.rot.rad)
                ctx.roundRect(x - self.x.pos, y - self.y.pos, w, h, corner)
                ctx.closePath()
                ctx.fill()
                ctx.restore()
            },
            beginPath() {
                ctx.save()
                ctx.beginPath()
                ctx.translate(self.x.pos, self.y.pos)
                ctx.rotate(self.rot.rad)
            },
            closePath() {
                ctx.closePath()
                ctx.restore()
            },
        }

        window.addEventListener("keydown", event => this.setKey(event))
        window.addEventListener("keyup", event => this.setKey(event))
        this.keyStates = {
            "w": false, // Fly Forward
            "s": false, // Fly Backward
            "a": false, // Turn Left
            "d": false, // Turn Right
            "q": false, // Strafe left
            "e": false, // Strafe Right
            " ": false, // Fire
            "Shift": false, // IDK
            "Control": false, // IDK
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
        // Add Velocities
        this.x.pos += this.x.vel
        this.y.pos += this.y.vel
        this.rot.rad += this.rot.vel

        // Movement
        if (this.keyStates.w) {
            if (this.x.vel <= this.x.topVel) {
                this.x.vel += Math.cos(this.rot.rad) * this.x.acc
            }
            if (this.y.vel <= this.y.topVel) {
                this.y.vel += Math.sin(this.rot.rad) * this.y.acc
            }
        } else if (this.keyStates.s) {
            if (this.x.vel <= this.x.topVel) {
                this.x.vel -= Math.cos(this.rot.rad) * this.x.acc * 0.6
            }
            if (this.y.vel <= this.y.topVel) {
                this.y.vel -= Math.sin(this.rot.rad) * this.y.acc * 0.6
            }
        }

        // Strafe
        if (this.keyStates.q) {
            const xVel = Math.sin(this.rot.rad) * this.x.acc * 0.5
            const yVel = Math.sin(this.rot.rad - Math.PI / 2) * this.y.acc * 0.5

            if (this.x.vel >= -this.x.topVel) {
                this.x.vel += xVel
            } else if (this.x.vel <= this.x.topVel) {
                this.x.vel -= xVel
            }
            if (this.y.vel >= -this.y.topVel) {
                this.y.vel += yVel
            } else if (this.y.vel <= this.y.topVel) {
                this.y.vel -= yVel
            }

        } else if (this.keyStates.e) {
            const xVel = Math.sin(-this.rot.rad) * this.x.acc * 0.5
            const yVel = Math.sin(Math.PI / 2 - this.rot.rad) * this.y.acc * 0.5

            if (this.x.vel >= -this.x.topVel) {
                this.x.vel += xVel
            } else if (this.x.vel <= this.x.topVel) {
                this.x.vel -= xVel
            }
            if (this.y.vel >= -this.y.topVel) {
                this.y.vel += yVel
            } else if (this.y.vel <= this.y.topVel) {
                this.y.vel -= yVel
            }
        }

        // Drag
        if (this.x.vel >= 0) {
            this.x.vel -= this.x.drag()
        } else if (this.x.vel < 0) {
            this.x.vel += this.x.drag()
        }
        if (this.y.vel >= 0) {
            this.y.vel -= this.y.drag()
        } else if (this.y.vel < 0) {
            this.y.vel += this.y.drag()
        }


        // Rotation
        if (this.keyStates.a && this.rot.vel < this.rot.topVel) {
            this.rot.vel -= this.rot.acc
        }
        else if (this.keyStates.d && this.rot.vel > -this.rot.topVel) {
            this.rot.vel += this.rot.acc
        }
        // Drag
        if (this.rot.vel >= 0) {
            this.rot.vel -= this.rot.drag
        } else if (this.rot.vel < 0) {
            this.rot.vel += this.rot.drag
        }
    }

    draw() {
        ctx.moveTo(this.x.pos, this.y.pos)
        this.tool.beginPath()
        ctx.drawImage(this.skin, 0-180, 0-113)
        this.tool.closePath()
    }

    update() {
        // May not be necessary but, better safe than sorry 
        this.rot.rad = this.rot.rad % (2 * Math.PI)

        this.draw()
        this.debug()
        this.move()

        this.turrets.forEach(turret => turret.update(this.x.pos, this.y.pos, this.rot.rad))
    }

    debug() {
        // Stat Read-out
        const spanTags = document.querySelectorAll("body div p span")
        spanTags[0].innerHTML = this.x.vel.toFixed(2)
        spanTags[1].innerHTML = this.y.vel.toFixed(2)
        spanTags[2].innerHTML = this.x.pos.toFixed(2)
        spanTags[3].innerHTML = this.y.pos.toFixed(2)
        spanTags[4].innerHTML = this.rot.vel.toFixed(5)
        spanTags[5].innerHTML = this.rot.rad.toFixed(5)

        // Center
        ctx.beginPath()
        ctx.fillStyle = "orange"
        ctx.arc(this.x.pos, this.y.pos, 40, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()

        // X velocity
        ctx.beginPath()
        ctx.moveTo(this.x.pos, this.y.pos)
        ctx.lineTo(this.x.pos + this.x.vel * 100, this.y.pos)
        ctx.lineCap = "round"
        ctx.strokeStyle = "green"
        ctx.lineWidth = 8
        ctx.stroke()
        ctx.closePath()

        // Y velocity
        ctx.beginPath()
        ctx.moveTo(this.x.pos, this.y.pos)
        ctx.lineTo(this.x.pos, this.y.pos + this.y.vel * 100)
        ctx.lineWidth = 8
        ctx.lineCap = "round"
        ctx.strokeStyle = "blue"
        ctx.stroke()
        ctx.closePath()
    }
}
