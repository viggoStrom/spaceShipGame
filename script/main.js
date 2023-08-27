/** @type {HTMLCanvasElement} */

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 1920
canvas.height = canvas.width * (9 / 16)

const testShip = new baseShip(600, 300)

const frame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    testShip.update()

    return window.requestAnimationFrame(frame)
}

window.requestAnimationFrame(frame)