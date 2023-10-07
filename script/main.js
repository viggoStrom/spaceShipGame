/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("main")
const ctx = canvas.getContext("2d")
canvas.width = 1920
canvas.height = canvas.width * (9 / 16)
const updateBuffer = []

const testShip = new baseShip(600, 300)
updateBuffer.push(testShip)

const frame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    updateBuffer.forEach(element => {
        element.update()
    })

    return window.requestAnimationFrame(frame)
}

window.requestAnimationFrame(frame)