'use strict'

var gElCanvas 
var gCtx 
var gIsMouseDown = false 

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    onClearCanvas()
}

function onDown(ev) {
    gIsMouseDown = true

    document.body.style.cursor = 'pointer'

    const pos = getEvPos(ev) 
    renderBrushStroke(pos)  
}

function onUp() {
    gIsMouseDown = false
    document.body.style.cursor = 'default'
}

function onDraw(ev) {
    if (!gIsMouseDown) return

    const pos = getEvPos(ev)
    renderBrushStroke(pos)
}

function renderBrushStroke(pos) {
    gCtx.beginPath(); 
    let {color, size, shape} = getBrush()
    if (shape === 'square') {
        gCtx.fillStyle = color
        gCtx.fillRect(pos.x, pos.y, size, size)
    } else {
        gCtx.arc(pos.x, pos.y, size, 0, 2 * Math.PI)
        gCtx.fillStyle = color
        gCtx.fill()
    }
}

function onDownloadCanvas(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onSetColor (color) {
    setColor(color)
}

function onSetSize(size) {
    setSize(size)
}

function onSetShape(shape) {
    setShape(shape)
}

function onClearCanvas() {
    gCtx.fillStyle = '#ffffff'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() { 
    const elContainer = document.querySelector('.canvas-container') 
    gElCanvas.width = elContainer.clientWidth * 0.9
} 
    
function getEvPos (ev) {
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    const reader = new FileReader()
    
    reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
            onImageReady(img)
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onUploadImg(ev) {
    ev.preventDefault()
    const canvasData = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
            <a href="${uploadedImgUrl}">Image Url</a>
            <p>Image url: ${uploadedImgUrl}</p>
           
            <button class="btn-facebook" target="_blank" onclick="onUploadToFB('${encodedUploadedImgUrl}')">
                Share on Facebook  
            </button>
        `
    }

    uploadImg(canvasData, onSuccess)
}

function onUploadToFB(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
}