/** @type {HTMLCanvasElement} */

canvas = document.getElementById("main")


class Player {
    constructor(name) {
        updateBuffer.push(this)

        this.name = name
        this.id = "player," + ((Date.now() % Math.PI) * name.length).toString().replace(".", "")

        this.hasControlOf = []
        this.markers = []

        canvas.addEventListener("mousedown", (event) => {
            let newestMarker;

            switch (event.button) {
                case 0: // Left Click
                    newestMarker = new MoveMarker(event.offsetX, event.offsetY, this.id)
                    break;

                case 2: // Right Click
                    newestMarker = new AttackMarker(event.offsetX, event.offsetY, this.id)
                    break

                default:
                    break;
            }

            this.markers.push(newestMarker)
        })
    }

    possess(ship) {
        this.hasControlOf.push(ship)
    }

    update() {
        this.markers.forEach(marker => {
            if (marker.opacity <= 0.02) {
                this.markers.shift()
            }
            marker.update()
        })
    }
}

class BaseMarker {
    constructor(x, y, id) {
        this.x = (x / canvas.clientWidth) * canvas.width
        this.y = (y / canvas.clientHeight) * canvas.height
        this.id = "marker," + id
        this.opacity = 1
        this.color = "gray"
    }

    draw() {
        ctx.strokeStyle = this.color
        ctx.lineWidth = 5
        ctx.moveTo(this.x + 40, this.y)
        ctx.arc(this.x, this.y, 40, 0, Math.PI * 2)
        ctx.moveTo(this.x + 16, this.y)
        ctx.arc(this.x, this.y, 16, 0, Math.PI * 2)
        ctx.globalAlpha = this.opacity
        ctx.stroke()
        ctx.globalAlpha = 1
    }

    update() {
        this.opacity -= .01

        this.draw()
    }
}

class MoveMarker extends BaseMarker {
    constructor(x, y, id) {
        super(x, y, id)
        this.color = "green"
    }
}

class AttackMarker extends BaseMarker {
    constructor(x, y, id) {
        super(x, y, id)
        this.color = "red"
    }
}